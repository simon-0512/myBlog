import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

interface Photo {
  src: string
  alt: string
  location: string
  camera: {
    aperture: string
    shutter: string
    iso: number
  }
  width: number
  height: number
  size: 'small' | 'medium' | 'large' | 'wide'
}

interface ManifestData {
  photos: Photo[]
}

async function extractExif(filePath: string) {
  try {
    const exifr = await import('exifr')
    const exif = await exifr.parse(filePath, {
      pick: ['FNumber', 'ExposureTime', 'ISO', 'GPSLatitude', 'GPSLongitude', 'ImageWidth', 'ImageHeight']
    })

    if (!exif) return null

    let location = ''
    if (exif.GPSLatitude && exif.GPSLongitude) {
      location = `${exif.GPSLatitude.toFixed(4)}, ${exif.GPSLongitude.toFixed(4)}`
    }

    let shutter = ''
    if (exif.ExposureTime) {
      if (exif.ExposureTime >= 1) {
        shutter = `${exif.ExposureTime}s`
      } else {
        shutter = `1/${Math.round(1 / exif.ExposureTime)}s`
      }
    }

    let aperture = ''
    if (exif.FNumber) {
      aperture = `f/${exif.FNumber.toFixed(1)}`
    }

    return {
      aperture,
      shutter,
      iso: exif.ISO || 0,
      location,
      width: exif.ImageWidth || 400,
      height: exif.ImageHeight || 300,
    }
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const photosDir = path.join(process.cwd(), 'public', 'photos')

    if (!fs.existsSync(photosDir)) {
      return NextResponse.json({ photos: [] })
    }

    const files = fs.readdirSync(photosDir)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))

    // Load manifest if exists (for overrides like custom alt, location, span)
    let manifest: ManifestData = { photos: [] }
    const manifestPath = path.join(process.cwd(), 'content', 'photos', 'photo-manifest.md')
    if (fs.existsSync(manifestPath)) {
      const matter = await import('gray-matter')
      const manifestContent = fs.readFileSync(manifestPath, 'utf8')
      const parsed = matter.default(manifestContent)
      manifest = parsed.data as ManifestData
    }

    // Create lookup map from manifest
    const manifestMap = new Map<string, Photo>()
    if (manifest.photos) {
      manifest.photos.forEach((p) => {
        const key = p.src.replace('/photos/', '')
        manifestMap.set(key, p)
      })
    }

    // Process each image
    const photos: Photo[] = []
    // Size patterns for masonry - varied sequence
    const sizePattern: Array<'small' | 'medium' | 'large' | 'wide'> = [
      'medium', 'small', 'wide', 'small', 'medium',
      'small', 'large', 'small', 'medium', 'small',
      'wide', 'medium', 'small', 'medium', 'large',
      'small', 'medium', 'small', 'wide', 'small',
    ]
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const filePath = path.join(photosDir, file)
      const manifestEntry = manifestMap.get(file)

      // Extract EXIF
      const exifData = await extractExif(filePath)

      // Auto-assign size based on pattern (cycles through)
      const size = sizePattern[i % sizePattern.length]

      // Use manifest values if available, otherwise use EXIF or defaults
      const photo: Photo = {
        src: `/photos/${file}`,
        alt: manifestEntry?.alt || file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        location: manifestEntry?.location || exifData?.location || '',
        camera: {
          aperture: manifestEntry?.camera?.aperture || exifData?.aperture || '',
          shutter: manifestEntry?.camera?.shutter || exifData?.shutter || '',
          iso: manifestEntry?.camera?.iso || exifData?.iso || 0,
        },
        width: manifestEntry?.width || exifData?.width || 400,
        height: manifestEntry?.height || exifData?.height || 300,
        size: (manifestEntry as any)?.size || size,
      }

      photos.push(photo)
    }

    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Failed to load photos:', error)
    return NextResponse.json({ error: 'Failed to load photos' }, { status: 500 })
  }
}

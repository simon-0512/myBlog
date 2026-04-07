'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseContentRefreshOptions {
  /** Interval in milliseconds for polling (default: 30000 = 30s) */
  refreshInterval?: number
  /** Whether to enable refresh on window focus (default: true) */
  refreshOnFocus?: boolean
  /** Initial data timestamp for comparison */
  lastUpdated?: number
}

interface UseContentRefreshReturn {
  /** Last refresh timestamp */
  lastRefresh: number
  /** Trigger a manual refresh */
  refresh: () => void
  /** Whether content is stale (needs refresh) */
  isStale: boolean
  /** Reset stale state after refresh */
  resetStale: () => void
}

/**
 * Hook for client-side content refresh (SWR-style polling)
 * Provides hot updates without page reload
 */
export function useContentRefresh(
  options: UseContentRefreshOptions = {}
): UseContentRefreshReturn {
  const { refreshInterval = 30000, refreshOnFocus = true, lastUpdated } = options

  const [lastRefresh, setLastRefresh] = useState<number>(Date.now())
  const [isStale, setIsStale] = useState<boolean>(false)

  // Check if content is stale
  useEffect(() => {
    if (!lastUpdated) return

    const checkStale = () => {
      if (lastUpdated > lastRefresh) {
        setIsStale(true)
      }
    }

    checkStale()
  }, [lastUpdated, lastRefresh])

  // Set up polling interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastRefresh(Date.now())
      setIsStale(false)
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [refreshInterval])

  // Refresh on window focus
  useEffect(() => {
    if (!refreshOnFocus) return

    const handleFocus = () => {
      setLastRefresh(Date.now())
      setIsStale(false)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshOnFocus])

  const refresh = useCallback(() => {
    setLastRefresh(Date.now())
    setIsStale(false)
  }, [])

  const resetStale = useCallback(() => {
    setIsStale(false)
  }, [])

  return {
    lastRefresh,
    refresh,
    isStale,
    resetStale,
  }
}

/**
 * Banner data refresh hook
 * Simulates checking for content updates
 */
export function useContentUpdateListener(onUpdate: () => void) {
  useEffect(() => {
    // Listen for custom content update events
    const handleUpdate = () => {
      onUpdate()
    }

    window.addEventListener('content-update', handleUpdate)
    return () => window.removeEventListener('content-update', handleUpdate)
  }, [onUpdate])
}

/**
 * Dispatch a content update event (can be called from anywhere)
 */
export function dispatchContentUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('content-update'))
  }
}

# 腾讯云部署指南 - notefund.cn

## 目录

1. [准备工作](#1-准备工作)
2. [腾讯云安全组配置（防火墙）](#2-腾讯云安全组配置防火墙)
3. [服务器环境安装](#3-服务器环境安装)
4. [项目部署](#4-项目部署)
5. [Caddy 安装与配置（反向代理 + HTTPS）](#5-caddy-安装与配置反向代理--https)
6. [域名解析](#6-域名解析)
7. [验证部署](#7-验证部署)
8. [日常维护命令](#8-日常维护命令)
9. [故障排查](#9-故障排查)

---

## 1. 准备工作

### 1.1 你需要准备的东西

| 工具 | 用途 | 获取方式 |
|------|------|----------|
| SSH客户端 | 连接服务器 | Mac/Linux 直接用终端；Windows 用 [Xshell](https://www.netsarang.com/) 或 PowerShell |
| 腾讯云账号 | 管理云服务器 | https://cloud.tencent.com |
| 域名 notefund.cn | 已备案 | 你说已备案完成 |

### 1.2 登录腾讯云控制台

1. 打开 https://console.cloud.tencent.com
2. 登录你的账号
3. 找到 **云服务器 CVM** 产品

### 1.3 记录服务器信息

在云服务器控制台，找到你的服务器，记录以下信息：

- **公网 IP**（形如：1.2.3.4）
- **登录用户名**（通常是 `root`）
- **登录密码** 或 **SSH密钥**

---

## 2. 腾讯云安全组配置（防火墙）

**这一步是干什么的？**
安全组是腾讯云的防火墙，决定哪些端口可以被外网访问。你需要打开 80（HTTP）和 443（HTTPS）端口，否则别人无法访问你的网站。

### 2.1 找到安全组

1. 在云服务器控制台，点击左侧 **安全组**
2. 点击你服务器绑定的安全组名称

### 2.2 添加规则

点击 **入站规则** → **添加规则**，填写：

| 方向 | 来源 | 协议端口 | 策略 | 说明 |
|------|------|----------|------|------|
| 入站 | 0.0.0.0/0 | TCP:80 | 允许 | HTTP网站访问 |
| 入站 | 0.0.0.0/0 | TCP:443 | 允许 | HTTPS安全访问 |
| 入站 | 0.0.0.0/0 | TCP:22 | 允许 | SSH远程连接（已默认开启） |

**来源写 `0.0.0.0/0` 表示允许所有IP访问。**

### 2.3 保存规则

点击 **确定** 保存。

---

## 3. 服务器环境安装

**这一步是干什么的？**
在服务器上安装运行博客所需的所有软件：Node.js（运行Next.js）、Git（拉取代码）。

### 3.1 连接服务器

打开终端（Mac/Linux）或 PowerShell（Windows），执行：

```bash
ssh root@你的服务器IP
```

例如：
```bash
ssh root@1.2.3.4
```

首次连接会提示确认，输入 `yes` 回车，然后输入密码。

### 3.2 更新系统软件（可选但推荐）

```bash
# CentOS/RHEL 系统
yum update -y

# 或者 Ubuntu/Debian 系统
apt update && apt upgrade -y
```

### 3.3 安装 Node.js 18.x

Next.js 14 需要 Node.js 18+，我们用官方脚本安装：

```bash
# 下载并执行 Node.js 安装脚本
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# 安装 Node.js
# CentOS
yum install -y nodejs

# Ubuntu/Debian
apt install -y nodejs
```

**验证安装成功：**
```bash
node -v   # 应该显示 v18.x.x
npm -v    # 应该显示 9.x.x
```

### 3.4 安装 Git

```bash
# CentOS
yum install -y git

# Ubuntu/Debian
apt install -y git
```

**验证安装成功：**
```bash
git --version   # 应该显示 git version 2.x.x
```

---

## 4. 项目部署

**这一步是干什么的？**
把博客代码放到服务器上，并配置成可以长期运行的服务。

### 4.1 创建网站运行用户（可选但推荐）

为了安全，不建议用 root 用户运行网站：

```bash
# 创建新用户
useradd -m -s /bin/bash deploy

# 给 deploy 用户 sudo 权限
echo "deploy ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# 切换到 deploy 用户
su - deploy
```

### 4.2 拉取博客代码

```bash
# 进入 home 目录
cd ~

# 克隆你的博客代码（把 URL 换成你实际的 Git 仓库地址）
git clone https://github.com/你的用户名/myBlog.git

# 如果你没有 Git 仓库，可以手动用 scp 上传：
# scp -r ./myBlog deploy@服务器IP:/home/deploy/
```

### 4.3 安装依赖

```bash
# 进入项目目录
cd myBlog

# 安装项目依赖
npm install
```

### 4.4 预编译项目（Build）

```bash
# 构建生产版本
npm run build
```

这会把 Next.js 代码编译成高性能的生产文件，大约需要 1-2 分钟。

**验证构建成功：**
```bash
ls -la .next/   # 应该看到包含 build 的目录
```

### 4.5 试运行测试

```bash
# 临时启动服务测试（Ctrl+C 可以停止）
npm start
```

按 `Ctrl+C` 停止后继续。

---

## 5. Caddy 安装与配置（反向代理 + HTTPS）

**这一步是干什么的？**
Caddy 是一个现代化的 Web 服务器，它会自动：
- 把 HTTP 请求转发给你的 Next.js 应用（反向代理）
- 自动申请和续期 SSL 证书（让你网站用 HTTPS）
- 不用你手动管理证书，省心！

### 5.1 安装 Caddy（二进制文件方式，推荐）

#### 方法一：下载官方编译好的二进制文件

```bash
# 回到 root 用户（如果你是 deploy 用户）
exit

# 下载 Caddy（选择适合你系统的版本）
# AMD64 (Intel/AMD 处理器)
wget https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_linux_amd64.tar.gz

# 如果你是 ARM 处理器（如部分腾讯云服务器）
# wget https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_linux_arm64.tar.gz

# 解压
tar -xzf caddy_2.7.6_linux_amd64.tar.gz

# 移动到系统路径（这样可以直接用 caddy 命令）
mv caddy /usr/local/bin/

# 赋予执行权限
chmod +x /usr/local/bin/caddy

# 验证安装
caddy version
```

#### 方法二：使用官方安装脚本

```bash
# 用官方脚本安装（自动选择正确版本）
curl -fsSL https://getcaddy.com | bash
```

### 5.2 创建 Caddy 配置目录和文件

```bash
# 创建 Caddy 配置和日志目录
mkdir -p /etc/caddy
mkdir -p /var/log/caddy

# 创建空的 Caddyfile
touch /etc/caddy/Caddyfile

# 编辑配置文件
nano /etc/caddy/Caddyfile
```

### 5.3 配置 Caddy

在编辑器中粘贴以下内容：

```caddy
notefund.cn {
    reverse_proxy localhost:3000

    log {
        output file /var/log/caddy/notefund.cn.log
    }
}
```

**配置说明：**
- `notefund.cn` - 你的域名
- `reverse_proxy localhost:3000` - 把请求转发到 Next.js 的 3000 端口
- `log` - 启用日志记录

保存文件（Nano: Ctrl+X → y → 回车）

### 5.4 格式化 Caddyfile（修复警告）

```bash
caddy fmt --overwrite /etc/caddy/Caddyfile
```

### 5.5 启动 Caddy

#### 方法一：直接运行（临时测试用）

```bash
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
```

如果看到 `serving initial configuration` 就说明启动成功。按 `Ctrl+C` 停止。

#### 方法二：创建 systemd 服务（推荐，生产环境用）

```bash
# 创建服务文件
cat > /etc/systemd/system/caddy.service << 'EOF'
[Unit]
Description=Caddy Web Server
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 重载 systemd
systemctl daemon-reload

# 启用并启动
systemctl enable --now caddy

# 检查状态
systemctl status caddy
```

看到 `active (running)` 就成功了！

---

## 6. 域名解析

**这一步是干什么的？**
把域名 notefund.cn 指向你的服务器 IP，这样用户访问 notefund.cn 就能找到你的服务器了。

### 6.1 在腾讯云添加解析记录

1. 打开 https://console.cloud.tencent.com/domain
2. 点击 **notefund.cn** 进入管理页面
3. 点击 **解析** 按钮

### 6.2 添加解析记录

点击 **添加记录**，填写：

| 主机记录 | 记录类型 | 线路类型 | 记录值 | TTL |
|----------|----------|----------|--------|-----|
| @ | A | 默认 | 你的服务器IP | 600 |
| www | A | 默认 | 你的服务器IP | 600 |

**解释：**
- `@` 表示直接访问 notefund.cn
- `www` 表示访问 www.notefund.cn
- `A` 是IPv4地址记录类型
- `记录值` 填你的服务器公网 IP

点击 **保存**。

### 6.3 等待生效

域名解析需要几分钟到几十分钟生效。可以用以下命令检查：

```bash
# Windows 用 nslookup
nslookup notefund.cn

# 或者用在线工具检查 https://tool.chinaz.com/dns/
```

---

## 7. 验证部署

**这一步是干什么的？**
确认网站已经正常运行，可以被访问到了。

### 7.1 检查服务状态

```bash
# 检查 Next.js 是否在运行
ps aux | grep "next start" | grep -v grep

# 检查 Caddy 是否在运行
sudo systemctl status caddy
```

### 7.2 启动 Next.js

```bash
# 如果 Next.js 没在运行，启动它
cd /home/deploy/myBlog
npm start &

# 或者用 PM2 管理（更稳定，见 8.5 节）
```

### 7.3 本地测试

在你的电脑浏览器里访问：

```
http://notefund.cn
```

如果能看到网站，说明部署成功！

### 7.4 检查 HTTPS 是否生效

访问：

```
https://notefund.cn
```

如果浏览器显示锁图标（证书有效），说明 HTTPS 配置成功。

---

## 8. 日常维护命令

### 8.1 查看网站进程

```bash
# 查看 Next.js 进程
ps aux | grep next
```

### 8.2 重启服务

```bash
# 重启 Caddy
sudo systemctl restart caddy

# 重启 Next.js
pkill -f "next start"
cd /home/deploy/myBlog && npm start &
```

### 8.3 更新博客内容

```bash
# 进入项目目录
cd /home/deploy/myBlog

# 拉取最新代码
git pull

# 重新构建
npm run build

# 重启服务
pkill -f "next start"
npm start &
```

### 8.4 查看日志

```bash
# Caddy 访问日志
sudo tail -f /var/log/caddy/notefund.cn.log

# Caddy 系统日志（排错用）
sudo journalctl -xeu caddy --no-pager -n 50
```

### 8.5 使用 PM2 管理 Next.js（推荐，更稳定）

PM2 可以让 Next.js 在后台稳定运行，宕机后自动重启。

```bash
# 安装 PM2
sudo npm install -g pm2

# 使用 PM2 启动 Next.js
cd /home/deploy/myBlog
pm2 start npm --name "blog" -- start

# 设置开机自启
pm2 startup
pm2 save

# 常用命令
pm2 list          # 查看状态
pm2 logs blog     # 查看日志
pm2 restart blog  # 重启
pm2 stop blog     # 停止
```

### 8.6 防火墙命令（补充）

如果服务器内部还有防火墙：

```bash
# 查看防火墙状态
sudo systemctl status firewalld   # CentOS
sudo systemctl status ufw         # Ubuntu

# 开放端口（CentOS）
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload

# 开放端口（Ubuntu）
sudo ufw allow 80
sudo ufw allow 443
sudo ufw reload
```

---

## 9. 故障排查

### 9.1 常见问题及解决方法

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 网站打不开 | 安全组没开放80/443端口 | 去腾讯云控制台开放端口 |
| HTTPS不生效 | Caddy需要时间申请证书 | 等待几分钟后重试 |
| 502 Bad Gateway | Next.js没启动 | `cd /home/deploy/myBlog && npm start &` |
| 域名解析不生效 | 解析记录未生效 | 等待最多30分钟，或检查解析记录是否正确 |
| 443端口被占用 | 其他进程占用了443端口 | 见 9.2 节 |

### 9.2 端口占用问题排查

```bash
# 查看 443 端口被哪个进程占用
lsof -i :443

# 或者
ss -tlnp | grep :443

# 停止占用 443 端口的进程
kill -9 进程PID

# 如果是 Caddy 重复启动，先停掉所有 Caddy 进程
pkill -f caddy
```

### 9.3 Caddy 启动失败排查

```bash
# 1. 先检查 Caddyfile 语法是否正确
caddy fmt --overwrite /etc/caddy/Caddyfile

# 2. 直接运行看具体错误
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile

# 3. 查看详细日志
journalctl -xeu caddy --no-pager -n 50

# 4. 检查端口是否被占用
lsof -i :443
lsof -i :80
```

### 9.4 Caddyfile 格式警告

```
Caddyfile input is not formatted; run 'caddy fmt --overwrite' to fix
```

解决方法：
```bash
caddy fmt --overwrite /etc/caddy/Caddyfile
```

### 9.5 证书申请失败

Caddy 会自动申请 Let's Encrypt 证书。如果失败：

1. 检查域名是否已经解析到服务器
2. 检查 443 端口是否开放
3. 等待几分钟后重试

手动触发证书申请：
```bash
# 重启 Caddy
sudo systemctl restart caddy

# 查看日志确认证书申请
sudo journalctl -xeu caddy --no-pager | grep -i certificate
```

### 9.6 Next.js 编译报错

```bash
# 清理重新编译
cd /home/deploy/myBlog
rm -rf .next
npm run build
```

---

## 附录：完整 Caddyfile 配置示例

```caddy
# 网站域名
notefund.cn {
    # 反向代理到 Next.js
    reverse_proxy localhost:3000

    # 压缩
    encode gzip

    # 日志
    log {
        output file /var/log/caddy/notefund.cn.log
    }
}

# 如果想同时支持 www 和非 www，可以这样：
# www.notefund.cn {
#     redir https://notefund.cn{uri}
# }
```

---

## 附录：systemd 服务文件详解

```ini
[Unit]
Description=Caddy Web Server    # 服务描述
After=network.target            # 网络启动后再启动

[Service]
Type=simple                     # 简单进程模式
ExecStart=/usr/local/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile   # 启动命令
Restart=on-failure              # 失败后重启
RestartSec=5                    # 失败5秒后重启

[Install]
WantedBy=multi-user.target       # 多用户模式下启动
```

---

按以上步骤操作，你就可以成功在腾讯云上部署你的博客了！

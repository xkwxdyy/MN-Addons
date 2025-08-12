/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 允许从局域网 IP 访问开发服务器
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://192.168.3.15:3000',
      'http://192.168.3.15:3001',
      // 添加其他可能的局域网 IP 范围
      'http://192.168.1.*:3000',
      'http://192.168.1.*:3001',
      'http://192.168.0.*:3000',
      'http://192.168.0.*:3001',
      'http://10.0.0.*:3000',
      'http://10.0.0.*:3001',
    ]
  },
  // 配置 webpack 忽略 data 目录的文件变化
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules',
          '**/.git',
          '**/data/**',  // 忽略 data 目录，防止文件变化触发 Fast Refresh
          '**/.next/**'
        ]
      }
    }
    return config
  }
}

export default nextConfig

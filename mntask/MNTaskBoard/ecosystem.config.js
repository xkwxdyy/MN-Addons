module.exports = {
  apps: [{
    name: 'mntask-board',
    script: 'pnpm',
    args: 'dev',
    cwd: '/Users/xiakangwei/Nutstore/Github/repository/MN-Addon/MNAddon-develop/mntask/MNTaskBoard',
    watch: false,
    ignore_watch: [
      'node_modules',
      'data',
      '.git',
      '.next'
    ],
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    // 自动重启设置
    max_restarts: 10,
    min_uptime: '10s',
    // 日志设置
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    // 实例设置
    instances: 1,
    exec_mode: 'fork'
  }]
}
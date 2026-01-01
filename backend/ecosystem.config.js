module.exports = {
  apps: [
    {
      name: "acms-backend",
      script: "./src/server.js",
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster", // Enable cluster mode
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      // Auto-restart configuration
      autorestart: true,
      watch: false, // Disable watch in production
      max_memory_restart: "1G", // Restart if memory exceeds 1GB
      // Logging
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      // Advanced settings
      min_uptime: "10s", // Minimum uptime before considering app stable
      max_restarts: 10, // Maximum number of restarts in 1 minute
      restart_delay: 4000, // Delay between restarts
    },
  ],
};


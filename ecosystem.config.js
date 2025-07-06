module.exports = {
  apps: [{
    name: 'backend',
    script: 'dist/server.js',
    args: 'src/index.ts',
    watch: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }]
};

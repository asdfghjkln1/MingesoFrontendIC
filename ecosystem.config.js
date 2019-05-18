module.exports = {
  apps : [{
    name: 'frontend',
    script: './src/main.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      "NODE_ENV": 'development'
    },
    env_production: {
      'NODE_ENV': 'production',
      'PORT': 9000
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : 'localhost',
      key : '~/.ssh/id_rsa.pub',
      ref  : 'origin/master',
      repo : 'git@github.com:asdfghjkln1/MingesoFrontendIC.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};

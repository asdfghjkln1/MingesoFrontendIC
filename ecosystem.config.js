
module.exports = {
  apps : [{
    name: 'frontend',
    script: 'npm',
    args: 'run build',
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
      host : '165.22.249.5',
      key : '~/.ssh/id_rsa.pub',
      ref  : 'origin/master',
      repo : 'git@github.com:asdfghjkln1/MingesoFrontendIC.git',
      path : '/var/www/production',
      'pre-setup': "apt-get install git ; ls -la",
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      'post-setup': "ls -la",
      // pre-deploy action
      'pre-deploy-local': "git reset --hard",
      // post-deploy action
      'post-deploy' : 'cd frontend && npm install && cd .. && pm2 reload ecosystem.config.js --env production && sudo service nginx restart'
    }
  }
};

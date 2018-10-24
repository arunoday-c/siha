module.exports = {
  apps : [{
    name: 'hims_internal',
    script: 'dist/server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
   // args: 'one two',
    instances: "max",
    autorestart: true,
    watch: true,
    ignore_watch:["[\\/\\\\]\\./", "node_modules"],
    exec_mode  : "cluster",
    // max_memory_restart: '1G',
    log_date_format:"DD-MM-YYYY HH:mm Z",
    max_memory_restart:"256M",
    max_restarts:10,
    error_file:"F:\LOCAL DEV\hims-app-merged\logs\access.log",
    env: {
      NODE_ENV: 'production'
    }
    // env_production: {
    //   NODE_ENV: 'production'
    // }
  }],

  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  //}
};

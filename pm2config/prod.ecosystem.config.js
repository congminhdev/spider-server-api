module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        // First application
        {
            name: "spider-server-prod",
            script: "dest/App.js",
            env: {
                NODE_ENV: "production"
            },
            log_file: "logs/production/app.log",
            merge_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm Z"
        }
    ]
};
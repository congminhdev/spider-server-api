module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        // First application
        {
            name: 'spider-server-ci',
            script: 'dest/App.js',
            env: {
                NODE_ENV: 'ci',
                PORT: 8000
            },
            "log_file": "logs/ci/app.log",
            "merge_logs": true,
            "log_date_format": "YYYY-MM-DD HH:mm Z"
        }
    ]
};
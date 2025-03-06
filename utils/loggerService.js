require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { createRollingFileLogger } = require('simple-node-logger');

// Logger directory path
const logDirectory = path.join(__dirname, '../logs');

// Ensure log directory exists or create it
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, '0777', { recursive: true });
}

// Logger options
const opts = {
    errorEventName: 'error',
    logDirectory: logDirectory,
    fileNamePattern: 'log-file-<DATE>.log',
    dateFormat: 'YYYY-MM-DD'
};

// Function to create a named logger instance
const createLogger = (name) => {
    const logger = createRollingFileLogger(opts);
    logger.setLevel(process.env.LOG_LEVEL || 'info');

    // Extend logger to include the name prefix in all logs
    const logMessage = (level, message, data) => {
        if (process.env.LOG_FLAG === 'true') {
            // Convert data to string if it's an object
            const formattedData = typeof data === 'object' ? JSON.stringify(data) : data;
            logger[level](`[${name}] ${message} ${formattedData} at ${new Date().toJSON()}`);
        }
    };

    return {
        info: (message, data = '') => logMessage('info', message, data),
        debug: (message, data = '') => logMessage('debug', message, data),
        warn: (message, data = '') => logMessage('warn', message, data),
        error: (message, data = '') => logMessage('info', message, data),
    };
};

module.exports = { createLogger };

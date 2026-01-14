/**
 * Logger utility with structured logging support
 * Integrates with error tracking services like Sentry
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'];

const log = (level, message, metadata = {}) => {
  if (LOG_LEVELS[level] > currentLogLevel) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...metadata
  };
  
  console.log(JSON.stringify(logEntry));
};

module.exports = {
  error: (message, metadata) => log('error', message, metadata),
  warn: (message, metadata) => log('warn', message, metadata),
  info: (message, metadata) => log('info', message, metadata),
  debug: (message, metadata) => log('debug', message, metadata)
};

const { Logger, transports } = require('winston');

const logger = new Logger({
  transports: [
    new transports.Console({
      colorize: true,
      handleExceptions: true,
      level: process.env.LOG_LEVEL,
      prettyPrint: true
    })
  ]
})

module.exports = logger;

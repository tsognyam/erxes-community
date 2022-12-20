const { createLogger, format, transports } = require('winston');
const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/error.log' }),
        new transports.File({ filename: 'log/info.log' })
    ]
});

const loggerID = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/id_service.log' }),
    ]
});

const loggerAccess = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/access.log', level: 'info' }),
    ]
});

const loggerMigration = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/migration.log', level: 'info' }),
    ]
});

const loggerMIT = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/MIT.log', level: 'info' }),
    ]
});

const loggerQuery = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/query.log', level: 'info' }),
    ]
});

const loggerTdb = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/tdb.log', level: 'info' }),
    ]
});

const loggerMCSD = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/mcsd.log', level: 'info' }),
    ]
});

const loggerMSCC = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/mscc.log', level: 'info' }),
    ]
});
const loggerAND_IPO = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/AND_IPO.log', level: 'info' }),
    ]
});
const loggerQPAY = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'log/qpay.log', level: 'info' }),
    ]
});

// const loggerText = (message) => {
//     let data = {
//         date: new Date(),
//         message: message,

//     }
//     console.log('message',message);
//     logger.info('info',message)
// }

module.exports = {
    loggerQPAY,
    logger,
    loggerMIT,
    loggerAccess,
    loggerQuery,
    loggerTdb,
    loggerMCSD,
    loggerMSCC,
    loggerAND_IPO,
    loggerID,
    loggerMigration
}
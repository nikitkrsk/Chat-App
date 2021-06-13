import winston from "winston";

export const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    // Delete on Prod - no console logs
    new winston.transports.Console({
      level: "error",
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize()
      ),
    }),
    new winston.transports.File({
      filename: "combined.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

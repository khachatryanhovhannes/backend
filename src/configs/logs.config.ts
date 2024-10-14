import expressWinston from "express-winston";
import { format, transports } from "winston";

const logsConfig = expressWinston.logger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "src/logs/error.log", level: "error" }),
    new transports.File({
      filename: "src/logs/warning.log",
      level: "warn",
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.metadata(),
    format.prettyPrint()
  ),
  statusLevels: true,
});

export default logsConfig;

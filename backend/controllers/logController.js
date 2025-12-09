import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { appLogger } from "../middleware/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE_NAME = "app.log";
const MAX_LOG_LINES = 50;

const parseLogLine = (line) => {
  try {
    return JSON.parse(line);
  } catch {
    return { raw: line };
  }
};

export const getLogs = (req, res) => {
  try {
    const logsPath = path.join(__dirname, "..", "logs", LOG_FILE_NAME);

    if (!fs.existsSync(logsPath)) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No logs found",
      });
    }

    const content = fs.readFileSync(logsPath, "utf-8");
    const lines = content.trim().split("\n").filter((line) => line.length > 0);
    const lastLines = lines.slice(-MAX_LOG_LINES);
    const parsedLogs = lastLines.map(parseLogLine);

    return res.status(200).json({
      status: "success",
      data: parsedLogs,
      count: parsedLogs.length,
    });
  } catch (error) {
    appLogger.error("Error fetching logs:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch logs",
    });
  }
};

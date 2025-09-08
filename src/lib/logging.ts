// src/lib/logging.ts

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMessage {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

/**
 * Simple logger utility.
 * - Console logs in development
 * - Extendable for external log services in production
 */
export class Logger {
  private static format(level: LogLevel, message: string, context?: Record<string, any>): LogMessage {
    return {
      level,
      message,
      context,
      timestamp: new Date().toISOString()
    };
  }

  static debug(message: string, context?: Record<string, any>) {
    const log = this.format("debug", message, context);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[DEBUG]", log);
    }
  }

  static info(message: string, context?: Record<string, any>) {
    const log = this.format("info", message, context);
    console.info("[INFO]", log);
  }

  static warn(message: string, context?: Record<string, any>) {
    const log = this.format("warn", message, context);
    console.warn("[WARN]", log);
  }

  static error(message: string, context?: Record<string, any>) {
    const log = this.format("error", message, context);
    console.error("[ERROR]", log);

    // In production: send to external logging service
    if (process.env.NODE_ENV === "production") {
      // Example: push to external API, Firestore, or Logtail
      // fetch("https://logging-service.com/ingest", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(log)
      // });
    }
  }
}

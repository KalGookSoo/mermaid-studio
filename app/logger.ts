import log from "loglevel";

const defaultLevel = process.env.NODE_ENV === "production" ? "warn" : "debug";

export function getLogger(name: string) {
  const logger = log.getLogger(`mermaid-studio:${name}`);
  logger.setLevel(defaultLevel);
  return logger;
}

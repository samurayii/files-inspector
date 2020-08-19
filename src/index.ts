#!/usr/bin/env node
import config from "./lib/entry";
import { Logger } from "./lib/logger";
import { Cron } from "./lib/cron";
import { Inspector } from "./lib/inspector";
import { Notifications } from "./lib/notifications";

const logger = new Logger(config.logger);
const inspector = new Inspector(config.inspector, logger);
const notifications = new Notifications(config.notifications, logger);
const cron = new Cron(config.cron, inspector, notifications, logger);

cron.run();

logger.info("File inspector running");
import { ICronConfig } from "./cron";
import { ILoggerConfig } from "./logger";
import { IInspectorConfig } from "./inspector";
import { IEmailOutputConfig } from "./notifications";

export interface IAppConfig {
    logger: ILoggerConfig
    cron: ICronConfig
    notifications: Array<IEmailOutputConfig>
    inspector: IInspectorConfig
}
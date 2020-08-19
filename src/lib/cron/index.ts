import { ICronConfig, ICron } from "./interfaces";
import { ILogger } from "../logger";
import { CronJob } from "cron";
import { IInspector, IInspectorResult } from "../inspector";
import { INotifications } from "../notifications";

export * from "./interfaces";

export class Cron implements ICron {

    private _start_flag: boolean
    private _job: CronJob

    constructor (
        private readonly _config: ICronConfig,
        private readonly _inspector: IInspector,
        private readonly _notifications: INotifications,
        private readonly _logger: ILogger
    ) {

        this._start_flag = false;

        this._job = new CronJob(this._config.interval, () => {
            
            if (this._start_flag !== true) {

                this._start_flag = true;
                
                this._execute();
                
                this._start_flag = false;

            }
            
        },
        null,
        false,
        this._config.time_zone);

    }

    run (): void {
        this._job.start();
    }

    stop (): void {
        this._job.stop();
    }

    _execute (): void {
        
        const result: IInspectorResult = this._inspector.inspect();

        if (result.count > 0) {
            this._notifications.push(result);
        }

    }

}
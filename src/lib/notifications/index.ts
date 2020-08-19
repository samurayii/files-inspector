import { EmailOutput } from "./lib/email-output";
import { 
    INotifications, 
    IEmailOutputConfig,
    IOutput,
    IMessage
} from "./interfaces";
import { ILogger } from "../logger/interfaces";

export * from "./interfaces";

export class Notifications implements INotifications {

    private readonly _outputs_list: {
        [key: string]: IOutput
    }

    constructor (
        private readonly _outputs: Array<IEmailOutputConfig>,
        private readonly _logger: ILogger
    ) {

        this._outputs_list = {};

        for (const output of this._outputs) {

            if (this._outputs_list[output.name] !== undefined) {
                throw new Error(`[Notifications] Output named "${output.name}" already exist`);
            }

            switch(output.output_type) { 
                case "email": { 
                    this._outputs_list[output.name] = new EmailOutput(<IEmailOutputConfig>output, this._logger);
                    break;
                }
                default: { 
                    throw new Error(`[Notifications] Output type ${output.output_type} not support`);
                } 
            }

        }

    }

    push (message: IMessage = {}): void {

        if (typeof message !== "object") {
            throw new Error("Output name must be object");
        }

        for (const output_name in this._outputs_list) {
            this._outputs_list[output_name].push(message);
        }

    }

}
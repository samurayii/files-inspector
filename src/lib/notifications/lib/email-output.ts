import { IOutput, IMessage, IEmailOutputConfig } from "../interfaces";
import { ILogger } from "../../logger/interfaces";
import * as fs from "fs";
import { resolve } from "path";
import { createTransport, TransportOptions} from "nodemailer";
import Handlebars from "handlebars";


interface TEmailOptions {
    from: string
    to: string
    subject: string
    cc?: string
    bcc?: string 
    text?: string
    html?: string
}

interface TTransportOptions extends TransportOptions {
    host: string
    port: number
    secure: boolean
    ignoreTLS: boolean
    auth?: {
        type: string
        user: string
        password: string
        clientId?: string
        clientSecret?: string
        refreshToken?: string
        accessToken?: string
        expires?: number
        accessUrl?: string
        serviceClient?: string
        privateKey?: string
    }
}

export class EmailOutput implements IOutput {

    constructor (
        private readonly _config: IEmailOutputConfig,
        private readonly _logger: ILogger
    ) {}

    push (message: IMessage, attempt: number = 1): void {

        this._logger.log(`[Notifications] Output "${this._config.name}", sending message"`, "dev");

        if (this._config.enable === true) {

            const email_options: TEmailOptions = {
                from: this._config.from,
                to: this._config.to,
                subject: this._config.subject,
                cc: this._config.cc,
                bcc: this._config.bcc
            };

            const transport_options: TTransportOptions = {
                host: this._config.host,
                port: this._config.port,
                secure: this._config.secure,
                ignoreTLS: this._config.ignore_tls
            };
    
            if (this._config.auth !== undefined) {
                transport_options.auth = {
                    type: this._config.auth.type,
                    user: this._config.auth.username,
                    password: this._config.auth.password,
                    clientId: this._config.auth.client_id,
                    clientSecret: this._config.auth.client_secret,
                    refreshToken: this._config.auth.refresh_token,
                    accessToken: this._config.auth.access_token,
                    expires: this._config.auth.expires,
                    accessUrl: this._config.auth.access_url,
                    serviceClient: this._config.auth.service_client,
                    privateKey: this._config.auth.private_key,
                };
            }

            try {

                const template_path = resolve(__dirname, "./templates/email_default.hbs");
                const template_body = fs.readFileSync(template_path).toString();
                const template = Handlebars.compile(template_body);
                const result_message = template(message);

                email_options.html = result_message;

                const transporter = createTransport(transport_options);

                const _push = () => {

                    transporter.verify().then( () => {
                        return transporter.sendMail(email_options);
                    }).then( () => {
                        this._logger.log(`[Notifications] Output "${this._config.name}", message sended to email "${this._config.to}"`, "dev");
                        if (this._config.cc !== undefined) {
                            this._logger.log(`[Notifications] Output "${this._config.name}", message sended to cc email "${this._config.cc}"`, "dev");
                        }
                        if (this._config.bcc !== undefined) {
                            this._logger.log(`[Notifications] Output "${this._config.name}", message sended to bcc email "${this._config.bcc}"`, "dev");
                        }
                    }).catch( (error: Error) => {
                        
                        attempt = attempt + 1;
                            
                        if (attempt > this._config.attempts) {
                            this._logger.error(`[Notifications] Output "${this._config.name}", cannot execute request. Error: ${error}. Attempts exhausted`);
                        } else {
                            this._logger.warn(`[Notifications] Output "${this._config.name}", cannot execute request. Error: ${error}. ${this._config.attempts - attempt + 1} attempts left. Repeat after ${this._config.attempt_interval} sec.`);
                            setTimeout( () => {
                                _push();
                            }, this._config.attempt_interval * 1000);
                        }
            
                    });

                };
        
                _push();

            } catch (error) {
                this._logger.error(`[Notifications] Output "${this._config.name}", error parsing message. ${error}`);
                this._logger.red(error.stack, "debug");
            }

        }

    }

}
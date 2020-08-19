export interface IOutputConfig {
    enable: boolean
    name: string
    output_type: string
}

export interface IEmailOutputConfig extends IOutputConfig {
    attempts?: number
    attempt_interval?: number,
    host?: string
    port?: number
    from?: string
    to?: string
    cc?: string
    bcc?: string
    subject?: string
    secure?: boolean
    ignore_tls?: boolean
    auth?: {
        type?: string
        username?: string
        password?: string
        client_id?: string
        client_secret?: string
        refresh_token?: string
        expires?: number
        access_token?: string
        access_url?: string
        service_client?: string
        private_key?: string
    }
}

export interface IMessage {
    files?: Array<string>
}

export interface INotifications {
    push: (message: IMessage) => void
}

export interface IOutput {
    push: (message: IMessage) => void
}
export interface ICronConfig {
    interval: string
    time_zone: string
}

export interface ICron {
    run: () => void
    stop: () => void
}
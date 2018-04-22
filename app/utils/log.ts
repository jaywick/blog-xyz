import { LoggingStore } from '../store'

export class Log {
    constructor(private store: LoggingStore) {
    }

    private write(message: string, ip: string, severity: 'debug' | 'info' | 'warn' | 'fail') {
        this.consoleLog(message, severity)

        this.store.logs.insert({
            message,
            severity,
            date: new Date(),
            ip,
        })
    }

    private consoleLog(message: string, severity: 'debug' | 'info' | 'warn' | 'fail') {
        if (!this.store) {
            console.error(`Failed to log error. ${message}`)
            return
        }

        if (severity === 'fail') console.error(message)
        if (severity === 'warn') console.warn(message)
        if (severity === 'info') console.info(message)
        if (severity === 'debug') console.debug(message)
    }

    debug(message: string, ip?: string) {
        this.write(message, ip, 'debug')
    }

    info(message: string, ip?: string) {
        this.write(message, ip, 'info')
    }

    warn(message: string, ip?: string) {
        this.write(message, ip, 'warn')
    }

    fail(message: string, ip?: string) {
        this.write(message, ip, 'fail')
    }
}

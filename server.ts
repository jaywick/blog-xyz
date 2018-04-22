import { Log } from './app/utils/log'
import { Stats } from './app/utils/stats'
import { DataStore, LoggingStore } from './app/store';
import { App } from './app/app'

const loggingStore = new LoggingStore()
const app = new App(new DataStore(), new Log(loggingStore), new Stats(loggingStore))
app.start()

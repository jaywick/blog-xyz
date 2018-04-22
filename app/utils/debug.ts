
export const isDebug = () => /--debug|--inspect/.test(process.execArgv.join(' '));

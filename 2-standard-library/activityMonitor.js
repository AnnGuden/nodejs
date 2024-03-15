const childProcess = require('node:child_process');
const fs = require('node:fs');
const { promisify } = require('node:util');

const LOG_FILE_PATH = 'activityMonitor.log';
const WIN32_PLATFORM = 'win32';
const WIN_GET_PROCESS_COMMAND = 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \' \' + $_.CPU + \' \' + $_.WorkingSet }"';
const UNIXOS_GET_PROCESS_COMMAND = 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';

let logData = '';

const getCurrentTime = () => {
    return Math.floor(Date.now() / 1000);
}

const getProcessCommand = () => {
    return process.platform === WIN32_PLATFORM ? WIN_GET_PROCESS_COMMAND : UNIXOS_GET_PROCESS_COMMAND;
}

const logSystemActivity = (data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(LOG_FILE_PATH, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

const truncateText = (text, maxlength) => {
    if (text.length > maxlength) {
        return text.slice(0, maxlength - 3) + '...';
    }
    return text;
}

const execAsync = promisify(childProcess.exec);

const monitorSystem = async () => {
    try {
        let command = getProcessCommand();
        const { stdout, stderr } = await execAsync(command);
        let outputTrimmed = stdout.trim();
        let processInfo = truncateText(outputTrimmed, process.stdout.columns - 1);
        process.stdout.clearLine();
        process.stdout.write(processInfo + '\r');

        let time = getCurrentTime();
        logData += `${time} : ${outputTrimmed}\n`;

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            logData += `stderr: ${stderr}\n`;
        }
    } catch (error) {
        console.error(`Error executing command: ${error}`);
        logData += `Error executing command: ${error}\n`
    }
}

// Monitor with a refresh rate of 10 times per second
setInterval(monitorSystem, 100);

setInterval(async () => {
    try {
        await logSystemActivity(logData);
        logData = '';
    } catch (error) {
        console.error('Error writing to log file:', error)
    }

}, 60000)
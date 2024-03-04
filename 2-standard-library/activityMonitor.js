const childProcess = require('child_process');
const fs = require('fs');

const logFilePath = 'activityMonitor.log';

let logData = '';

const getCurrentTime = () => {
    return Math.floor(Date.now() / 1000);
}

const getProcessCommand = () => {
    if (process.platform === 'win32') {
        return 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \' \' + $_.CPU + \' \' + $_.WorkingSet }"';
    } else {
        return 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';
    }
}

const logSystemActivity = (data) => {
    fs.appendFile(logFilePath, data, (err) => {
        if (err) throw err;
    });
}

const truncateText = (text, maxlength) => {
    if (text.length > maxlength) {
        return text.slice(0, maxlength - 3) + '...';
    }
    return text;
}

const monitorSystem = () => {
    let command = getProcessCommand();
    childProcess.exec(command, (error, stdout, stderr) => {
        let outputTrimmed = stdout.trim();
        let processInfo = truncateText(outputTrimmed, process.stdout.columns - 1);
        process.stdout.clearLine();
        process.stdout.write(processInfo + '\r');

        let time = getCurrentTime();
        logData += `${time} : ${outputTrimmed}\n`;

        if (error !== null) {
            console.log(`error: ${error}`);
        }
    });
}

// Monitor with a refresh rate of 10 times per second
setInterval(monitorSystem, 100);

setInterval(() => {
    logSystemActivity(logData);
    logData = '';
}, 60000)
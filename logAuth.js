const fs = require('fs');

process.on('message', (message) => {
  const logData = {
    timestamp: new Date().toISOString(),
    username: message.username,
    ipAddress: message.ipAddress
  };
  fs.appendFileSync('auth_log.txt', JSON.stringify(logData) + '\n');
  process.exit();
});

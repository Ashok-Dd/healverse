// set-ip.js
const os = require('os');
const fs = require('fs');
const interfaces = os.networkInterfaces();

let ip;

for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            ip = net.address;
            break;
        }
    }
    if (ip) break;
}

const envContent = `EXPO_PUBLIC_API_URL=http://${ip}:8080\n`;

fs.writeFileSync('.env', envContent);
console.log('✅ Updated .env with IP:', ip);

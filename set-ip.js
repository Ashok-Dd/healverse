// set-ip.js - LOCAL DEV ONLY. Writes your LAN IP into .env.local (git-ignored) as EXPO_PUBLIC_API_URL.
// Never part of a release build: EAS does not read .env.local and eas.json sets the URL per profile.
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

if (!ip) {
    console.error('No LAN IPv4 address found.');
    process.exit(1);
}

fs.writeFileSync('./.env.local', `EXPO_PUBLIC_API_URL=http://${ip}:8080\n`);
console.log('Wrote EXPO_PUBLIC_API_URL to .env.local with IP:', ip);

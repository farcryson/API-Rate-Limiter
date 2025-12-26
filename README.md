### API Rate Limiter in Node.js
A high-performance rate-limiting middleware in Redis.

**Features:**

* **Sliding Window Log:** Precise tracking using Redis Sorted Sets.
* **Token Bucket:** Efficient burst handling using Redis Hashes.
* **Scalable:** Centralized state management for distributed systems.

**Prerequisites:**
* Node.js
* Redis

**How to Run:**
```bash
# install dependencies
npm install express redis

# start redis server (if not started) 
redis-server

# run the server
node index.js
```

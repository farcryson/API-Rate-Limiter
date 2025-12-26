import express from "express";
import { createClient } from "redis";

const app = express();
const PORT = 3000;

// create redis client
const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

// connect
await client.connect();
console.log("✅ Connected to Redis");


//sliding window 
async function rateLimiter(req, res, next) {
        const ip = req.ip;
        console.log(ip);
        const key = `rate_limit:${ip}`;

        const now = Date.now();
        const windowStart = now - 60000;

    const result = await client.multi()     // way to execute mutiple commands at once
                    .zAdd(key, [{ value: now + '-' + Math.random(), score: now}])   // add key, value and score
                    .zRemRangeByScore(key, 0, windowStart)  // remove the range before 60 sec from now
                    .zCard(key)     // count no of values in the current range
                    .expire(key, 60)    // set the expiry for the key
                    .exec();

    const requestCount = result[2];    
    if(requestCount > 10) {
        res.status(429).send({
            "message": "Too many requests"
        })
    }
    else {
        next();
    }
};


// Token Bucket method
async function tokenBucket(req, res, next) {
    const ip = req.ip;
    const key = `token_bucket:${ip}`;
    const maxTokens = 10;
    const refillRate =  1;
    
    const bucket = await client.hGetAll(key);
    const currentTokens = bucket.tokens ? parseFloat(bucket.tokens) : maxTokens;
    let lastRefillTime = bucket.lastRefill ? parseInt(bucket.lastRefill) : Date.now(); 

    const elapsedTime = (Date.now() - lastRefillTime) / 1000;

    let newTokens = Math.min(10, currentTokens + (elapsedTime * refillRate));

    if(newTokens >= 1) {
        newTokens--;
        lastRefillTime = Date.now();
        await client.hSet(key, {
            'tokens': newTokens,
            'lastRefill': lastRefillTime
        })
        next();
    }
    else {
        res.status(429).send({
            "message": "Too many requests"
        })
    }
};


// app.get('/', rateLimiter, (req, res) => {
//     res.send('<h1> API is working! </h1>');
// });

app.get('/', tokenBucket, (req, res) => {
    res.send('<h1> API is working! </h1>');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

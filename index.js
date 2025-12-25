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


async function rateLimiter(req, res, next) {
        const ip = req.ip;
        console.log(ip);
        const key = `rate_limit:${ip}`;

        const now = Date.now();
        const windowStart = now - 60000;

    const result = await client.multi()
                    .zAdd(key, [{ value: now + '-' + Math.random(), score: now}])
                    .zRemRangeByScore(key, 0, windowStart)
                    .zCard(key)
                    .expire(key, 60)
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

app.get('/', rateLimiter, (req, res) => {
    res.send('<h1> API is working! </h1>');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

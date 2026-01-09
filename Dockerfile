FROM node:latest

WORKDIR /rate-limiter

COPY package.json ./

RUN npm install

COPY index.js ./

CMD ["node", "index.js"]


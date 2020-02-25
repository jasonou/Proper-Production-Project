FROM node:12.16.1-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
RUN npm install pm2 -g

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "sh", "-c", "node --optimize-for-size --max-old-space-size=460 --gc-interval=100 ./bin/start.js" ]

FROM node:12-alpine

RUN mkdir -p /home/node/store/node_modules && chown -R node:node /home/node/store
RUN mkdir -p /data/db

WORKDIR /home/node/store
COPY package*.json ./

USER node
RUN npm install
COPY --chown=node:node . .

VOLUME /home/node/store /data/db

EXPOSE 24041

CMD [ "npm", "start" ]
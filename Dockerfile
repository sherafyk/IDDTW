FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY payload ./payload
COPY services ./services
CMD ["node", "payload/server.js"]

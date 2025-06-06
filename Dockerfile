FROM node:18-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY payload ./payload
COPY services ./services
CMD ["node", "payload/server.js"]

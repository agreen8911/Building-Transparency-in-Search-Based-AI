FROM node:22-alpine3.22

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

RUN chown -R nextjs:nodejs /app && chmod -R 755 /app

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "dev"]
FROM node:14-slim as builder
WORKDIR /usr/app
COPY ./package.json .
RUN yarn install --production

FROM node:14-slim
WORKDIR /usr/app
COPY . .
COPY --from=builder /usr/app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "index.js"]


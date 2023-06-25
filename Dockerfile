# Install packages and build
FROM node:18-alpine as builder

ENV NODE_ENV build

WORKDIR /app

# If an .env file is required for your application, create a default one here
# .env.skel 파일이 없다면 아래 줄을 지워주세요
COPY .env.skel /app/.env

COPY . /app

RUN yarn install

# Copy build to production image
FROM node:18-alpine

ENV NODE_ENV production

USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/yarn.lock ./
COPY --from=builder --chown=node:node /app/.env ./
COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/ ./

# 실행시킬 파일명이 index.js가 아니라면 적절히 변경해주세요
CMD ["node", "app.js"]
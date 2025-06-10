FROM node:22.16.0-alpine3.22

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm install --prod --frozen-lockfile

COPY . .

EXPOSE 4500
CMD [ "pnpm", "start" ]

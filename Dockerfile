FROM node:alpine
WORKDIR /repo
RUN corepack enable pnpm
COPY pnpm-lock.yaml .
RUN pnpm fetch
COPY . .
RUN pnpm i --offline
CMD ["pnpm", "run", "start", "--filter=backend"]

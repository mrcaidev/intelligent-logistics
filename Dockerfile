FROM node:alpine
WORKDIR /repo
RUN corepack enable pnpm
COPY pnpm-lock.yaml .
RUN pnpm fetch
COPY . .
RUN pnpm i --offline
RUN pnpm run build --filter=backend
RUN cd apps/backend
CMD ["pnpm", "run", "start"]

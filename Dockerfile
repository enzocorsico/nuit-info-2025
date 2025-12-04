FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .

COPY pnpm-workspace.yaml .
  
RUN pnpm install

COPY . .
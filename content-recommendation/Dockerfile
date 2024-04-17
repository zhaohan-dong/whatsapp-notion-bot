FROM node@sha256:982b5b6f07cd9241c9ebb163829067deac8eaefc57cfa8f31927f4b18943d971

LABEL organization="MSII_SDG"
LABEL authors="zhaohan_dong"
LABEL version="1.0.0"

WORKDIR /app
COPY package.json /app
RUN yarn install --production && yarn cache clean --all
COPY ./dist /app

CMD sleep 60 && node index.js
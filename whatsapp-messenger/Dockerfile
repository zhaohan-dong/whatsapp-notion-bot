FROM node@sha256:abe13b25e07ccaedcc8797120c37781f0462a0f0682105cf2d8b8d6f99070d55
LABEL organization="MSII_SDG"
LABEL authors="zhaohan_dong"
LABEL version="1.0.0"

WORKDIR /app
COPY package.json /app

# Install dependencies for puppeteer, see more here: https://wwebjs.dev/guide/#installation
RUN apt-get update && apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

RUN yarn install --production && yarn cache clean --all

COPY ./dist /app

ENTRYPOINT ["node", "index.js"]
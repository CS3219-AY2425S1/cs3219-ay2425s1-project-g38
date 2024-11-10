FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src ./src

COPY ./tsconfig.json ./

RUN mkdir -p /usr/src/app/logs

RUN npm run build

CMD ["npm", "start"]

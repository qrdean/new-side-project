FROM node:16.13

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

ENV PORT=80
ENV DB_HOST=librarymysql
ENV DB_PORT=3306

CMD [ "npm", "start" ]

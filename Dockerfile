FROM node
WORKDIR /app

COPY package.json .
COPY .env /app/.env

RUN npm install
RUN npm uninstall bcrypt --save
RUN npm install bcrypt

COPY . ./
EXPOSE $PORT

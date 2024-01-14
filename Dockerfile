FROM node
WORKDIR /app
COPY package.json .

RUN apt-get update && \
    apt-get install -y libssl-dev

RUN npm install
RUN npm uninstall bcrypt --save
RUN npm install bcrypt

COPY . ./
EXPOSE $PORT

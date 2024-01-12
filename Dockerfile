FROM node
WORKDIR /app
COPY package.json .

RUN npm install
RUN npm uninstall bcrypt --save
RUN npm install bcrypt

COPY . ./
EXPOSE $PORT
CMD ["node", "server.js"]
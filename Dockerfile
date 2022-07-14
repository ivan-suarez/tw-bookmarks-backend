FROM node:18-alpine

WORKDIR /home

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081
CMD ["node", "index.js"]

FROM node:19-alpine

WORKDIR /home

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "start"]
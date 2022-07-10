FROM node:16
WORKDIR /home/shorturl-nestjs-01
COPY package*.json ./
RUN npm i
EXPOSE 3000
CMD [ "npm", "start" ]
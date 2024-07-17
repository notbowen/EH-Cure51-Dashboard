FROM ubuntu:20.04

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 443

CMD ["node", "app.js"]

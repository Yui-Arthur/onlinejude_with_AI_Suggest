FROM node:latest
RUN mkdir /usr/src/app onlineJudge
COPY onlineJudge  /usr/src/app/onlineJudge
WORKDIR /usr/src/app/onlineJudge

CMD node src/app.js
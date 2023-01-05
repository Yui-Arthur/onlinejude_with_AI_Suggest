FROM eclipse-temurin:11

FROM node:latest
RUN mkdir /usr/src/app onlineJudge
COPY onlineJudge  /usr/src/app/onlineJudge
WORKDIR /usr/src/app/onlineJudge
RUN apt update && apt-get -y install xvfb && apt-get install chromium -y && apt install -y default-jdk && apt install -y default-jre
RUN wget https://bootstrap.pypa.io/get-pip.py && python3 get-pip.py
RUN pip3 install -r src/models/chatGPT/requirement.txt

#RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
#RUN apt-get -y install ./google-chrome-stable_current_amd64.deb

CMD node src/app.js
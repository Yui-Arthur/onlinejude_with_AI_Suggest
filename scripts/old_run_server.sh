docker run -d --name onlinejudge -p 8001:8001 \
-v /home/a10955psys/onlineJudge/uploadfile:/usr/src/app/onlineJudge/uploadfile \
-v /home/a10955psys/onlineJudge/view:/usr/src/app/onlineJudge/view \
yuiarthur/onlinejudge


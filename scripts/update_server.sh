docker stop onlinejudge
docker rm onlinejudge
docker pull yuiarthur/onlinejudge

docker run -d --name onlinejudge -p 8001:8001 \
yuiarthur/onlinejudge


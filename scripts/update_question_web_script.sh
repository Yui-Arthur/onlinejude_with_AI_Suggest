git clone https://github.com/Yui-Arthur/onlinejude_with_AI_Suggest.git 
sudo rm -r ./scripts/*
sudo rm -r ./question/*
sudo rm -r ./views/*
mv onlinejude_with_AI_Suggest/scripts ./
cp -a onlinejude_with_AI_Suggest/onlineJudge/views/. ./views/
cp -a onlinejude_with_AI_Suggest/onlineJudge/question/. ./question/
sudo rm -r onlinejude_with_AI_Suggest
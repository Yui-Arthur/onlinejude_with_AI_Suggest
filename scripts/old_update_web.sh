git clone https://github.com/Pinpunyu/AI_Online_Judge.git
dir=$(pwd)
sudo rm -r $dir/view/*
sudo mv $dir/AI_Online_Judge/* $dir/view
sudo rm -r $dir/AI_Online_Judge

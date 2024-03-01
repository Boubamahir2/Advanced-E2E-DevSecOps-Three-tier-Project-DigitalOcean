# !/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

# # this code here is to ignore new kernel popup
# # ignore any interactive questions, its very important when running code with shell script or else your terminal will timeout
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade  -y

# Install Docker
sudo apt install docker.io -y
# sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu
sudo systemctl restart docker
sudo chmod 777 /var/run/docker.sock
echo "Docker installed and started successfully!"
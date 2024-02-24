!/bin/bash
# set -e  # Exit immediately if a command exits with a non-zero status

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

# Update the package index, and install the latest version of Docker Compose:
sudo apt install docker-compose -y

# set env variables
#we move the .env file that moved earlier with remote-exect to .profile
cd ~/
sudo  tee -a nano .profile <<EOF
set -o allexport; source /home/.env set +o allexport
EOF

# # clone code repo
cd /home

git clone https://github.com/Boubamahir2/Advanced-E2E-DevSecOps-Three-tier-Project-DigitalOcean.git


# navigate to the folder in which you have all the code run the following command
# cd Advanced-E2E-DevSecOps-Three-tier-Project-DigitalOcean/application

# docker-compose up -d



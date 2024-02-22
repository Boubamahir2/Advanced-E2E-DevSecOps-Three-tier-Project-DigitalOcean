!/bin/bash
# set -e  # Exit immediately if a command exits with a non-zero status

# # this code here is to ignore new kernel popup 
# # ignore any interactive questions, its very important when running code with shell script or else your terminal will timeout
DEBIAN_FRONTEND=noninteractive apt-get upgrade  -y

# Install Docker
sudo apt install docker.io -y
# sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu
sudo systemctl restart docker
sudo chmod 777 /var/run/docker.sock
echo "Docker installed and started successfully!"
# Run Docker Container of Sonarqube

# clone code repo
cd /home
git clone https://github.com/Boubamahir2/Advanced-E2E-DevSecOps-Three-tier-Project-DigitalOcean.git

# cd into the backend folder
cd Advanced-E2E-DevSecOps-Three-tier-Project-DigitalOcean/Application-Code/backend

# lets build the docker image of our application backend
docker build -t server .


# cd into the backend folder
cd Advanced-E2E-DevSecOps-Three-tier-Project-DigitalOcean/Application-Code/frontend
docker build -t myapp .



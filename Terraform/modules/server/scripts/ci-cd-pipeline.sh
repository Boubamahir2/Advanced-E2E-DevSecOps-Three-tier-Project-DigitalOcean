# !/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# this code here is to ignore new kernel popup 
# ignore any interactive questions, its very important when running code with shell script or else your terminal will timeout
sudo apt update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade  -y
sudo apt install openjdk-17-jre-headless -y
java --version
echo "openjdk installed successfully!"

#jenkins
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
/etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update -y
sudo apt-get install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins
echo "jenkins installed and started successfully!"

# Install Docker
sudo apt install docker.io -y
sudo usermod -aG docker jenkins
# sudo usermod -aG docker ubuntu
sudo systemctl restart docker
sudo chmod 777 /var/run/docker.sock
echo "Docker installed and started successfully!"

# Run Docker Container of Sonarqube
docker volume create sonarqube_data
docker volume create sonarqube_extensions
docker volume create sonarqube_logs
# docker run -d --name sonar -p 9000:9000 sonarqube:lts-community
docker run -d --name sonar \
  -p 9000:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  -v sonarqube_logs:/opt/sonarqube/logs \
  sonarqube:lts-community

# install trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.49.1
echo "Trivy installed and started successfully!"    

# Install Helm
sudo snap install helm --classic 
echo "Helm installed successfully!"

# Install and start Nginx as a reverse proxy
sudo apt install nginx  -y
sudo systemctl enable nginx
sudo systemctl start nginx
echo "Nginx installed and started successfully!"

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
echo "Certbot installed successfully!"


echo "--------------------Jenkins Password--------------------"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

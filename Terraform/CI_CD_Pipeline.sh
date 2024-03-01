# !/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# this code here is to ignore new kernel popup 
# ignore any interactive questions, its very important when running code with shell script or else your terminal will timeout
DEBIAN_FRONTEND=noninteractive apt-get upgrade  -y

sudo apt update -y
sudo apt install fontconfig openjdk-17-jre -y
java -version
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
docker run -d --name sonar -p 9000:9000 sonarqube:lts-community

# install trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.49.1
echo "Trivy installed and started successfully!"    

# Install Helm
sudo snap install helm --classic 
echo "Helm installed successfully!"

# Install and start Nginx as a reverse proxy
sudo apt upgrade -y
sudo apt install nginx  -y
sudo systemctl enable nginx
sudo systemctl start nginx
echo "Nginx installed and started successfully!"

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
echo "Certbot installed successfully!"

echo "--------------------Installing K9s--------------------"
wget https://github.com/derailed/k9s/releases/download/v0.25.18/k9s_Linux_x86_64.tar.gz
sudo tar -xvzf k9s_Linux_x86_64.tar.gz
sudo install -m 755 k9s /usr/local/bin
echo "K9s installed and started successfully!"

# Install Prometheus and Grafana:
sudo useradd --system --no-create-home --shell /bin/false prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.47.1/prometheus-2.47.1.linux-amd64.tar.gz

# Extract Prometheus files, move them, and create directories:
tar -xvf prometheus-2.47.1.linux-amd64.tar.gz
cd prometheus-2.47.1.linux-amd64/
sudo mkdir -p /data /etc/prometheus
sudo mv prometheus promtool /usr/local/bin/
sudo mv consoles/ console_libraries/ /etc/prometheus/
sudo mv prometheus.yml /etc/prometheus/prometheus.yml

# Set ownership for directories: move automatically the following content sudo tee -a to the prometheus.service
sudo chown -R prometheus:prometheus /etc/prometheus/ /data/
sudo  tee -a nano /etc/systemd/system/prometheus.service << EOF
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

StartLimitIntervalSec=500
StartLimitBurst=5

[Service]
User=prometheus
Group=prometheus
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/data \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries \
  --web.listen-address=0.0.0.0:9090 \
  --web.enable-lifecycle

[Install]
WantedBy=multi-user.target
EOF

# Enable and start Prometheus:
sudo systemctl enable prometheus
sudo systemctl start prometheus
echo "prometheus installed and started successfully!"

# Installing Node Exporter:
# Create a system user for Node Exporter and download Node Exporter:
sudo useradd --system --no-create-home --shell /bin/false node_exporter
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz

# Extract Node Exporter files, move the binary, and clean up:
tar -xvf node_exporter-1.6.1.linux-amd64.tar.gz
sudo mv node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
rm -rf node_exporter*

# Create a systemd unit configuration file for Node Exporter:
sudo tee -a nano /etc/systemd/system/node_exporter.service << EOF
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

StartLimitIntervalSec=500
StartLimitBurst=5

[Service]
User=node_exporter
Group=node_exporter
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=/usr/local/bin/node_exporter --collector.logind

[Install]
WantedBy=multi-user.target
EOF

# Enable and start Node Exporter:
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
echo "node installed and started successfully!"

# Prometheus Configuration:
# To configure Prometheus to scrape metrics from Node Exporter and Jenkins, you need to modify the prometheus.yml file. Here is an example prometheus.yml configuration for your setup:
sudo tee -a nano /etc/prometheus/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'jenkins'
    metrics_path: '/prometheus'
    static_configs:
      - targets: ['localhost:8080']

  - job_name: 'K8s'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['<your-jenkins-ip>:<your-jenkins-port>']
EOF

# Reload the Prometheus configuration without restarting:
curl -X POST http://localhost:9090/-/reload

# Install Grafana on Ubuntu 22.04 and Set it up to Work with Prometheus
sudo apt-get update -y
sudo apt-get install -y apt-transport-https software-properties-common

# Add the GPG key for Grafana:
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -

# Add the repository for Grafana stable releases:
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

# Update the package list and install Grafana:
sudo apt-get update -y
sudo apt-get -y install grafana

# To automatically start Grafana after a reboot, enable the service:
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
echo "node grafana and started successfully!"

echo "--------------------Jenkins Password--------------------"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

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






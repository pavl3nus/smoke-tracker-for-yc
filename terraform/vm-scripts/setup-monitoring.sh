#!/bin/bash

set -e

echo "Setting up monitoring on VM..."

NODE_EXPORTER_VERSION="1.6.1"
wget https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz
tar xvfz node_exporter-*.linux-amd64.tar.gz
cd node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64


cat > /etc/systemd/system/node_exporter.service << EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=root
ExecStart=$(pwd)/node_exporter
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable node_exporter
systemctl start node_exporter

systemctl status node_exporter --no-pager


apt-get update
apt-get install -y htop iotop nethogs

echo "Monitoring setup complete!"
echo "Node Exporter is running on port 9100"
echo "Metrics available at: http://localhost:9100/metrics"
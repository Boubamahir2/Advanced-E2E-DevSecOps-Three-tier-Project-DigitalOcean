#!/bin/bash
sudo apt install nginx-light -y
# Replace with your desired domain and file path
DOMAIN="server.boubamahir.com"
CONFIG_FILE="/etc/nginx/sites-available/$DOMAIN"

# Create Nginx configuration file
sudo tee "$CONFIG_FILE" > /dev/null <<'EOL'

server {
    listen 80;
    server_name server.boubamahir.com;

    # Access and error logs
    access_log /var/log/nginx/server.boubamahir.com.access.log;
    error_log /var/log/nginx/server.boubamahir.com.error.log;

    # Proxy settings
    proxy_buffers 16 64k;
    proxy_buffer_size 128k;

    # Redirect to frontend container (adjust port if needed)
    location / {
        proxy_pass http://frontend:3000;  # Assuming frontend runs on port 3000
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Add SSL section with valid certificates if needed for HTTPS
}

EOL

# Enable the configuration file
sudo ln -s "$CONFIG_FILE" "/etc/nginx/sites-enabled/"

# Test for syntax errors
sudo nginx -t

# If syntax is OK, reload Nginx
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    sudo certbot --nginx -d $DOMAIN
    sudo systemctl status certbot.timer
    sudo certbot renew --dry-run

    echo "Nginx configuration and Encryption reloaded successfully."
else
    echo "Error: Nginx configuration has syntax errors. Please check and fix."
fi


# sudo nano /etc/nginx/sites-available/server.boubamahir.com

# sudo ln -s /etc/nginx/sites-available/server.boubamahir.com /etc/nginx/sites-enabled/


# sudo nginx -t
# sudo systemctl restart nginx

# sudo certbot --nginx -d server.boubamahir.com
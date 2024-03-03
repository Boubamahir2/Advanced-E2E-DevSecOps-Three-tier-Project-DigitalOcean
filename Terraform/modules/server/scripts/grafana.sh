#!/bin/bash

# Replace with your desired domain and file path
DOMAIN="grafana.boubamahir.com"
CONFIG_FILE="/etc/nginx/sites-available/$DOMAIN"

# Create Nginx configuration file
sudo tee "$CONFIG_FILE" > /dev/null <<'EOL'
upstream grafana{
    server grafana.boubamahir.com:3000;
}

server{
    listen      80;
    server_name grafana.boubamahir.com;

    access_log  /var/log/nginx/grafana.access.log;
    error_log   /var/log/nginx/grafana.error.log;

    proxy_buffers 16 64k;
    proxy_buffer_size 128k;

    location / {
        proxy_pass  http://grafana;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_redirect off;

        proxy_set_header    Host            $host;
        proxy_set_header    X-Real-IP       $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto https;
    }

}


EOL

# Enable the configuration file
sudo ln -s "$CONFIG_FILE" "/etc/nginx/sites-enabled/"
# sudo ln -s "/etc/nginx/sites-available/grafana.boubamahir.com" "/etc/nginx/sites-enabled/"

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

#upstream grafana{
#     server grafana.boubamahir.com:3000;
# }

# server{
#     server_name grafana.boubamahir.com;

#     access_log  /var/log/nginx/grafana.access.log;
#     error_log   /var/log/nginx/grafana.error.log;

#     proxy_buffers 16 64k;
#     proxy_buffer_size 128k;

#     location / {
#         proxy_pass  http://grafana;
#         proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
#         proxy_redirect off;

#         proxy_set_header    Host            $host;
#         proxy_set_header    X-Real-IP       $remote_addr;
#         proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header    X-Forwarded-Proto https;
#     }


#     listen 443 ssl; # managed by Certbot
#     ssl_certificate /etc/letsencrypt/live/grafana.boubamahir.com/fullchain.pem; # managed by Certbot
#     ssl_certificate_key /etc/letsencrypt/live/grafana.boubamahir.com/privkey.pem; # managed by Certbot
#     include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
#     ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

# }




# server{
#     if ($host = grafana.boubamahir.com) {
#         return 301 https://$host$request_uri;
#     } # managed by Certbot


#     listen      80;
#     server_name grafana.boubamahir.com;
#     return 404; # managed by Certbot


# }


# Noels Growbox App

## Setup
### 1. Install docker
```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/raspbian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/raspbian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
### 2. Clone repo
```bash
sudo mkdir -p /var/www && sudo chmod 777 /var/www && cd /var/www && git clone https://github.com/dsalex1/NoelsGrowboxApp.git
```
### 3. Start webserver container
```bash
cd /var/www/NoelsGrowboxApp && docker compose up -d
```
### 4. Setup webserver
run in app container
```bash
composer install && npm install && cp .env.example .env && php artisan key:generate && php artisan migrate --seed
```

### 5. Install and start python as a service 
```bash
sudo echo "[Unit]\nDescription=Noels Growbox Python Service\nAfter=network-online.target\n[Service]\nExecStart=/usr/bin/python3 /var/www/NoelsGrowboxApp/python/main.py\nRestart=always\n[Install]\nWantedBy=multi-user.target" > /etc/systemd/system/noelsgrowboxapp.service
sudo chmod 664 /etc/systemd/system/noelsgrowboxapp.service
sudo systemctl daemon-reload
sudo systemctl start noelsgrowboxapp.service
sudo systemctl enable noelsgrowboxapp.service
```

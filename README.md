# 🚀 Deploy Next.js na VPS HostGator (Guia Completo)

Este guia mostra como fazer deploy profissional de um projeto Next.js
usando:

-   Ubuntu VPS (HostGator)
-   Nginx
-   PM2
-   Certbot (SSL automático Let's Encrypt)
-   Domínio próprio

------------------------------------------------------------------------

# 1️⃣ Atualizar servidor

``` bash
sudo apt update && sudo apt upgrade -y
```

------------------------------------------------------------------------

# 2️⃣ Instalar Node.js

``` bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

------------------------------------------------------------------------

# 3️⃣ Instalar PM2

``` bash
sudo npm install -g pm2
```

------------------------------------------------------------------------

# 4️⃣ Instalar Nginx

``` bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

------------------------------------------------------------------------

# 5️⃣ Upload do projeto

Clone:

``` bash
git clone https://github.com/seuusuario/seuprojeto.git
cd seuprojeto
```

Instale dependências:

``` bash
npm install
```

Build:

``` bash
npm run build
```

------------------------------------------------------------------------

# 6️⃣ Rodar com PM2

``` bash
pm2 start npm --name "app" -- start
pm2 save
pm2 startup
```

------------------------------------------------------------------------

# 7️⃣ Configurar domínio (GoDaddy ou outro)

Configure:

Tipo A

@ → IP da VPS

www → IP da VPS

------------------------------------------------------------------------

# 8️⃣ Configurar Nginx

Criar config:

``` bash
sudo nano /etc/nginx/sites-available/app
```

Cole:

``` nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar:

``` bash
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

------------------------------------------------------------------------

# 9️⃣ Instalar SSL automático

``` bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

Renovação automática já configurada.

------------------------------------------------------------------------

# 🔟 Testar

``` bash
curl -I https://seudominio.com
```

Resposta esperada:

HTTP/1.1 200 OK

------------------------------------------------------------------------

# ✅ Produção final

Stack final:

Next.js Node.js PM2 Nginx SSL automático Deploy profissional

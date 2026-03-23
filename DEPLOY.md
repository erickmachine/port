# Erick Machine — Deploy na Locaweb (VPS)

Este guia explica passo a passo como fazer o deploy deste projeto Next.js 16 + Neon no plano **VPS da Locaweb** usando Ubuntu, Node.js, PM2 e Nginx.

> A hospedagem compartilhada da Locaweb **não suporta Node.js**. Use obrigatoriamente um plano **VPS ou Cloud Server**.

---

## Pre-requisitos

| Item | Versão |
|---|---|
| Node.js | 20 LTS ou superior |
| pnpm | 9+ |
| PM2 | 5+ |
| Nginx | qualquer recente |
| Banco de dados Neon | ja configurado (veja passo 5) |

---

## Parte 1 — Contratar e acessar o VPS

### 1.1 Contratar o plano VPS

1. Acesse [locaweb.com.br](https://www.locaweb.com.br) e contrate um plano **VPS** (recomendado: mínimo 2 vCPU, 2 GB RAM).
2. Escolha o sistema operacional **Ubuntu 22.04 LTS**.
3. Após o pagamento, a Locaweb enviará um e-mail com:
   - O **IP público** do servidor
   - As credenciais de acesso inicial (usuário `root` + senha ou chave SSH)

### 1.2 Primeiro acesso via SSH

```bash
ssh root@SEU_IP_AQUI
```

Se escolheu chave SSH:

```bash
ssh -i ~/.ssh/minha_chave root@SEU_IP_AQUI
```

### 1.3 Criar um usuario seguro (recomendado)

```bash
# Criar usuario deploy
adduser deploy

# Adicionar ao grupo sudo
usermod -aG sudo deploy

# Copiar chave SSH para o novo usuario
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

A partir daqui, todos os comandos devem ser executados com o usuario `deploy`:

```bash
ssh deploy@SEU_IP_AQUI
```

---

## Parte 2 — Configurar o servidor

### 2.1 Atualizar o sistema

```bash
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
```

### 2.2 Instalar dependencias essenciais

```bash
sudo apt install -y curl git build-essential ufw nginx
```

### 2.3 Instalar Node.js 20 via NodeSource

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verificar:

```bash
node -v   # deve mostrar v20.x.x
npm -v
```

### 2.4 Instalar pnpm e PM2 globalmente

```bash
npm install -g pnpm pm2
```

### 2.5 Configurar o Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## Parte 3 — Fazer upload e build do projeto

### 3.1 Clonar o repositorio no servidor

Se o projeto estiver no GitHub:

```bash
cd /home/deploy
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git erickmachine
cd erickmachine
```

**Alternativa — enviar os arquivos via rsync (do seu computador local):**

```bash
# Execute no seu computador local (nao no servidor)
rsync -avz --exclude node_modules --exclude .next \
  ./ deploy@SEU_IP_AQUI:/home/deploy/erickmachine/
```

### 3.2 Instalar dependencias

```bash
cd /home/deploy/erickmachine
pnpm install
```

### 3.3 Criar o arquivo de variaveis de ambiente

```bash
nano .env.production
```

Cole o conteudo abaixo e preencha com os seus valores reais:

```env
# Banco de dados Neon
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/nomedobanco?sslmode=require

# Senha do painel admin
ADMIN_PASSWORD=SUA_SENHA_SEGURA_AQUI

# URL publica do site (sem barra no final)
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br

# Necessario para cookies de sessao em producao
NODE_ENV=production
```

> **Onde obter o DATABASE_URL?**
> Acesse [console.neon.tech](https://console.neon.tech), selecione seu projeto, va em **Connection Details** e copie a string de conexao no formato `postgresql://...`.

### 3.4 Fazer o build de producao

```bash
pnpm build
```

Este comando gera a pasta `.next/` com a versao otimizada do site. Pode demorar 1-2 minutos.

---

## Parte 4 — Rodar com PM2

### 4.1 Criar o arquivo de configuracao do PM2

```bash
nano ecosystem.config.js
```

Cole o conteudo:

```js
module.exports = {
  apps: [
    {
      name: 'erickmachine',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/home/deploy/erickmachine',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
```

### 4.2 Iniciar a aplicacao

```bash
pm2 start ecosystem.config.js --env production
```

### 4.3 Salvar o PM2 para reiniciar automaticamente

```bash
pm2 save
pm2 startup
```

O comando `pm2 startup` vai exibir um comando `sudo ...` — execute-o para que o PM2 inicie automaticamente quando o servidor reiniciar.

### 4.4 Verificar se esta rodando

```bash
pm2 status
pm2 logs erickmachine
```

A aplicacao estara disponivel em `http://SEU_IP_AQUI:3000`.

---

## Parte 5 — Configurar o Nginx como proxy reverso

O Nginx vai receber as requisicoes na porta 80/443 e redirecionar para o Next.js na porta 3000.

### 5.1 Criar o arquivo de configuracao do Nginx

```bash
sudo nano /etc/nginx/sites-available/erickmachine
```

Cole o conteudo (substitua `seudominio.com.br`):

```nginx
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;

    # Seguranca
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Aumentar limite de upload (para imagens, etc.)
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache para arquivos estaticos do Next.js
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }
}
```

### 5.2 Ativar o site e reiniciar o Nginx

```bash
sudo ln -s /etc/nginx/sites-available/erickmachine /etc/nginx/sites-enabled/
sudo nginx -t          # Testa se a configuracao esta correta
sudo systemctl restart nginx
sudo systemctl enable nginx
```

Agora o site ja esta acessivel via `http://seudominio.com.br`.

---

## Parte 6 — Apontar o dominio para o VPS

### Se o dominio esta na Locaweb:

1. Acesse o painel da Locaweb > **Domínios** > **Zona DNS**
2. Edite (ou crie) o registro do tipo **A**:
   - **Nome:** `@` (para o dominio raiz) e `www`
   - **Valor:** IP publico do seu VPS
   - **TTL:** 3600

### Se o dominio esta no Registro.br:

1. Acesse [registro.br](https://registro.br) e faca login
2. Va em seu dominio > **DNS**
3. Adicione dois registros do tipo **A**:
   - `@` → `SEU_IP_AQUI`
   - `www` → `SEU_IP_AQUI`

> A propagacao de DNS pode levar ate 24 horas, mas normalmente ocorre em menos de 1 hora.

---

## Parte 7 — HTTPS gratuito com Let's Encrypt (SSL)

```bash
# Instalar o Certbot
sudo apt install -y certbot python3-certbot-nginx

# Gerar o certificado (substitua o dominio)
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br

# Seguir as instrucoes na tela e escolher redirecionar HTTP para HTTPS
```

O Certbot vai editar automaticamente o arquivo do Nginx e configurar a renovacao automatica do certificado.

Verifique a renovacao automatica:

```bash
sudo certbot renew --dry-run
```

---

## Parte 8 — Executar a migracao do banco de dados

Na primeira vez que for ao ar, voce precisa criar as tabelas no Neon. Acesse o [console.neon.tech](https://console.neon.tech), selecione seu projeto, va em **SQL Editor** e execute o conteudo do arquivo `scripts/migrate.sql`:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);
```

> Se ja executou pelo v0 anteriormente, as tabelas ja existem. O `IF NOT EXISTS` garante que nao ha duplicacoes.

---

## Atualizando o projeto no futuro

Sempre que fizer novas alteracoes no codigo:

```bash
# No servidor
cd /home/deploy/erickmachine

# Se estiver usando Git
git pull origin main

# Reinstalar dependencias (se houver novas)
pnpm install

# Novo build
pnpm build

# Reiniciar a aplicacao com zero downtime
pm2 reload erickmachine
```

---

## Acesso ao painel admin

Apos o deploy, acesse:

```
https://seudominio.com.br/admin/login
```

Use a senha definida em `ADMIN_PASSWORD` no arquivo `.env.production`.

---

## Solucao de problemas comuns

| Problema | Solucao |
|---|---|
| Site nao abre | Verificar `pm2 status` e `pm2 logs erickmachine` |
| Erro 502 Bad Gateway | O Next.js nao esta rodando — execute `pm2 restart erickmachine` |
| Variaveis de ambiente nao carregam | Confirmar que o arquivo `.env.production` existe e re-fazer o build |
| Banco de dados nao conecta | Confirmar o `DATABASE_URL` no `.env.production` e checar as regras de IP no painel do Neon |
| Dominio nao aponta | Aguardar propagacao DNS ou verificar os registros A no painel do provedor |

---

## Resumo dos comandos uteis

```bash
pm2 status                  # Ver status dos processos
pm2 logs erickmachine       # Ver logs em tempo real
pm2 reload erickmachine     # Reiniciar sem downtime
pm2 stop erickmachine       # Parar a aplicacao

sudo nginx -t               # Testar configuracao do Nginx
sudo systemctl restart nginx

sudo ufw status             # Ver regras do firewall
```

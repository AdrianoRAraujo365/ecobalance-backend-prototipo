# ----------------------------------------------------
# Multi-stage Dockerfile para EcoBalance Ledger Frontend
# ----------------------------------------------------
FROM nginx:alpine

# Metadados
LABEL maintainer="EcoBalance Ledger Team - EnGeTec 2026"
LABEL description="Frontend Web do Sistema de Governança ESG e TI Verde"

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos (HTML, assets e scripts da aplicação)
COPY index.html /usr/share/nginx/html/index.html

# Configuração customizada do Nginx com suporte a SPA e Proxy reverso
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Encaminhamento de chamadas da API RESTful para o container backend \
    location /api/ { \
        proxy_pass http://backend:3000/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# Вибір базового образу Node.js
FROM node:20

# Створення робочої директорії
WORKDIR /app

# Створення папки js_server всередині app
RUN mkdir js_server

# Копіювання package.json та package-lock.json у папку js_server
COPY js_server/package*.json ./js_server/

# Встановлення залежностей
RUN cd js_server && npm install

# Копіювання всіх файлів js_server у відповідну папку
COPY js_server /app/js_server

# Копіювання папки views безпосередньо у папку views всередині app
COPY views/ ./views/

COPY public/ ./public/
# Відкриття порту
EXPOSE 3000

# Запуск додатка
CMD ["node", "js_server/app.js"]
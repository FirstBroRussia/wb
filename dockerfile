# Указываем официальный Node образ
FROM node:22-alpine

# Рабочая директория внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем весь проект
COPY . .

# Сборка NestJS приложения
RUN npm run build

# Указываем порт, который будет слушать приложение
EXPOSE 3000

# Команда запуска
CMD ["node", "dist/main.js"]


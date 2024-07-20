# Вибір базового образу Python
FROM python:3.10

# Створення робочої директорії
WORKDIR /app

# Створення папки python_server всередині app
RUN mkdir python_server

# Встановлення залежностей
COPY python_server/requirements.txt ./python_server
RUN cd python_server && pip install -r requirements.txt

# Копіювання всіх файлів python_server у відповідну папку
COPY python_server /app/python_server

# Копіювання папки views безпосередньо у папку views всередині app
COPY views/ ./views/

COPY public/ ./public/

# Відкриття порту
EXPOSE 8000

# Запуск сервера
CMD ["python", "python_server/manage.py", "runserver", "0.0.0.0:8000"]

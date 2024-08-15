release: python python_server/manage.py migrate
web: gunicorn mysite.wsgi --chdir python_server

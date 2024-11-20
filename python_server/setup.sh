#!/bin/bash

pip install setuptools
pip install -r python_server/requirements.txt

python python_server/manage.py makemigrations
python python_server/manage.py migrate
python python_server/manage.py tailwind install
python python_server/manage.py collectstatic --noinput
python python_server/manage.py tailwind start

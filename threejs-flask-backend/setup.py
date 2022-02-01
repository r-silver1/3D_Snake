from setuptools import setup

setup(
    name="threejs-flask-backend",
    version="0.0.1",
    packages=["threejs-flask-backend",
              "db_dao",
              "login_wrapper",
              "session_wrapper"
              ],
    include_package_data=True,
    install_requires=[
        "click==8.0.3",
        "colorama==0.4.4",
        "Flask==2.0.2",
        "Flask-Cors==3.0.10",
        "itsdangerous==2.0.1",
        "Jinja2==3.0.2",
        "MarkupSafe==2.0.1",
        "six==1.16.0",
        "Werkzeug==2.0.2"
    ],
)

# pip install -e .
# $env:FLASK_APP = "threejs-flask-backend"
# $env:FLASK_ENV = "development"
# flask run

# ----
# or?
# python setup.py install
# python setup.py develop

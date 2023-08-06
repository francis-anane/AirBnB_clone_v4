#!/usr/bin/python3
""" Starts a Flash Web Application """


from flask import Flask, render_template
from models import storage
from markupsafe import escape
from datetime import datetime
import uuid
from os import getenv

app = Flask(__name__)
app.url_map.strict_slashes = False


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()

@app.route("/")
@app.route("/2-hbnb")
def hbnb():
    """Displays a dynamic styled page showing all needed objects"""
    return render_template("2-hbnb.html",
                           states=storage.all('State'),
                           amenities=storage.all('Amenity'),
                           places=storage.all('Place'),
                           users=storage.all('User'),
                           cache_id=uuid.uuid4())

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')

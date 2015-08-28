import os
from os import path

from .defaults import *

DEBUG = True

MONGODB = {
    'host': os.getenv('MONGO_HTTP_HOST', 'localhost')
}

REDIS = {
    'host': os.getenv('REDIS_HTTP_HOST', 'localhost')
}

WEB_APP_DIR = path.realpath(ROOT + '/../cloudtunes-webapp/build/production')


TORNADO_APP.update({
    'static_path': os.getenv('TORNADO_STATIC_PATH', WEB_APP_DIR),
    'debug': os.getenv('TORNADO_DEBUG', DEBUG),
    'cookie_secret': os.getenv('TORNADO_COOKIE_SECRET', 'PLEASECHANGETHIS')
})


EMAIL = {
    'SMTP_SERVER': os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
    'SMTP_PORT': os.getenv('SMTP_PORT', 587),
    'SENDER': os.getenv('SENDER', None),
    'PASSWORD': os.getenv('PASSWORD', None)
}

#############################################################
# Facebook <https://developers.facebook.com/apps>
#############################################################

FACEBOOK_APP_ID = os.getenv('FACEBOOK_APP_ID', None)
FACEBOOK_APP_SECRET = os.getenv('FACEBOOK_APP_SECRET', None)

#############################################################
# Last.fm <http://www.last.fm/api/account>
#############################################################

LASTFM_API_KEY = os.getenv('LASTFM_API_KEY', None)
LASTFM_API_SECRET = os.getenv('LASTFM_API_SECRET', None)

#############################################################
# Dropbox <https://www.dropbox.com/developers>
#############################################################

DROPBOX_API_APP_KEY = os.getenv('DROPBOX_API_APP_KEY', None)
DROPBOX_API_APP_SECRET = os.getenv('DROPBOX_API_APP_SECRET', None)

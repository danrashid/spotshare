#!/usr/bin/env python3

import cgi
import os
import urllib.parse
import urllib.request

client_secret = os.getenv("GITHUB_CLIENT_SECRET")

form = cgi.FieldStorage()

body = urllib.parse.urlencode({"client_secret": client_secret} | {
    key: form[key].value for key in form.keys()})

content_type = "application/json"

request = urllib.request.Request(
    "https://github.com/login/oauth/access_token", data=body.encode(), headers={
        "Accept": content_type
    })

with urllib.request.urlopen(request) as response:
    print('Content-type: %s\n\n%s' % (content_type, response.read().decode()))

#!/bin/bash
set -e

export GIT_URL = "$GIT_URL"
git clone "$GIT_URL" /app/
cd /app
exec tsc -b
exec /dist/app.js



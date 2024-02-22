#!/bin/bash
set -e

export S3_URL = "$S3_URL"
git clone "$S3_URL" /home/app/
cd /home/app
exec tsc -b
exec /dist/app.js



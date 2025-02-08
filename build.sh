#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create media directory if it doesn't exist
mkdir -p media

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Set permissions
chmod -R 755 staticfiles/
chmod -R 755 media/ 
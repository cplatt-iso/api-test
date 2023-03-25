import os
import json
import requests
import redis
from time import sleep

REDIS_HOST = os.environ["REDIS_HOST"]
API_KEY = os.environ["WORLD_TIDES_API_KEY"]
LATITUDE = os.environ["LATITUDE"]
LONGITUDE = os.environ["LONGITUDE"]

r = redis.Redis(host=REDIS_HOST, port=6379, db=0)

def fetch_tide_data():
    url = f"https://www.worldtides.info/api/v3?extremes&key={API_KEY}&lat={LATITUDE}&lon={LONGITUDE}"
    response = requests.get(url)
    print("Response content:", response.text)
    data = response.json()
    r.set("tides", json.dumps(data["extremes"]))

while True:
    fetch_tide_data()
    sleep(3600)  # Sleep for 1 hour before fetching data again


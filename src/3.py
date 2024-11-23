import requests
import json

DATA_FILE = "anime_data.json"

def check_image_urls():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    for anime in data:
        url = anime.get("image_url")
        try:
            response = requests.get(url)
            if response.status_code != 200:
                print(f"Broken URL: {url}")
        except Exception as e:
            print(f"Error with URL {url}: {e}")

if __name__ == "__main__":
    check_image_urls()

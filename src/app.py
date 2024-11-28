from flask import Flask, jsonify, request, send_file
import json
import requests
from io import BytesIO
from flask_cors import CORS
from flask_caching import Cache

app = Flask(__name__)
CORS(app)

# Конфігурація кешу
cache = Cache(config={"CACHE_TYPE": "SimpleCache"})
cache.init_app(app)

DATA_FILE = "anime_data.json"

def load_data():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error loading JSON: {e}")
        return []

def save_data(data):
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving JSON: {e}")

@app.route("/api/anime", methods=["GET"])
def get_anime():
    data = load_data()
    return jsonify(data)

@app.route("/api/categories", methods=["POST"])
def update_category():
    data = request.json
    if not data or "title" not in data or "categories" not in data:
        return jsonify({"error": "Invalid data"}), 400

    anime_list = load_data()
    anime_found = False

    for anime in anime_list:
        if anime["title"] == data["title"]:
            anime_found = True
            if "categories" not in anime:
                anime["categories"] = []
            # Оновлюємо категорії (додаємо або видаляємо з них)
            new_categories = set(anime["categories"] + data["categories"])
            anime["categories"] = list(new_categories)
            break

    if not anime_found:
        return jsonify({"error": "Anime not found"}), 404

    save_data(anime_list)
    return jsonify({"message": "Category updated successfully!", "categories": anime["categories"]})

@app.route("/api/delete_category", methods=["POST"])
def delete_category():
    data = request.json
    if not data or "title" not in data or "category" not in data:
        return jsonify({"error": "Invalid data"}), 400

    anime_list = load_data()
    anime_found = False

    for anime in anime_list:
        if anime["title"] == data["title"]:
            anime_found = True
            if "categories" in anime and data["category"] in anime["categories"]:
                anime["categories"].remove(data["category"])  # Видаляємо категорію
            break

    if not anime_found:
        return jsonify({"error": "Anime not found"}), 404

    save_data(anime_list)
    return jsonify({"message": "Category deleted successfully!"})

@app.route("/api/proxy_image", methods=["GET"])
def proxy_image():
    image_url = request.args.get("url")
    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    cached_image = cache.get(image_url)
    if cached_image:
        return send_file(BytesIO(cached_image), mimetype="image/jpeg")

    try:
        response = requests.get(image_url, stream=True)
        response.raise_for_status()
        cache.set(image_url, response.content, timeout=60 * 60)
        return send_file(BytesIO(response.content), mimetype="image/jpeg")
    except requests.RequestException as e:
        print(f"Error fetching image: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)


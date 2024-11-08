from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os

load_dotenv()
SEARCH_ENGINE_ID=os.getenv("SEARCH_ENGINE_ID")
API_KEY=os.getenv("API_KEY")

app = Flask(__name__)

# Replace these with your actual Google API Key and Search Engine ID


def fetch_image_for_location(location):
    url = f"https://www.googleapis.com/customsearch/v1?q={location}&cx={SEARCH_ENGINE_ID}&searchType=image&key={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if "items" in data:
            # Return the first image result
            return data["items"][0]["link"]
        else:
            return None
    else:
        return None

@app.route('/')
def home():
    return "hi"

@app.route("/location-image", methods=["GET"])
def location_image():
    location = request.args.get("location")
    if not location:
        return jsonify({"error": "Please provide a location"}), 400

    # Fetch the image URL for the specified location
    image_url = fetch_image_for_location(location)
    if image_url:
        return jsonify({"location": location, "image_url": image_url})
    else:
        return jsonify({"error": "No image found for the specified location"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5001)
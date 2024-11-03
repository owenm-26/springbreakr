# app.py

from flask import Flask, request, jsonify
import pickle, requests
from dotenv import load_dotenv
import os

load_dotenv()
SEARCH_ENGINE_ID=os.getenv("SEARCH_ENGINE_ID")
API_KEY=os.getenv("API_KEY")

app = Flask(__name__)

# Load the KNN model
with open("knn_travel_model.pkl", "rb") as f:
    knn_model = pickle.load(f)


# LOCATION IMAGE
@app.route("/location-image", methods=["GET"])
def location_image():
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

    location = request.args.get("location")
    if not location:
        return jsonify({"error": "Please provide a location"}), 400

    # Fetch the image URL for the specified location
    image_url = fetch_image_for_location(location)
    if image_url:
        return jsonify({"location": location, "image_url": image_url})
    else:
        return jsonify({"error": "No image found for the specified location"}), 404
    


@app.route('/predict_category', methods=['POST'])
def predict():
    data = request.get_json()
    description = data.get("description", "")
    
    if not description:
        return jsonify({"error": "No description provided"}), 400
    
    # Predict the category based on the description
    prediction = knn_model.predict([description])
    return jsonify({"description": description, "predicted_category": prediction[0]})

@app.route('/get_recommendations/macro', methods=['POST'])
def get_macro_recommendations():
    # Parse the prompt from the incoming JSON data
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # Define the URL of the external API
    url = "https://llama.tanth.workers.dev/"

    # Prepare the data payload to send to the external API
    payload = {
        "prompt": prompt,
        "systemprompt": "You are a helpful travel assistant trying to recommend 5 COUNTRIES for traveling based on the user's request. Give your response as a JSON ONLY with 'country' as the country you recommend and 'description' as a short description of that country. Your response should be just the LIST OF JSON and NOTHING ELSE."
    }

    try:
        # Send a POST request to the external API
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})

        # Check if the response is successful
        if response.status_code == 200:
            try:
                # Parse the JSON response
                response_data = response.json()
                # Extract the specific response part if available
                recommendation = response_data[0].get("response", {}).get("response", "")
                return jsonify({"recommendation": recommendation})
            except (ValueError, KeyError, IndexError):
                return jsonify({"error": "Unexpected response format from the server"}), 500
        else:
            return jsonify({"error": f"Request failed with status code: {response.status_code}"}), response.status_code

    except requests.RequestException as e:
        return jsonify({"error": f"An error occurred while contacting the external API: {str(e)}"}), 500
    
@app.route('/get_recommendations/micro/<country>', methods=['POST'])
def get_micro_recommendations(country):
    # Parse the prompt from the incoming JSON data
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # Define the URL of the external API
    url = "https://llama.tanth.workers.dev/"

    # Prepare the data payload to send to the external API
    payload = {
        "prompt": prompt,
        "systemprompt": f"You are a helpful travel assistant trying to recommend 10 LOCATIONS within {country} for travelling based on the user's request. Give your response as a JSON ONLY with 'location' as the location you recommend and 'description' as a short description of that location. Your response should be just the LIST OF JSON and NOTHING ELSE."
    }

    try:
        # Send a POST request to the external API
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})

        # Check if the response is successful
        if response.status_code == 200:
            try:
                # Parse the JSON response
                response_data = response.json()
                # Extract the specific response part if available
                recommendation = response_data[0].get("response", {}).get("response", "")
                return jsonify({"recommendation": recommendation})
            except (ValueError, KeyError, IndexError):
                return jsonify({"error": "Unexpected response format from the server"}), 500
        else:
            return jsonify({"error": f"Request failed with status code: {response.status_code}"}), response.status_code

    except requests.RequestException as e:
        return jsonify({"error": f"An error occurred while contacting the external API: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
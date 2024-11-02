# app.py

from flask import Flask, request, jsonify
import pickle, requests

app = Flask(__name__)

# Load the KNN model
with open("knn_travel_model.pkl", "rb") as f:
    knn_model = pickle.load(f)

@app.route('/predict_category', methods=['POST'])
def predict():
    data = request.get_json()
    description = data.get("description", "")
    
    if not description:
        return jsonify({"error": "No description provided"}), 400
    
    # Predict the category based on the description
    prediction = knn_model.predict([description])
    return jsonify({"description": description, "predicted_category": prediction[0]})

@app.route('/get_recommendations', methods=['POST'])
def get_recommendations():
    # Parse the prompt from the incoming JSON data
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # Define the URL of the external API
    url = "https://llama.tanth.workers.dev/"

    # Prepare the data payload to send to the external API
    payload = {
        "prompt": prompt
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
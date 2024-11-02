import requests

# Define the URL for the Flask app's get_recommendations endpoint
url = "http://127.0.0.1:5000/get_recommendations/micro/United Kingdom"

# Define the payload with the travel prompt
data = {
    "prompt": "Are there any serene retreats where I can take a break from emails and notifications? I want a peaceful environment without too many people around."
}

# Set the headers for the request
headers = {
    "Content-Type": "application/json"
}

# Send a POST request to the Flask app
response = requests.post(url, json=data, headers=headers)

# Print the response from the Flask app
if response.status_code == 200:
    print("Recommendation:", response.json().get("recommendation"))
else:
    print("Error:", response.status_code, response.text)
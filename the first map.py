from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Your Mapbox API key
MAPBOX_API_KEY = "YOUR_MAPBOX_API_KEY"

# OpenStreetMap Nominatim URL for geocoding
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

def get_coordinates(location):
    """Fetch latitude and longitude from OpenStreetMap Nominatim API."""
    params = {
        'q': location,
        'format': 'json',
        'limit': 1
    }
    response = requests.get(NOMINATIM_URL, params=params)
    
    if response.status_code == 200 and response.json():
        data = response.json()[0]
        return float(data['lat']), float(data['lon'])
    else:
        return None, None

def get_map_image_url(lat, lon, zoom=12, width=500, height=300):
    """Generate a static map image URL using Mapbox."""
    return f"https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{lon},{lat},{zoom}/{width}x{height}?access_token={MAPBOX_API_KEY}"

@app.route('/location-info', methods=['GET'])
def location_info():
    location = request.args.get('location')
    if not location:
        return jsonify({"error": "Please provide a location parameter"}), 400

    # Get coordinates from OpenStreetMap Nominatim API
    lat, lon = get_coordinates(location)
    if lat is None or lon is None:
        return jsonify({"error": "Location not found"}), 404

    # Generate the map image URL using Mapbox
    map_image_url = get_map_image_url(lat, lon)

    # Return the coordinates and map image URL as JSON
    return jsonify({
        "location": location,
        "coordinates": {
            "latitude": lat,
            "longitude": lon
        },
        "map_image_url": map_image_url
    })

if __name__ == "__main__":
    app.run(debug=True)

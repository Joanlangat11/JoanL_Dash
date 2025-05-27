from flask import Flask, request, jsonify, render_template, send_from_directory
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='./dist', static_url_path='/')
CORS(app)

# Load CSV data
def load_csv_data():
    try:
        farmers = pd.read_csv('data/farmers.csv').to_dict('records')
        crops = pd.read_csv('data/crops.csv').to_dict('records')
        livestock = pd.read_csv('data/livestock.csv').to_dict('records')
        aquaculture = pd.read_csv('data/aquaculture.csv').to_dict('records')
        return farmers, crops, livestock, aquaculture
    except Exception as e:
        print(f"Error loading CSV data: {e}")
        return [], [], [], []

# Load data once at startup
farmers_data, crops_data, livestock_data, aquaculture_data = load_csv_data()

# API routes
@app.route('/api/farmers', methods=['GET'])
def get_farmers():
    return jsonify(farmers_data)

@app.route('/api/crops', methods=['GET'])
def get_crops():
    return jsonify(crops_data)

@app.route('/api/livestock', methods=['GET'])
def get_livestock():
    return jsonify(livestock_data)

@app.route('/api/aquaculture', methods=['GET'])
def get_aquaculture():
    return jsonify(aquaculture_data)

# Route for filtering data
@app.route('/api/farmers/filter', methods=['POST'])
def filter_farmers():
    filter_params = request.json
    filtered = farmers_data
    
    if filter_params.get('county') and filter_params['county'] != 'All':
        filtered = [f for f in filtered if f['county'] == filter_params['county']]
    if filter_params.get('subcounty') and filter_params['subcounty'] != 'All':
        filtered = [f for f in filtered if f['subcounty'] == filter_params['subcounty']]
    if filter_params.get('ward') and filter_params['ward'] != 'All':
        filtered = [f for f in filtered if f['ward'] == filter_params['ward']]
        
    return jsonify(filtered)

# Route for summary statistics
@app.route('/api/summary', methods=['GET'])
def get_summary():
    total_farmers = len(farmers_data)
    crop_farmers = sum(1 for f in farmers_data if f['crop_production'] == 1)
    livestock_farmers = sum(1 for f in farmers_data if f['livestock_production'] == 1)
    
    return jsonify({
        'total_farmers': total_farmers,
        'crop_farmers': crop_farmers,
        'livestock_farmers': livestock_farmers,
        'farming_households': sum(1 for f in farmers_data if f['crop_production'] == 1 or f['livestock_production'] == 1)
    })

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
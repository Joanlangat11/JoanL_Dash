from flask import Flask, request, jsonify, render_template, send_from_directory
import json
import random
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='./dist', static_url_path='/')
CORS(app)

# Mock data generators
counties = ['Nairobi', 'Kiambu', 'Nakuru', 'Mombasa', 'Kisumu']
subcounties = {
    'Nairobi': ['Westlands', 'Embakasi', 'Dagoretti'],
    'Kiambu': ['Kikuyu', 'Thika', 'Limuru'],
    'Nakuru': ['Naivasha', 'Gilgil', 'Molo'],
    'Mombasa': ['Nyali', 'Kisauni', 'Likoni'],
    'Kisumu': ['Kisumu Central', 'Kisumu West', 'Nyando'],
}
wards = {
    'Westlands': ['Parklands', 'Mountain View', 'Kangemi'],
    'Embakasi': ['Pipeline', 'Utawala', 'Mihango'],
    'Kikuyu': ['Karai', 'Nachu', 'Sigona'],
    # More wards could be added here
}

def generate_mock_farmers(count=100):
    farmers = []
    for i in range(1, count + 1):
        county = random.choice(counties)
        subcounty_options = subcounties.get(county, ['Central'])
        subcounty = random.choice(subcounty_options)
        ward_options = wards.get(subcounty, ['Ward 1'])
        ward = random.choice(ward_options) if ward_options else 'Ward 1'
        
        farmers.append({
            'id': i,
            'name': f'Farmer {i}',
            'gender': random.choice(['Male', 'Female']),
            'year_of_birth': 1960 + random.randint(0, 40),
            'county': county,
            'subcounty': subcounty,
            'ward': ward,
            'crop_production': 1 if random.random() > 0.3 else 0,
            'livestock_production': 1 if random.random() > 0.4 else 0,
            'highest_level_of_formal_education': random.choice(['Primary', 'Secondary', 'Tertiary', 'None']),
            'formal_training_in_agriculture': random.randint(0, 2)
        })
    return farmers

def generate_mock_crops(farmer_count=100, crop_count=150):
    crops = []
    crop_types = ['Maize', 'Beans', 'Wheat', 'Rice', 'Potatoes', 'Cassava', 'Sorghum']
    water_sources = ['Rain-fed', 'Irrigated', 'Both', 'None']
    production_systems = ['Small-scale', 'Large-scale', 'Commercial', 'Subsistence']
    purposes = ['Commercial', 'Subsistence', 'Both']
    
    for i in range(1, crop_count + 1):
        farmer_id = random.randint(1, farmer_count)
        county = random.choice(counties)
        subcounty_options = subcounties.get(county, ['Central'])
        subcounty = random.choice(subcounty_options)
        ward_options = wards.get(subcounty, ['Ward 1'])
        ward = random.choice(ward_options) if ward_options else 'Ward 1'
        
        crops.append({
            'id': i,
            'farmer_id': farmer_id,
            'crop_name': random.choice(crop_types),
            'acreage': round(random.random() * 10, 2),
            'county': county,
            'subcounty': subcounty,
            'ward': ward,
            'water_source': random.choice(water_sources),
            'production_system': random.choice(production_systems),
            'purpose': random.choice(purposes),
            'use_of_certified_seeds': 1 if random.random() > 0.5 else 0
        })
    return crops

def generate_mock_livestock(farmer_count=100, livestock_count=120):
    livestock = []
    livestock_types = ['Cattle', 'Goats', 'Sheep', 'Chicken', 'Pigs', 'Rabbits']
    subcategories = {
        'Cattle': ['Dairy', 'Beef', 'Mixed'],
        'Goats': ['Dairy', 'Meat'],
        'Sheep': ['Wool', 'Meat'],
        'Chicken': ['Layers', 'Broilers', 'Indigenous'],
        'Pigs': ['Breeding', 'Fattening'],
        'Rabbits': ['Fur', 'Meat'],
    }
    production_systems = ['Zero-grazing', 'Free-range', 'Semi-intensive', 'Intensive']
    age_groups = ['Young', 'Adult', 'Old']
    
    for i in range(1, livestock_count + 1):
        farmer_id = random.randint(1, farmer_count)
        livestock_type = random.choice(livestock_types)
        subcategory_options = subcategories.get(livestock_type, ['General'])
        subcategory = random.choice(subcategory_options)
        
        county = random.choice(counties)
        subcounty_options = subcounties.get(county, ['Central'])
        subcounty = random.choice(subcounty_options)
        ward_options = wards.get(subcounty, ['Ward 1'])
        ward = random.choice(ward_options) if ward_options else 'Ward 1'
        
        male_count = random.randint(0, 10)
        female_count = random.randint(0, 15)
        
        livestock.append({
            'id': i,
            'farmer_id': farmer_id,
            'livestock_name': livestock_type,
            'livestock_sub_category': subcategory,
            'county': county,
            'subcounty': subcounty,
            'ward': ward,
            'male_livestock_count': male_count,
            'female_livestock_count': female_count,
            'production_system': random.choice(production_systems),
            'age_group': random.choice(age_groups),
            'total_livestock_count': male_count + female_count
        })
    return livestock

def generate_mock_aquaculture(farmer_count=100, aqua_count=80):
    aquaculture = []
    species = ['Tilapia', 'Catfish', 'Carp', 'Trout', 'Salmon']
    categories = ['Freshwater', 'Marine', 'Brackish']
    production_systems = ['Pond', 'Cage', 'Tank', 'Recirculating Aquaculture System (RAS)']
    
    for i in range(1, aqua_count + 1):
        farmer_id = random.randint(1, farmer_count)
        county = random.choice(counties)
        subcounty_options = subcounties.get(county, ['Central'])
        subcounty = random.choice(subcounty_options)
        ward_options = wards.get(subcounty, ['Ward 1'])
        ward = random.choice(ward_options) if ward_options else 'Ward 1'
        
        aquaculture.append({
            'id': i,
            'farmer_id': farmer_id,
            'aquaculture_species': random.choice(species),
            'aquaculture_species_category': random.choice(categories),
            'county': county,
            'subcounty': subcounty,
            'ward': ward,
            'type_of_production_system': random.choice(production_systems),
            'estimated_no_of_fingerlings': random.randint(100, 1100)
        })
    return aquaculture

# Generate mock data
mock_farmers = generate_mock_farmers()
mock_crops = generate_mock_crops()
mock_livestock = generate_mock_livestock()
mock_aquaculture = generate_mock_aquaculture()

# API routes
@app.route('/api/farmers', methods=['GET'])
def get_farmers():
    return jsonify(mock_farmers)

@app.route('/api/crops', methods=['GET'])
def get_crops():
    return jsonify(mock_crops)

@app.route('/api/livestock', methods=['GET'])
def get_livestock():
    return jsonify(mock_livestock)

@app.route('/api/aquaculture', methods=['GET'])
def get_aquaculture():
    return jsonify(mock_aquaculture)

# Route for filtering data
@app.route('/api/farmers/filter', methods=['POST'])
def filter_farmers():
    filter_params = request.json
    filtered = mock_farmers
    
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
    total_farmers = len(mock_farmers)
    crop_farmers = sum(1 for f in mock_farmers if f['crop_production'] == 1)
    livestock_farmers = sum(1 for f in mock_farmers if f['livestock_production'] == 1)
    
    return jsonify({
        'total_farmers': total_farmers,
        'crop_farmers': crop_farmers,
        'livestock_farmers': livestock_farmers,
        'farming_households': sum(1 for f in mock_farmers if f['crop_production'] == 1 or f['livestock_production'] == 1)
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
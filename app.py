from flask import Flask, render_template, jsonify, request
import json
import random
import datetime
from datetime import timedelta
import math
import os
app = Flask(__name__)

# Mock data generators
def generate_vessel_data():
    vessels = []
    vessel_types = ['Cargo', 'Tanker', 'Fishing', 'Passenger', 'Tug']
    
    for i in range(15):
        vessel = {
            'id': f'V{1000 + i}',
            'name': f'Vessel {chr(65 + i)}',
            'type': random.choice(vessel_types),
            'lat': 19.0760 + random.uniform(-0.5, 0.5),
            'lng': 72.8777 + random.uniform(-0.5, 0.5),
            'speed': random.uniform(5, 25),
            'heading': random.uniform(0, 360),
            'status': random.choice(['Active', 'Anchored', 'Maintenance']),
            'last_update': datetime.datetime.now().strftime('%H:%M:%S')
        }
        vessels.append(vessel)
    
    return vessels

def generate_environmental_data():
    return {
        'water_quality': {
            'ph': round(random.uniform(7.5, 8.5), 2),
            'dissolved_oxygen': round(random.uniform(6, 9), 2),
            'turbidity': round(random.uniform(1, 5), 2),
            'temperature': round(random.uniform(24, 30), 1)
        },
        'weather': {
            'wind_speed': round(random.uniform(5, 20), 1),
            'wind_direction': random.randint(0, 360),
            'wave_height': round(random.uniform(0.5, 3.0), 1),
            'visibility': round(random.uniform(5, 15), 1)
        },
        'pollution_index': random.randint(20, 80),
        'biodiversity_score': random.randint(60, 95)
    }

def generate_alerts():
    alert_types = ['Collision Risk', 'Weather Warning', 'Pollution Alert', 'Restricted Area']
    alerts = []
    
    for i in range(random.randint(2, 5)):
        alert = {
            'id': f'A{1000 + i}',
            'type': random.choice(alert_types),
            'severity': random.choice(['Low', 'Medium', 'High']),
            'message': f'Alert message for {random.choice(alert_types)}',
            'timestamp': (datetime.datetime.now() - timedelta(minutes=random.randint(1, 60))).strftime('%H:%M'),
            'vessel_id': f'V{1000 + random.randint(0, 14)}'
        }
        alerts.append(alert)
    
    return alerts

# Routes
@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/vessels')
def vessels():
    return render_template('vessels.html')

@app.route('/environment')
def environment():
    return render_template('environment.html')

@app.route('/reports')
def reports():
    return render_template('reports.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

# API Routes
@app.route('/api/vessels')
def api_vessels():
    return jsonify(generate_vessel_data())

@app.route('/api/environment')
def api_environment():
    return jsonify(generate_environmental_data())

@app.route('/api/alerts')
def api_alerts():
    return jsonify(generate_alerts())

@app.route('/api/analytics')
def api_analytics():
    # Generate mock analytics data
    hours = [(datetime.datetime.now() - timedelta(hours=i)).strftime('%H:00') for i in range(24, 0, -1)]
    
    return jsonify({
        'vessel_traffic': [random.randint(10, 50) for _ in range(24)],
        'pollution_levels': [random.randint(20, 80) for _ in range(24)],
        'hours': hours,
        'total_vessels': random.randint(45, 65),
        'active_alerts': random.randint(3, 8),
        'avg_pollution': random.randint(35, 55)
    })

@app.route('/api/chat', methods=['POST'])
def api_chat():
    user_message = request.json.get('message', '').lower()
    
    # Simple chatbot responses
    responses = {
        'hello': 'Hello! I\'m your maritime assistant. How can I help you today?',
        'vessels': 'I can show you current vessel positions and status. Check the vessels page for real-time tracking.',
        'weather': 'Current weather conditions show moderate winds and good visibility. Check the environment section for details.',
        'pollution': 'Pollution levels are being monitored continuously. Current index shows acceptable levels.',
        'alerts': 'There are several active alerts. Would you like me to show you the most critical ones?',
        'help': 'I can help you with vessel tracking, environmental monitoring, weather updates, and maritime alerts. What would you like to know?'
    }
    
    # Find best matching response
    response = "I'm here to help with maritime operations. You can ask about vessels, weather, pollution, or alerts."
    for key, value in responses.items():
        if key in user_message:
            response = value
            break
    
    return jsonify({'response': response})
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # default to 5000 for local dev
    app.run(host="0.0.0.0", port=port, debug=True)

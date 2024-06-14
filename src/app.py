from quart import Quart, request, jsonify
from quart_cors import cors
from twilio.rest import Client
from realtime_data import main
import asyncio
import secrets
import logging
from datetime import datetime, timedelta
import os

app = Quart(__name__)
app = cors(app, allow_origin="*")
app.secret_key = secrets.token_hex(16)

# Load environment variables
TWILIO_ACCOUNT_SID = "AC42ed38b869ba2e9bdd38a80a5909d282"
TWILIO_AUTH_TOKEN = "1f171d4933f3fd52612b2042686999ff"
TWILIO_SERVICE_SID = "VA71ab60a3c265411d5ab49db335d657f1"

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

logging.basicConfig(level=logging.INFO)

# Use a dictionary to store valid session tokens with their expiration times
valid_tokens = {}

# Token expiration duration (e.g., 30 minutes)
TOKEN_EXPIRATION_MINUTES = 30

def is_token_valid(token):
    """Check if the token is valid and not expired."""
    if token in valid_tokens:
        if valid_tokens[token] > datetime.utcnow():
            return True
        else:
            del valid_tokens[token]  # Remove expired token
    return False

@app.route('/api/send-otp', methods=['POST'])
async def send_otp():
    data = await request.get_json()
    phone_number = data.get('phoneNumber')
    if phone_number:
        try:
            verification = client.verify.v2.services(TWILIO_SERVICE_SID).verifications.create(to=phone_number, channel='sms')
            return jsonify({'status': verification.status}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Phone number is required'}), 400

@app.route('/api/verify-otp', methods=['POST'])
async def verify_otp():
    data = await request.get_json()
    phone_number = data.get('phoneNumber')
    otp_code = data.get('otp')
    if phone_number and otp_code:
        try:
            verification_check = client.verify.v2.services(TWILIO_SERVICE_SID).verification_checks.create(to=phone_number, code=otp_code)
            if verification_check.status == 'approved':
                session_token = secrets.token_hex(16)
                expiration_time = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRATION_MINUTES)
                valid_tokens[session_token] = expiration_time
                return jsonify({'status': 'approved', 'session_token': session_token}), 200
            return jsonify({'status': 'denied'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Phone number and OTP are required'}), 400

@app.route('/api/dashboard', methods=['GET'])
async def dashboard_data():
    session_token = request.headers.get('Authorization')
    logging.info(f"Received session token: {session_token}")
    logging.info(f"Valid tokens: {valid_tokens}")
    if is_token_valid(session_token):
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, main)
        return jsonify(result)
    return jsonify({'error': 'You are not authorized'}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5001)

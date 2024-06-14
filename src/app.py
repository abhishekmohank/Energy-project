from quart import Quart, request, jsonify
from quart_cors import cors
from twilio.rest import Client
from realtime_data import main
import asyncio
import secrets
import logging
from datetime import datetime, timedelta

app = Quart(__name__)
app = cors(app, allow_origin="http://localhost:3000")
app.secret_key = secrets.token_hex(16)

TWILIO_ACCOUNT_SID = "AC42ed38b869ba2e9bdd38a80a5909d282"
TWILIO_AUTH_TOKEN = "a35f6d40ad1b4114089bd03c5df2cee8"
TWILIO_SERVICE_SID = "VA71ab60a3c265411d5ab49db335d657f1"

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

logging.basicConfig(level=logging.INFO)

valid_tokens = {}

TOKEN_EXPIRATION_MINUTES = 1

def check_token(token):
    """Check if the token is valid and not expired, and return appropriate message."""
    if token in valid_tokens:
        if valid_tokens[token] > datetime.utcnow():
            return "valid"
        else:
            del valid_tokens[token]  # Remove expired token
            return "expired"
    return "invalid"

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
    token_status = check_token(session_token)
    if token_status == "valid":
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, main)
        return jsonify(result)
    elif token_status == "expired":
        return jsonify({'error': 'Your session has timed out. Please log in again.'}), 401
    else:
        return jsonify({'error': 'You are not authorized'}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5001)

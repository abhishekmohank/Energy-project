import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const countryCodes = [
  { code: '+1', name: 'USA' },
  { code: '+91', name: 'India' },
  // Add more country codes as needed
];

const Login = () => {
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(180); // 3 minutes
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  }, []);

  const handleOtpChange = useCallback((e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  }, []);

  const handleGenerateOtp = async () => {
    if (phoneNumber.length === 10) {
      try {
        const response = await axios.post('http://localhost:5001/api/send-otp', {
          phoneNumber: `${countryCode}${phoneNumber}`
        });
        if (response.data.status === 'pending') {
          setStep(2);
          setTimer(180);
          setError('');
        } else {
          alert('Failed to send OTP');
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    } else {
      alert("Phone number must be exactly 10 digits");
    }
  };

  const handleConfirmOtp = async () => {
    if (otp.length === 6) {
      try {
        const response = await axios.post('http://localhost:5001/api/verify-otp', {
          phoneNumber: `${countryCode}${phoneNumber}`,
          otp
        });
        if (response.data.status === 'approved') {
          const { session_token } = response.data;
          localStorage.setItem('session_token', session_token);
          navigate('/dashboard');
        } else {
          setError('Invalid OTP. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setError('An error occurred while verifying OTP. Please try again.');
      }
    } else {
      setError("OTP must be exactly 6 digits");
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      handleGenerateOtp();
    }
  };

  const togglePrivacyPolicy = () => {
    setShowPrivacyPolicy(!showPrivacyPolicy);
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop id="bg-video">
        <source src="wind_turbine_on_a_field_at_sunrise-720p.mp4" type="video/mp4" />
      </video>
      <div className="login-form">
        {step === 1 ? (
          <div className="login-step">
            <h2>Sign in</h2>
            <p>Enter phone number to send one time Password</p>
            <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength="10"
            />
            <button onClick={handleGenerateOtp}>Generate OTP</button>
          </div>
        ) : (
          <div className="login-step">
            <h2>Sign in</h2>
            <p>Enter the verification code sent to your phone number</p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={handleOtpChange}
              maxLength="6"
            />
            <button onClick={handleConfirmOtp}>Confirm</button>
            {error && <p className="error-message">{error}</p>}
            <p className={`resend-text ${timer === 0 ? 'active' : ''}`} onClick={handleResendOtp}>
              {timer > 0 ? `Resend in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : 'Resend OTP'}
            </p>
          </div>
        )}
        <button className="privacy-policy-button" onClick={togglePrivacyPolicy}>
          Privacy Policy
        </button>
      </div>
      {showPrivacyPolicy && (
        <div className="privacy-policy-modal">
          <div className="privacy-policy-content">
            <h2>Privacy Policy</h2>
            <p>We are committed to protecting your privacy. This policy outlines our practices regarding the collection, use, and sharing of your personal information. By using our service, you consent to the terms of this policy. We may update this policy from time to time, and any changes will be posted on this page. If you have any questions about our privacy practices, please contact us at [email address or contact information]</p>
            <button onClick={togglePrivacyPolicy}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

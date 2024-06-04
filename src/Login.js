import React, { useState, useEffect } from 'react';
import './Login.css';

const Login = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(180); // 3 minutes
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleGenerateOtp = () => {
    if (phoneNumber.length === 10) {
      // Handle OTP generation logic here
      setStep(2);
      setTimer(180); // reset timer to 3 minutes
    } else {
      alert("Phone number must be exactly 10 digits");
    }
  };

  const handleConfirmOtp = () => {
    if (otp.length === 4) {
      // Handle OTP confirmation logic here
    } else {
      alert("OTP must be exactly 4 digits");
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      // Handle OTP resend logic here
      setTimer(180); // reset timer to 3 minutes
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
            <p>We have sent the verification code to your Phone number</p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={handleOtpChange}
              maxLength="4"
            />
            <button onClick={handleConfirmOtp}>Confirm</button>
            <p>
              Resend in {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`}
            </p>
            {timer === 0 && (
              <button onClick={handleResendOtp} className="resend-button">
                Resend OTP
              </button>
            )}
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
            <p>Your privacy policy content goes here.</p>
            <button onClick={togglePrivacyPolicy}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

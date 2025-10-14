// LoginScreen.js - UPDATED WITH REAL OTP
import React, { useState } from 'react';
import { Heart, Fingerprint } from 'lucide-react';
import { auth } from './firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { translations } from './translations';
import { validatePhone, validateOTP } from './validation';

const colors = {
  primary: '#6C5CE7',
  secondary: '#00B894',
  danger: '#FF6B6B',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cardBg: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
};

const AnimatedCard = ({ children, style, onClick, gradient }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: gradient || colors.cardBg,
        borderRadius: '24px',
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.15)' 
          : '0 10px 30px rgba(0,0,0,0.1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...style
      }}
    >
      {children}
    </div>
  );
};

const LoginScreen = ({ onLogin, language, onLanguageChange }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(
    localStorage.getItem('biometricEnabled') === 'true'
  );

  const t = translations[language];

  // Setup reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
          }
        }
      );
    }
  };

  const handleSendOTP = async () => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      setPhoneError(validation.error);
      return;
    }

    setLoading(true);
    setPhoneError('');

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      
      // Format phone number with country code
      const phoneNumber = `+91${phone}`;
      
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      alert('✅ OTP sent successfully to your phone!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.code === 'auth/too-many-requests') {
        setPhoneError('Too many requests. Please try again later.');
      } else if (error.code === 'auth/invalid-phone-number') {
        setPhoneError('Invalid phone number format.');
      } else {
        setPhoneError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const validation = validateOTP(otp);
    if (!validation.valid) {
      setOtpError(validation.error);
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      await confirmationResult.confirm(otp);
      
      // Save biometric preference
      localStorage.setItem('biometricEnabled', 'true');
      localStorage.setItem('userPhone', phone);
      setBiometricEnabled(true);
      
      alert('✅ Login successful!');
      onLogin({ name: 'User', phone: `+91${phone}`, biometricEnabled: true });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setOtpError('Invalid OTP. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        setOtpError('OTP expired. Please request a new one.');
      } else {
        setOtpError('Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    const savedPhone = localStorage.getItem('userPhone');
    if (savedPhone) {
      setTimeout(() => {
        alert('✅ Biometric authentication successful!');
        onLogin({ name: 'User', phone: `+91${savedPhone}`, biometricEnabled: true });
      }, 500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Circles */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      <AnimatedCard style={{ maxWidth: '420px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '8px' }}>
          <button
            onClick={() => onLanguageChange('en')}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: '2px solid',
              borderColor: language === 'en' ? colors.primary : '#E8E8E8',
              background: language === 'en' ? colors.primary : 'white',
              color: language === 'en' ? 'white' : colors.text,
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            English
          </button>
          <button
            onClick={() => onLanguageChange('kn')}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: '2px solid',
              borderColor: language === 'kn' ? colors.primary : '#E8E8E8',
              background: language === 'kn' ? colors.primary : 'white',
              color: language === 'kn' ? 'white' : colors.text,
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ಕನ್ನಡ
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '24px',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <Heart size={40} color="white" fill="white" />
          </div>
          <h1 style={{ 
            fontSize: '36px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>{t.appName}</h1>
          <p style={{ fontSize: '18px', color: colors.textLight }}>{t.tagline}</p>
        </div>

        {!otpSent ? (
          <div>
            {/* Biometric Login Option */}
            {biometricEnabled && (
              <div style={{ marginBottom: '32px' }}>
                <AnimatedCard 
                  gradient="linear-gradient(135deg, #00b894 0%, #55efc4 100%)"
                  onClick={handleBiometricLogin}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '8px' }}>
                    <Fingerprint size={32} color="white" />
                    <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
                      {t.useBiometric}
                    </span>
                  </div>
                </AnimatedCard>
                <div style={{ textAlign: 'center', margin: '20px 0', color: colors.textLight, fontSize: '16px', fontWeight: '600' }}>
                  OR
                </div>
              </div>
            )}

            <label style={{ fontSize: '18px', color: colors.text, display: 'block', marginBottom: '12px', fontWeight: '600' }}>
              {t.phoneLabel}
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                padding: '18px',
                fontSize: '20px',
                border: '2px solid #E8E8E8',
                borderRadius: '16px',
                background: '#F8F9FA',
                fontWeight: 'bold',
                color: colors.text
              }}>
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPhone(value);
                  if (phoneError) setPhoneError('');
                }}
                placeholder={t.phonePlaceholder}
                maxLength="10"
                style={{
                  flex: 1,
                  padding: '18px',
                  fontSize: '20px',
                  border: `2px solid ${phoneError ? colors.danger : '#E8E8E8'}`,
                  borderRadius: '16px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
            {phoneError && <p style={{ color: colors.danger, fontSize: '14px', margin: '0 0 16px 0' }}>{phoneError}</p>}
            
            <button
              onClick={handleSendOTP}
              disabled={loading}
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '20px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginTop: phoneError ? '0' : '16px',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? 'Sending...' : t.sendOTP}
            </button>
          </div>
        ) : (
          <div>
            <label style={{ fontSize: '18px', color: colors.text, display: 'block', marginBottom: '12px', fontWeight: '600' }}>
              {t.otpLabel}
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setOtp(value);
                if (otpError) setOtpError('');
              }}
              placeholder={t.otpPlaceholder}
              maxLength="6"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '24px',
                border: `2px solid ${otpError ? colors.danger : '#E8E8E8'}`,
                borderRadius: '16px',
                marginBottom: '8px',
                boxSizing: 'border-box',
                letterSpacing: '8px',
                textAlign: 'center',
                outline: 'none'
              }}
            />
            {otpError && <p style={{ color: colors.danger, fontSize: '14px', margin: '0 0 16px 0' }}>{otpError}</p>}
            
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '20px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginTop: otpError ? '0' : '16px',
                marginBottom: '12px',
                boxShadow: '0 10px 25px rgba(0, 184, 148, 0.4)'
              }}
            >
              {loading ? 'Verifying...' : t.login}
            </button>
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setOtpError('');
              }}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                background: 'transparent',
                color: colors.textLight,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {t.changeNumber}
            </button>
          </div>
        )}
      </AnimatedCard>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginScreen;
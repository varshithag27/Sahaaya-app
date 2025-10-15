import React, { useState, useEffect } from 'react';
import { Heart, AlertCircle, CheckCircle, X } from 'lucide-react';
import authService from '../services/authService';
import translations from './translations';
const colors = {
  primary: '#6C5CE7',
  secondary: '#00B894',
  danger: '#FF6B6B',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cardBg: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? colors.secondary : type === 'error' ? colors.danger : '#FFA502';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: bgColor,
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '500px'
    }}>
      <Icon size={24} />
      <span style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>{message}</span>
      <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const LoginScreen = ({ onLogin, language = 'en' }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const t = translations[language];

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Phone validation
  const validatePhone = (phoneNumber) => {
    if (!phoneNumber) return 'Phone number is required';
    if (phoneNumber.length !== 10) return 'Phone number must be 10 digits';
    if (!/^\d+$/.test(phoneNumber)) return 'Phone number must contain only digits';
    if (!['6', '7', '8', '9'].includes(phoneNumber[0])) return 'Phone number must start with 6, 7, 8, or 9';
    return null;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
      if (errors.phone) setErrors({ ...errors, phone: null });
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    if (errors.otp) setErrors({ ...errors, otp: null });
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSendOTP = async () => {
    const phoneError = validatePhone(phone);
    if (phoneError) {
      setErrors({ phone: phoneError });
      showToast(phoneError, 'error');
      return;
    }

    setLoading(true);
    
    try {
      // Call Firebase auth service
      const result = await authService.sendOTP(phone);
      
      if (result.success) {
        setOtpSent(true);
        showToast(`✅ OTP sent to +91-${phone}`, 'success');
        setTimeout(() => document.getElementById('otp-0')?.focus(), 100);
      } else {
        showToast(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      showToast('❌ Failed to send OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setErrors({ otp: 'Please enter complete 6-digit OTP' });
      showToast('Please enter complete 6-digit OTP', 'error');
      return;
    }

    setLoading(true);

    try {
      // Verify OTP with Firebase
      const result = await authService.verifyOTP(otpValue);
      
      if (result.success) {
        showToast('🎉 Login successful!', 'success');
        setTimeout(() => {
          onLogin({
            name: result.user.displayName || 'User',
            phone: phone,
            uid: result.user.uid,
            phoneNumber: result.user.phoneNumber
          });
        }, 500);
      } else {
        setErrors({ otp: result.message });
        showToast(`❌ ${result.message}`, 'error');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      showToast('❌ Verification failed. Please try again.', 'error');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setOtp(['', '', '', '', '', '']);
    
    try {
      const result = await authService.resendOTP(phone);
      if (result.success) {
        showToast('🔄 OTP resent successfully!', 'success');
      } else {
        showToast(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      showToast('❌ Failed to resend OTP', 'error');
    } finally {
      setLoading(false);
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
      {/* Background decorations */}
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

      {/* reCAPTCHA container (invisible) */}
      <div id="recaptcha-container"></div>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Main Card */}
      <div style={{
        background: colors.cardBg,
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '450px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
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
          /* Phone Number Entry */
          <div>
            <label style={{ fontSize: '18px', color: colors.text, display: 'block', marginBottom: '12px', fontWeight: '600' }}>
              {t.phoneLabel}
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
                color: colors.text,
                fontWeight: '500'
              }}>+91</div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                maxLength="10"
                style={{
                  width: '100%',
                  padding: '18px 18px 18px 60px',
                  fontSize: '20px',
                  border: `2px solid ${errors.phone ? colors.danger : '#E8E8E8'}`,
                  borderRadius: '16px',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => !errors.phone && (e.target.style.borderColor = colors.primary)}
                onBlur={(e) => !errors.phone && (e.target.style.borderColor = '#E8E8E8')}
              />
            </div>
            {errors.phone && (
              <div style={{ color: colors.danger, fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} />
                {errors.phone}
              </div>
            )}
            <div style={{ fontSize: '13px', color: colors.textLight, marginBottom: '20px' }}>
              💡 You will receive a 6-digit OTP via SMS
            </div>
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
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? '⏳ ' + t.loading + '...' : t.sendOTP}
            </button>
          </div>
        ) : (
          /* OTP Entry */
          <div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '18px', color: colors.text, display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {t.otpLabel}
              </label>
              <p style={{ fontSize: '14px', color: colors.textLight, margin: 0 }}>
                Code sent to +91-{phone}
              </p>
            </div>

            {/* OTP Input Boxes */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '12px' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  maxLength="1"
                  style={{
                    width: '56px',
                    height: '56px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    border: `2px solid ${errors.otp ? colors.danger : digit ? colors.primary : '#E8E8E8'}`,
                    borderRadius: '12px',
                    outline: 'none',
                    background: digit ? 'rgba(108, 92, 231, 0.05)' : 'white',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => !errors.otp && (e.target.style.borderColor = colors.primary)}
                  onBlur={(e) => !errors.otp && !digit && (e.target.style.borderColor = '#E8E8E8')}
                />
              ))}
            </div>

            {errors.otp && (
              <div style={{ color: colors.danger, fontSize: '14px', marginBottom: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <AlertCircle size={16} />
                {errors.otp}
              </div>
            )}

            <button
              onClick={handleLogin}
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
                marginBottom: '12px',
                boxShadow: '0 10px 25px rgba(0, 184, 148, 0.4)'
              }}
            >
              {loading ? '⏳ ' + t.loading + '...' : t.login}
            </button>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setOtpSent(false); setPhone(''); setOtp(['', '', '', '', '', '']); setErrors({}); }}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '15px',
                  background: 'transparent',
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {t.changeNumber}
              </button>
              <button
                onClick={handleResendOTP}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '15px',
                  background: 'transparent',
                  color: colors.secondary,
                  border: `2px solid ${colors.secondary}`,
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                🔄 Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>

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
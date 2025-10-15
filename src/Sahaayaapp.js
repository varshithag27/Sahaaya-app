import React, { useState, useEffect } from 'react';
import { Heart, Bell, Phone, Edit, Calendar, User, AlertCircle, Plus, ChevronRight, Activity, X, Mail, MapPin, HeartPulse, HospitalIcon} from 'lucide-react';
import authService from './services/authService';
import translations, { getAvailableLanguages } from './pages/translations';

// --- Utility Functions for Local Storage Persistence ---

const getLocalStorageData = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setLocalStorageData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Mock Authentication Context
const AuthContext = React.createContext();

// Enhanced Color Palette
const colors = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  secondary: '#00B894',
  secondaryLight: '#55EFC4',
  danger: '#FF6B6B',
  dangerLight: '#FF8787',
  warning: '#FFA502',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cardBg: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
  accent: '#FDCB6E'
};

// Animated Card Component
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

// Reusable Modal Component with Transition
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      transition: 'opacity 0.3s ease-in-out',
    }}>
      <AnimatedCard style={{
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        transform: 'scale(1)',
        animation: 'modalOpen 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: colors.primary, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'background 0.2s',
          }} onMouseEnter={(e) => e.target.style.background = '#f1f1f1'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
            <X size={24} color={colors.textLight} />
          </button>
        </div>
        {children}
      </AnimatedCard>
      <style>
        {`
          @keyframes modalOpen {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

// Reusable Input Style
const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #E8E8E8',
  borderRadius: '12px',
  marginBottom: '16px',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s',
  outline: 'none',
};

// Login Screen with Firebase Authentication
const LoginScreen = ({ onLogin, language, setLanguage }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const t = translations[language] || translations.en;

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
      {/* Animated Background Circles */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)', animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)', animation: 'float 8s ease-in-out infinite reverse'
      }} />

      {/* reCAPTCHA container (invisible) */}
      <div id="recaptcha-container"></div>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: toast.type === 'success' ? colors.secondary : colors.danger,
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          minWidth: '300px',
          maxWidth: '500px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>{toast.message}</span>
            <X size={20} onClick={() => setToast(null)} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      )}

      <AnimatedCard style={{ maxWidth: '450px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value;
              setLanguage(newLang);
              try { localStorage.setItem('sahaaya_language', newLang); } catch {}
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              border: '1px solid #E8E8E8',
              fontWeight: 600,
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            {getAvailableLanguages().map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '24px', width: '80px', height: '80px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'pulse 2s ease-in-out infinite'
          }}>
            <Heart size={40} color="white" fill="white" />
          </div>
          <h1 style={{
            fontSize: '36px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 10px 0', fontWeight: 'bold'
          }}>{t.appName}</h1>
          <p style={{ fontSize: '18px', color: colors.textLight }}>{t.tagline}</p>
        </div>

        {!otpSent ? (
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
                width: '100%', padding: '20px', fontSize: '20px', 
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', border: 'none', borderRadius: '16px', 
                cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', 
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? '⏳ ' + t.loading + '...' : t.sendOTP}
            </button>
          </div>
        ) : (
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
                width: '100%', padding: '20px', fontSize: '20px', 
                background: loading ? '#ccc' : 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
                color: 'white', border: 'none', borderRadius: '16px', 
                cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginBottom: '12px',
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
                  flex: 1, padding: '14px', fontSize: '15px', background: 'transparent',
                  color: colors.primary, border: `2px solid ${colors.primary}`, borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600'
                }}
              >
                {t.changeNumber}
              </button>
              <button
                onClick={handleResendOTP}
                disabled={loading}
                style={{
                  flex: 1, padding: '14px', fontSize: '15px', background: 'transparent',
                  color: colors.secondary, border: `2px solid ${colors.secondary}`, borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600'
                }}
              >
                🔄 Resend OTP
              </button>
            </div>
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
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

// Home Screen (Unchanged)
const HomeScreen = ({ onNavigate, medicationCount, language }) => {
  const t = translations[language] || translations.en;

  const menuItems = [
    { id: 'medications', icon: Bell, label: 'Medications', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', iconColor: '#fff' },
    { id: 'emergency', icon: Phone, label: 'Emergency', gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)', iconColor: '#fff' },
    { id: 'appointments', icon: Calendar, label: 'Appointments', gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)', iconColor: '#fff' },
    { id: 'profile', icon: User, label: 'Profile', gradient: 'linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)', iconColor: '#fff' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F9FA',
      padding: '24px',
      paddingBottom: '100px'
    }}>
      {/* Header with Stats */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '28px',
        padding: '32px',
        marginBottom: '32px',
        color: 'white',
        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)'
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>{new Date().toDateString()}</p>
              <h1 style={{ fontSize: '32px', margin: '8px 0 0 0', fontWeight: 'bold' }}>{t.goodMorning} 👋</h1>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            padding: '12px 16px'
          }}>
            <HospitalIcon size={28} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <Activity size={24} style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>{medicationCount}</p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>{t.medicationsToday}</p>
          </div>
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <HeartPulse size={24} style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>{t.quote1} 💖</p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>{t.quote2} 😊</p>
          </div>
        </div>
      </div>

      {/* SOS Emergency Button - Pulsing */}
      <AnimatedCard
        gradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
        onClick={() => {
          if (window.confirm('🚨 Are you sure you want to send an SOS alert?')) {
            alert('🚨 SOS ALERT SENT!\n📍 Location shared\n📞 Emergency contacts notified');
          }
        }}
        style={{ marginBottom: '32px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.1)',
          animation: 'pulse-ring 2s ease-out infinite'
        }} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', position: 'relative', zIndex: 1
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.3)', borderRadius: '50%', padding: '16px', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <AlertCircle size={48} color="white" />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '28px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
              {t.sosEmergency}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>
              {t.tapForHelp}
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* Menu Grid */}
      <h3 style={{ fontSize: '22px', color: colors.text, marginBottom: '20px', fontWeight: 'bold' }}>
        {t.quickAccess}
      </h3>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'
      }}>
        {menuItems.map(item => (
          <AnimatedCard
            key={item.id}
            gradient={item.gradient}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon size={48} color={item.iconColor} style={{ marginBottom: '16px' }} />
            <p style={{
              fontSize: '20px', color: item.iconColor, fontWeight: 'bold', margin: '0 0 8px 0'
            }}>
              {t[item.id] || item.label}
            </p>
            <ChevronRight size={24} color={item.iconColor} style={{ opacity: 0.7 }} />
          </AnimatedCard>
        ))}
      </div>

      <style>
        {`
          @keyframes pulse-ring {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

// --- Medications Components ---

// Initial/Mock Medication Data
const MOCK_MEDICATIONS = [
  { id: 1, name: 'Aspirin', dosage: '100mg', time: '8:00 AM', frequency: 'Daily', taken: true, color: '#667eea' },
  { id: 2, name: 'Metformin', dosage: '500mg', time: '2:00 PM', frequency: 'Daily', taken: false, color: '#00b894' },
  { id: 3, name: 'Vitamin D', dosage: '1000 IU', time: '9:00 PM', frequency: 'Daily', taken: false, color: '#fdcb6e' }
];

const getMedications = () => getLocalStorageData('sahaaya_medications', MOCK_MEDICATIONS);
const saveMedications = (meds) => setLocalStorageData('sahaaya_medications', meds);

const AddMedicationForm = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('09:00'); // Input type 'time' format
  const [frequency, setFrequency] = useState('Daily');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !dosage || !time || !frequency) {
      alert('Please fill in all fields.');
      return;
    }

    const newMedication = {
      id: Date.now(),
      name,
      dosage,
      time: time,
      frequency,
      taken: false,
      color: colors.primary, // Default color for new meds
    };

    onAdd(newMedication);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Medication Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Atorvastatin" style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Dosage</label>
      <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g., 20mg" style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Time</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Frequency</label>
      <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={{ ...inputStyle, appearance: 'none' }} required>
        <option value="Daily">Daily</option>
        <option value="Twice a Day">Twice a Day</option>
        <option value="Weekly">Weekly</option>
        <option value="As Needed">As Needed</option>
      </select>

      <button
        type="submit"
        style={{
          width: '100%', padding: '16px', fontSize: '18px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '16px'
        }}
      >
        + Add Medication
      </button>
    </form>
  );
};

const MedicationsScreen = ({ onBack, language }) => {
  const t = translations[language] || translations.en;
  const [medications, setMedications] = useState(getMedications);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    saveMedications(medications);
  }, [medications]);

  const handleAddMedication = (newMed) => {
    setMedications(prevMeds => [...prevMeds, newMed]);
  };

  const handleToggleTaken = (id) => {
    setMedications(prevMeds =>
      prevMeds.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const handleDeleteAll = () => {
    if (window.confirm(`${t.confirm}?`)) {
      setMedications([]);
      saveMedications([]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            fontSize: '18px', color: colors.primary, background: 'white', border: 'none', cursor: 'pointer',
            padding: '12px 20px', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          {t.back}
        </button>
        <button
          onClick={handleDeleteAll}
          style={{
            fontSize: '18px', color: 'white', background: colors.danger, border: 'none', cursor: 'pointer',
            padding: '12px 20px', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          🗑️ {t.delete} All
        </button>
      </div>

      <h1 style={{ fontSize: '32px', color: colors.text, marginBottom: '12px', fontWeight: 'bold' }}>💊 {t.myMedications}</h1>
      <p style={{ fontSize: '16px', color: colors.textLight, marginBottom: '28px' }}>{t.stayOnTrack}</p>

      {medications.map((med) => (
        <AnimatedCard key={med.id} style={{
          marginBottom: '16px',
          borderLeft: `6px solid ${med.color}`,
          opacity: med.taken ? 0.6 : 1,
          transition: 'opacity 0.3s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '24px', color: colors.text, margin: 0, fontWeight: 'bold' }}>
                  {med.name}
                </h3>
                {med.taken && (
                  <span style={{
                    background: '#00b894', color: 'white', padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 'bold'
                  }}>
                    ✓ {t.taken}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '16px', color: colors.textLight, margin: '4px 0' }}>💊 {med.dosage}</p>
              <p style={{ fontSize: '18px', color: colors.text, margin: '8px 0', fontWeight: '600' }}>
                ⏰ {med.time}
              </p>
              <p style={{ fontSize: '16px', color: colors.textLight, margin: '4px 0' }}>📅 {med.frequency}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => handleToggleTaken(med.id)}
                style={{
                  background: med.taken ? colors.danger : med.color,
                  color: 'white', border: 'none', borderRadius: '12px', padding: '12px 16px',
                  fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {med.taken ? t.undo || 'Undo' : t.markTaken}
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`${t.confirm}?`)) {
                    setMedications(prev => prev.filter(m => m.id !== med.id));
                  }
                }}
                style={{
                  background: colors.danger, color: 'white', border: 'none', borderRadius: '12px', padding: '12px 16px',
                  fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {t.delete}
              </button>
            </div>
          </div>
        </AnimatedCard>
      ))}

      <AnimatedCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" onClick={() => setIsModalOpen(true)} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Plus size={28} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>{t.addNewMedication}</span>
        </div>
      </AnimatedCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t.addNewMedication}>
        <AddMedicationForm onAdd={handleAddMedication} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};



// --- Appointments Components ---

// Mock Appointments Data
const MOCK_APPOINTMENTS = [
  { id: 1, title: 'Doctor Visit', date: '2025-10-20', time: '10:00', location: 'City Hospital', completed: false },
  { id: 2, title: 'Dentist', date: '2025-10-22', time: '14:30', location: 'Dental Clinic', completed: false }
];

const getAppointments = () => getLocalStorageData('sahaaya_appointments', MOCK_APPOINTMENTS);
const saveAppointments = (appointments) => setLocalStorageData('sahaaya_appointments', appointments);

// Form to Add Appointment
const AddAppointmentForm = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time || !location) {
      alert('Please fill in all fields.');
      return;
    }
    const newAppointment = {
      id: Date.now(),
      title,
      date,
      time,
      location,
      completed: false
    };
    onAdd(newAppointment);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Date</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Time</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Location</label>
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} required />

      <button
        type="submit"
        style={{
          width: '100%', padding: '16px', fontSize: '18px',
          background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
          color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '16px'
        }}
      >
        + Add Appointment
      </button>
    </form>
  );
};

// Appointments Screen
const AppointmentsScreen = ({ onBack, language }) => {
  const t = translations[language] || translations.en;
  const [appointments, setAppointments] = useState(getAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  const handleAddAppointment = (newAppt) => {
    setAppointments(prev => [...prev, newAppt]);
  };

  const toggleCompleted = (id) => {
    setAppointments(prev =>
      prev.map(appt => appt.id === id ? { ...appt, completed: !appt.completed } : appt)
    );
  };

  const handleDeleteAll = () => {
    if (window.confirm(`${t.confirm}?`)) {
      setAppointments([]);
      saveAppointments([]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{
          fontSize: '18px', color: colors.primary, background: 'white', border: 'none', cursor: 'pointer',
          padding: '12px 20px', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          {t.back}
        </button>
        <button onClick={handleDeleteAll} style={{
          fontSize: '18px', color: 'white', background: colors.danger, border: 'none', cursor: 'pointer',
          padding: '12px 20px', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          🗑️ {t.delete} All
        </button>
      </div>

      <h1 style={{ fontSize: '32px', color: colors.text, marginBottom: '12px', fontWeight: 'bold' }}>📅 {t.myAppointments || 'My Appointments'}</h1>
      <p style={{ fontSize: '16px', color: colors.textLight, marginBottom: '28px' }}>{t.manageAppointments || 'Manage your upcoming appointments'}</p>

      {appointments.map(appt => (
        <AnimatedCard key={appt.id} style={{ marginBottom: '16px', opacity: appt.completed ? 0.6 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{appt.title}</h3>
              <p style={{ fontSize: '16px', margin: '4px 0' }}>{appt.date} ⏰ {appt.time}</p>
              <p style={{ fontSize: '16px', margin: '4px 0', color: colors.textLight }}>{appt.location}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => toggleCompleted(appt.id)}
                style={{
                  padding: '10px 16px',
                  background: appt.completed ? colors.danger : colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {appt.completed ? (t.undo || 'Undo') : (t.done || 'Done')}
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`${t.confirm}?`)) {
                    setAppointments(prev => prev.filter(a => a.id !== appt.id));
                  }
                }}
                style={{
                  padding: '10px 16px',
                  background: colors.danger,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {t.delete}
              </button>
            </div>
          </div>
        </AnimatedCard>
      ))}

      <AnimatedCard gradient="linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)" onClick={() => setIsModalOpen(true)} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Plus size={28} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>{t.addAppointment || 'Add Appointment'}</span>
        </div>
      </AnimatedCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t.addAppointment || 'Add New Appointment'}>
        <AddAppointmentForm onAdd={handleAddAppointment} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};




//--- Profile Components ---

const EditProfileForm = ({ profile, onSave, onClose }) => {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup);
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, age, phone, email, address, bloodGroup, emergencyContact });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
      
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Age</label>
      <input type="text" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Address</label>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Blood Group</label>
      <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Emergency Contact</label>
      <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} style={inputStyle} required />

      <button
        type="submit"
        style={{
          width: '100%', padding: '16px', fontSize: '18px',
          background: 'linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)',
          color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '16px'
        }}
      >
        Save Changes
      </button>
    </form>
  );
};

// Local Definition of AnimatedProfileCard (Using the existing AnimatedCard)
const AnimatedProfileCard = AnimatedCard; 

const themecolors = colors; // Use the globally defined colors object

const DEFAULT_PROFILE = {
  name: 'Rajesh Kumar',
  age: '68 years',
  phone: '+91 9876543210',
  email: 'rajesh@example.com',
  address: 'Bangalore, Karnataka',
  bloodGroup: 'O+',
  emergencyContact: '+91 9876543211'
};

const getProfile = () => {
  const saved = localStorage.getItem('sahaaya_profile');
  return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
};

const saveProfile = (profile) => {
  localStorage.setItem('sahaaya_profile', JSON.stringify(profile));
};

const ProfileScreen = ({ onBack }) => {
  const [profile, setProfile] = useState(getProfile());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
      <button
        onClick={onBack}
        style={{
          fontSize: '18px',
          color: themecolors.primary,
          background: 'white',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '24px',
          padding: '12px 20px',
          borderRadius: '12px',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        ← Back
      </button>

      {/* Profile Header */}
      <AnimatedProfileCard gradient="linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '48px'
        }}>
          👤
        </div>
        <h1 style={{ fontSize: '32px', color: 'white', margin: '0 0 8px 0', fontWeight: 'bold' }}>
          {profile.name} 
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          {profile.age}
        </p>
      </AnimatedProfileCard>

      <h2 style={{ fontSize: '24px', color: themecolors.text, marginBottom: '16px', fontWeight: 'bold' }}>
        Personal Information
      </h2>

      {/* Info Cards */}
      {[
        { label: 'Phone Number', value: profile.phone, icon: <Phone size={24} color="white" />, bg: '#667eea' },
        { label: 'Email', value: profile.email, icon: <Mail size={24} color="white" />, bg: '#00b894' },
        { label: 'Blood Group', value: profile.bloodGroup, icon: <Heart size={24} color="white" />, bg: '#ff6b6b' },
        { label: 'Address', value: profile.address, icon: <MapPin size={24} color="white" />, bg: '#fdcb6e' },
        { label: 'Emergency Contact', value: profile.emergencyContact, icon: <Phone size={24} color="white" />, bg: '#e17055' }
      ].map((item) => (
        <AnimatedProfileCard key={item.label} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: item.bg,
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {item.icon}
            </div>
            <div>
              <p style={{ fontSize: '14px', color: themecolors.textLight, margin: '0 0 4px 0' }}>{item.label}</p>
              <p style={{ fontSize: '18px', color: themecolors.text, margin: 0, fontWeight: '600' }}>{item.value}</p>
            </div>
          </div>
        </AnimatedProfileCard>
      ))}

      {/* Edit Profile Button */}
      <AnimatedProfileCard
        gradient="linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)"
        onClick={() => setIsEditing(true)} // Open modal
        style={{ marginTop: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Edit size={24} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            Edit Profile
          </span>
        </div>
      </AnimatedProfileCard>

      {/* Modal for Editing */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
        <EditProfileForm
          profile={profile}
          onSave={setProfile} // Save changes
          onClose={() => setIsEditing(false)}
        />
      </Modal>
    </div>
  );
};


// App component (for the main application flow) - REMOVED AS UNUSED



// --- Emergency Contacts Components ---

// Initial/Mock Contacts Data
const MOCK_CONTACTS = [
  { id: 1, name: 'Dr. Sharma', relation: 'Primary Doctor', phone: '+91 98765 43210', avatar: '👨‍⚕', color: '#667eea' },
  { id: 2, name: 'Rajesh Kumar', relation: 'Son', phone: '+91 98765 43211', avatar: '👨', color: '#00b894' },
  { id: 3, name: 'Priya Devi', relation: 'Daughter', phone: '+91 98765 43212', avatar: '👩', color: '#fd79a8' }
];

const CONTACT_COLORS = ['#6C5CE7', '#00B894', '#FFA502', '#FF6B6B', '#FDCB6E', '#A29BFE'];
const CONTACT_AVATARS = ['😊', '😇', '😎', '🤩', '🥳', '🤓', '🧑', '👩', '👨', '🏥', '🚨'];

const getContacts = () => getLocalStorageData('sahaaya_contacts', MOCK_CONTACTS);
const saveContacts = (contacts) => setLocalStorageData('sahaaya_contacts', contacts);

const AddContactForm = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(CONTACT_AVATARS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !relation || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    const newContact = {
      id: Date.now(),
      name,
      relation,
      phone,
      avatar,
      color: CONTACT_COLORS[Math.floor(Math.random() * CONTACT_COLORS.length)],
    };

    onAdd(newContact);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Relation</label>
      <input type="text" value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="e.g., Son, Doctor, Neighbour" style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone Number</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" style={inputStyle} required />

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Avatar/Emoji (Optional)</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {CONTACT_AVATARS.map(emo => (
          <div
            key={emo}
            onClick={() => setAvatar(emo)}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              padding: '10px',
              borderRadius: '50%',
              background: avatar === emo ? colors.primaryLight : '#f1f1f1',
              transition: 'background 0.2s',
              border: avatar === emo ? `2px solid ${colors.primary}` : '2px solid transparent'
            }}
          >
            {emo}
          </div>
        ))}
      </div>

      <button
        type="submit"
        style={{
          width: '100%', padding: '16px', fontSize: '18px', background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
          color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '16px'
        }}
      >
        + Add Contact
      </button>
    </form>
  );
};

const EmergencyContactsScreen = ({ onBack, language }) => {
  const t = translations[language] || translations.en;
  const [contacts, setContacts] = useState(getContacts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);

  const handleAddContact = (newContact) => {
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

  const handleDeleteAll = () => {
    if (window.confirm(`${t.confirm}?`)) {
      setContacts([]);
      saveContacts([]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            fontSize: '18px', color: colors.primary, background: 'white', border: 'none', cursor: 'pointer',
            padding: '12px 20px', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          {t.back}
        </button>
        <button
          onClick={handleDeleteAll}
          style={{
            fontSize: '18px', color: 'white', background: colors.danger, border: 'none', cursor: 'pointer',
            padding: '12px 20px', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          🗑️ {t.delete} All
        </button>
      </div>

      <h1 style={{ fontSize: '32px', color: colors.text, marginBottom: '12px', fontWeight: 'bold' }}>📞 {t.emergencyContactsTitle}</h1>
      <p style={{ fontSize: '16px', color: colors.textLight, marginBottom: '28px' }}>{t.trustedSupportNetwork}</p>

      {contacts.map(contact => (
        <AnimatedCard key={contact.id} style={{
          marginBottom: '16px',
          borderLeft: `6px solid ${contact.color}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%', background: contact.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0
            }}>
              {contact.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '24px', color: colors.text, margin: '0 0 8px 0', fontWeight: 'bold' }}>
                {contact.name}
              </h3>
              <p style={{ fontSize: '16px', color: colors.textLight, margin: '4px 0' }}>
                {contact.relation}
              </p>
              <p style={{ fontSize: '18px', color: contact.color, margin: '8px 0 0 0', fontWeight: 'bold' }}>
                {contact.phone}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                style={{
                  background: contact.color, color: 'white', border: 'none', borderRadius: '50%',
                  width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0
                }}
              >
                <Phone size={24} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`${t.confirm}?`)) {
                    setContacts(prev => prev.filter(c => c.id !== contact.id));
                  }
                }}
                style={{
                  background: colors.danger, color: 'white', border: 'none', borderRadius: '12px', padding: '12px 16px',
                  fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {t.delete}
              </button>
            </div>
          </div>
        </AnimatedCard>
      ))}

      <AnimatedCard gradient="linear-gradient(135deg, #00b894 0%, #55efc4 100%)" onClick={() => setIsModalOpen(true)} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Plus size={28} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>{t.addNewContact}</span>
        </div>
      </AnimatedCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t.emergencyContactsTitle}>
        <AddContactForm onAdd={handleAddContact} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

// Main App Component
const SahaayaApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('sahaaya_language') || 'en';
    } catch {
      return 'en';
    }
  });

  // Get total medication count for display on Home Screen
  const [medicationCount, setMedicationCount] = useState(getMedications().length);
  useEffect(() => {
    // A small hack to update the count on home when medications change in localStorage
    const handleStorageChange = () => {
      if (currentScreen === 'home') {
        setMedicationCount(getMedications().length);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentScreen]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    // Refresh count when navigating to home just in case
    if (screen === 'home') {
      setMedicationCount(getMedications().length);
    }
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} language={language} setLanguage={setLanguage} />;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {currentScreen === 'home' && <HomeScreen onNavigate={handleNavigate} medicationCount={medicationCount} language={language} />}
      {currentScreen === 'medications' && <MedicationsScreen onBack={handleBack} language={language} />}
      {currentScreen === 'emergency' && <EmergencyContactsScreen onBack={handleBack} language={language} />}
      {currentScreen === 'appointments' && <AppointmentsScreen onBack={handleBack} language={language} />}
      {currentScreen === 'profile' && <ProfileScreen onBack={handleBack} language={language} />}
    </AuthContext.Provider>
  );
};

export default SahaayaApp;
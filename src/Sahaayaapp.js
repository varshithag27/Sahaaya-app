// SahaayaApp.js - YOUR MAIN FILE
import React, { useState } from 'react';
import { Heart, Bell, Phone, Settings, Calendar, User, AlertCircle, Plus, ChevronRight, Activity, Shield, Fingerprint } from 'lucide-react';

// IMPORT ALL YOUR NEW FILES HERE
import { translations } from './pages/translations';
import { validatePhone, validateOTP } from './pages/validation';
import AddMedicationForm from './pages/AddMedicationForm';
import AddContactForm from './pages/AddContactForm';
import AppointmentsScreen from './pages/AppointmentsScreen';
import ProfileScreen from './pages/ProfileScreen';

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

// Animated Card Component (same as before)
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

// UPDATED Login Screen with Biometric and Validation
const LoginScreen = ({ onLogin, language, onLanguageChange }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const t = translations[language];

  const handleSendOTP = () => {
    const validation = validatePhone(phone);
    if (validation.valid) {
      setOtpSent(true);
      setPhoneError('');
      setTimeout(() => alert('✅ OTP sent successfully!'), 300);
    } else {
      setPhoneError(validation.error);
    }
  };

  const handleLogin = () => {
    const validation = validateOTP(otp);
    if (validation.valid) {
      setBiometricEnabled(true);
      setOtpError('');
      onLogin({ name: 'User', phone, biometricEnabled: true });
    } else {
      setOtpError(validation.error);
    }
  };

  const handleBiometricLogin = () => {
    setTimeout(() => {
      alert('✅ Biometric authentication successful!');
      onLogin({ name: 'User', phone: '9876543210', biometricEnabled: true });
    }, 500);
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
                width: '100%',
                padding: '18px',
                fontSize: '20px',
                border: `2px solid ${phoneError ? colors.danger : '#E8E8E8'}`,
                borderRadius: '16px',
                marginBottom: '8px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {phoneError && <p style={{ color: colors.danger, fontSize: '14px', margin: '0 0 16px 0' }}>{phoneError}</p>}
            
            <button
              onClick={handleSendOTP}
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: phoneError ? '0' : '16px',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
              }}
            >
              {t.sendOTP}
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
              onClick={handleLogin}
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '20px',
                background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: otpError ? '0' : '16px',
                marginBottom: '12px',
                boxShadow: '0 10px 25px rgba(0, 184, 148, 0.4)'
              }}
            >
              {t.login}
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

// Home Screen (same as before)
const HomeScreen = ({ onNavigate, language }) => {
  const t = translations[language];
  
  const menuItems = [
    { id: 'medications', icon: Bell, label: t.medications, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', iconColor: '#fff' },
    { id: 'emergency', icon: Phone, label: t.emergency, gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)', iconColor: '#fff' },
    { id: 'appointments', icon: Calendar, label: t.appointments, gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)', iconColor: '#fff' },
    { id: 'profile', icon: User, label: t.profile, gradient: 'linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)', iconColor: '#fff' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
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
            <h1 style={{ fontSize: '32px', margin: '8px 0 0 0', fontWeight: 'bold' }}>{t.goodMorning}</h1>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '12px 16px' }}>
            <Settings size={28} style={{ cursor: 'pointer' }} />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '16px', backdropFilter: 'blur(10px)' }}>
            <Activity size={24} style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>3</p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Medications Today</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '16px', backdropFilter: 'blur(10px)' }}>
            <Shield size={24} style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>Safe</p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>All Systems OK</p>
          </div>
        </div>
      </div>

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
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          animation: 'pulse-ring 2s ease-out infinite'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={48} color="white" />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '28px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
              SOS EMERGENCY
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>
              Tap for immediate help
            </p>
          </div>
        </div>
      </AnimatedCard>

      <h3 style={{ fontSize: '22px', color: colors.text, marginBottom: '20px', fontWeight: 'bold' }}>
        Quick Access
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {menuItems.map(item => (
          <AnimatedCard key={item.id} gradient={item.gradient} onClick={() => onNavigate(item.id)}>
            <item.icon size={48} color={item.iconColor} style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '20px', color: item.iconColor, fontWeight: 'bold', margin: '0 0 8px 0' }}>
              {item.label}
            </p>
            <ChevronRight size={24} color={item.iconColor} style={{ opacity: 0.7 }} />
          </AnimatedCard>
        ))}
      </div>

      <style>
        {`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

// UPDATED Medications Screen with Add Form
const MedicationsScreen = ({ onBack }) => {
  const [medications, setMedications] = useState([
    { id: 1, name: 'Aspirin', dosage: '100mg', time: '8:00 AM', frequency: 'Daily', taken: true, color: '#667eea' },
    { id: 2, name: 'Metformin', dosage: '500mg', time: '2:00 PM', frequency: 'Daily', taken: false, color: '#00b894' },
    { id: 3, name: 'Vitamin D', dosage: '1000 IU', time: '9:00 PM', frequency: 'Daily', taken: false, color: '#fdcb6e' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);

  const markTaken = (id) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: true } : med
    ));
    alert('✅ Medication marked as taken!');
  };

  const addMedication = (formData) => {
    const colors = ['#667eea', '#00b894', '#fdcb6e', '#fd79a8'];
    const newMedication = {
      id: medications.length + 1,
      ...formData,
      taken: false,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setMedications([...medications, newMedication]);
    alert('✅ Medication added successfully!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
      <button onClick={onBack} style={{
        fontSize: '18px',
        color: colors.primary,
        background: 'white',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '24px',
        padding: '12px 20px',
        borderRadius: '12px',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        ← Back
      </button>
      
      <h1 style={{ fontSize: '32px', color: colors.text, marginBottom: '12px', fontWeight: 'bold' }}>
        💊 My Medications
      </h1>
      <p style={{ fontSize: '16px', color: colors.textLight, marginBottom: '28px' }}>
        Stay on track with your health routine
      </p>

      {medications.map((med) => (
        <AnimatedCard key={med.id} style={{
          marginBottom: '16px',
          borderLeft: `6px solid ${med.color}`,
          opacity: med.taken ? 0.6 : 1
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '24px', color: colors.text, margin: 0, fontWeight: 'bold' }}>
                  {med.name}
                </h3>
                {med.taken && (
                  <span style={{
                    background: '#00b894',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓ Taken
                  </span>
                )}
              </div>
              <p style={{ fontSize: '16px', color: colors.textLight, margin: '4px 0' }}>
                💊 {med.dosage}
              </p>
              <p style={{ fontSize: '18px', color: colors.text, margin: '8px 0', fontWeight: '600' }}>
                ⏰ {med.time}
              </p>
              <p style={{ fontSize: '16px', color: colors.textLight, margin: '4px 0' }}>
                📅 {med.frequency}
              </p>
            </div>
            {!med.taken && (
              <button 
                onClick={() => markTaken(med.id)}
                style={{
                  background: med.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Mark Taken
              </button>
            )}
          </div>
        </AnimatedCard>
      ))}

      <AnimatedCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" onClick={() => setShowAddModal(true)} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Plus size={28} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            Add New Medication
          </span>
        </div>
      </AnimatedCard>

      {/* USE THE IMPORTED ADD FORM */}
      <AddMedicationForm 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={addMedication}
      />
    </div>
  );
};

// UPDATED Emergency Contacts Screen with Add Form
const EmergencyContactsScreen = ({ onBack }) => {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Dr. Sharma', relation: 'Primary Doctor', phone: '+91 98765 43210', avatar: '👨‍⚕️', color: '#667eea' },
    { id: 2, name: 'Rajesh Kumar', relation: 'Son', phone: '+91 98765 43211', avatar: '👨', color: '#00b894' },
    { id: 3, name: 'Priya Devi', relation: 'Daughter', phone: '+91 98765 43212', avatar: '👩', color: '#fd79a8' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addContact = (formData) => {
    const newContact = {
      id: contacts.length + 1,
      ...formData
    };
    setContacts([...contacts, newContact]);
    alert('✅ Contact added successfully!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
      <button onClick={onBack} style={{
        fontSize: '18px',
        color: colors.primary,
        background: 'white',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '24px',
        padding: '12px 20px',
        borderRadius: '12px',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        ← Back
      </button>
      
      <h1 style={{ fontSize: '32px', color: colors.text, marginBottom: '12px', fontWeight: 'bold' }}>
        📞📞 Emergency Contacts
      </h1>
      <p style={{ fontSize: '16px', color: colors.textLight, marginBottom: '28px' }}>
        Your trusted support network
      </p>

      {contacts.map(contact => (
        <AnimatedCard key={contact.id} style={{
          marginBottom: '16px',
          borderLeft: `6px solid ${contact.color}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: contact.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              flexShrink: 0
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
            <button style={{
              background: contact.color,
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <Phone size={24} />
            </button>
          </div>
        </AnimatedCard>
      ))}

      <AnimatedCard gradient="linear-gradient(135deg, #00b894 0%, #55efc4 100%)" onClick={() => setShowAddModal(true)} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Plus size={28} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            Add New Contact
          </span>
        </div>
      </AnimatedCard>

      {/* USE THE IMPORTED ADD CONTACT FORM */}
      <AddContactForm 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={addContact}
      />
    </div>
  );
};

// Main App Component
const SahaayaApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} language={language} onLanguageChange={handleLanguageChange} />;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {currentScreen === 'home' && <HomeScreen onNavigate={handleNavigate} language={language} />}
      {currentScreen === 'medications' && <MedicationsScreen onBack={handleBack} />}
      {currentScreen === 'emergency' && <EmergencyContactsScreen onBack={handleBack} />}
      {/* USE IMPORTED SCREENS */}
      {currentScreen === 'appointments' && <AppointmentsScreen onBack={handleBack} />}
      {currentScreen === 'profile' && <ProfileScreen onBack={handleBack} user={user} />}
    </AuthContext.Provider>
  );
};

export default SahaayaApp;
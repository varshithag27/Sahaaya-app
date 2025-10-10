import React, { useState } from 'react';
import { Heart, Bell, Phone, Settings, Home, Calendar, User, AlertCircle, Plus, ChevronRight, Activity, Shield } from 'lucide-react';

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

// Login Screen
const LoginScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      // Simulate OTP send
      setTimeout(() => alert('✅ OTP sent successfully!'), 300);
    }
  };

  const handleLogin = () => {
    if (otp.length === 6) {
      onLogin({ name: 'User', phone });
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

      <AnimatedCard style={{ maxWidth: '420px', width: '100%', position: 'relative', zIndex: 1 }}>
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
          }}>Sahaaya</h1>
          <p style={{ fontSize: '18px', color: colors.textLight }}>Your Healthcare Companion</p>
        </div>

        {!otpSent ? (
          <div>
            <label style={{ 
              fontSize: '18px', 
              color: colors.text, 
              display: 'block', 
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              📱 Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit number"
              maxLength="10"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '20px',
                border: '2px solid #E8E8E8',
                borderRadius: '16px',
                marginBottom: '24px',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = '#E8E8E8'}
            />
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
                transition: 'transform 0.2s',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Send OTP 🚀
            </button>
          </div>
        ) : (
          <div>
            <label style={{ 
              fontSize: '18px', 
              color: colors.text, 
              display: 'block', 
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              🔐 Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '24px',
                border: '2px solid #E8E8E8',
                borderRadius: '16px',
                marginBottom: '24px',
                boxSizing: 'border-box',
                letterSpacing: '8px',
                textAlign: 'center',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.secondary}
              onBlur={(e) => e.target.style.borderColor = '#E8E8E8'}
            />
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
                marginBottom: '12px',
                boxShadow: '0 10px 25px rgba(0, 184, 148, 0.4)'
              }}
            >
              Login ✅
            </button>
            <button
              onClick={() => setOtpSent(false)}
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
              ← Change Number
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

// Home Screen
const HomeScreen = ({ onNavigate }) => {
  const [time] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  
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
            <h1 style={{ fontSize: '32px', margin: '8px 0 0 0', fontWeight: 'bold' }}>Good Morning! 👋</h1>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            padding: '12px 16px'
          }}>
            <Settings size={28} style={{ cursor: 'pointer' }} />
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
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>3</p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Medications Today</p>
          </div>
          <div style={{ 
            flex: 1, 
            background: 'rgba(255,255,255,0.15)', 
            borderRadius: '16px', 
            padding: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <Shield size={24} style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>Safe</p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>All Systems OK</p>
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
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          animation: 'pulse-ring 2s ease-out infinite'
        }} />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '20px',
          position: 'relative',
          zIndex: 1
        }}>
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

      {/* Menu Grid */}
      <h3 style={{ fontSize: '22px', color: colors.text, marginBottom: '20px', fontWeight: 'bold' }}>
        Quick Access
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
      }}>
        {menuItems.map(item => (
          <AnimatedCard
            key={item.id}
            gradient={item.gradient}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon size={48} color={item.iconColor} style={{ marginBottom: '16px' }} />
            <p style={{ 
              fontSize: '20px', 
              color: item.iconColor, 
              fontWeight: 'bold', 
              margin: '0 0 8px 0' 
            }}>
              {item.label}
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

// Medications Screen
const MedicationsScreen = ({ onBack }) => {
  const [medications] = useState([
    { id: 1, name: 'Aspirin', dosage: '100mg', time: '8:00 AM', frequency: 'Daily', taken: true, color: '#667eea' },
    { id: 2, name: 'Metformin', dosage: '500mg', time: '2:00 PM', frequency: 'Daily', taken: false, color: '#00b894' },
    { id: 3, name: 'Vitamin D', dosage: '1000 IU', time: '9:00 PM', frequency: 'Daily', taken: false, color: '#fdcb6e' }
  ]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
      <button
        onClick={onBack}
        style={{
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
        }}
      >
        ← Back
      </button>
      
      <h1 style={{ fontSize: '32px', color: colors.text, marginBottom: '12px', fontWeight: 'bold' }}>
        💊 My Medications
      </h1>
      <p style={{ fontSize: '16px', color: colors.textLight, marginBottom: '28px' }}>
        Stay on track with your health routine
      </p>

      {medications.map((med, index) => (
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
              <button style={{
                background: med.color,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Mark Taken
              </button>
            )}
          </div>
        </AnimatedCard>
      ))}

      <AnimatedCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" onClick={() => alert('Add medication feature coming soon!')} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Plus size={28} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            Add New Medication
          </span>
        </div>
      </AnimatedCard>
    </div>
  );
};

// Emergency Contacts Screen
const EmergencyContactsScreen = ({ onBack }) => {
  const [contacts] = useState([
    { id: 1, name: 'Dr. Sharma', relation: 'Primary Doctor', phone: '+91 98765 43210', avatar: '👨‍⚕️', color: '#667eea' },
    { id: 2, name: 'Rajesh Kumar', relation: 'Son', phone: '+91 98765 43211', avatar: '👨', color: '#00b894' },
    { id: 3, name: 'Priya Devi', relation: 'Daughter', phone: '+91 98765 43212', avatar: '👩', color: '#fd79a8' }
  ]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px', paddingBottom: '100px' }}>
      <button
        onClick={onBack}
        style={{
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
        }}
      >
        ← Back
      </button>
      
      <h1 style={{ fontSize: '32px', color: colors.text, marginBottom: '12px', fontWeight: 'bold' }}>
        📞 Emergency Contacts
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

      <AnimatedCard gradient="linear-gradient(135deg, #00b894 0%, #55efc4 100%)" onClick={() => alert('Add contact feature coming soon!')} style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Plus size={28} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            Add New Contact
          </span>
        </div>
      </AnimatedCard>
    </div>
  );
};

// Main App Component
const SahaayaApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {currentScreen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
      {currentScreen === 'medications' && <MedicationsScreen onBack={handleBack} />}
      {currentScreen === 'emergency' && <EmergencyContactsScreen onBack={handleBack} />}
      {currentScreen === 'appointments' && (
        <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px' }}>
          <button onClick={handleBack} style={{ fontSize: '18px', color: colors.primary, background: 'white', border: 'none', cursor: 'pointer', padding: '12px 20px', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>← Back</button>
          <h1 style={{ fontSize: '32px', color: colors.text, marginTop: '24px', fontWeight: 'bold' }}>📅 Appointments</h1>
          <p style={{ fontSize: '18px', color: colors.textLight, marginTop: '12px' }}>Coming Soon...</p>
        </div>
      )}
      {currentScreen === 'profile' && (
        <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '24px' }}>
          <button onClick={handleBack} style={{ fontSize: '18px', color: colors.primary, background: 'white', border: 'none', cursor: 'pointer', padding: '12px 20px', borderRadius: '12px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>← Back</button>
          <h1 style={{ fontSize: '32px', color: colors.text, marginTop: '24px', fontWeight: 'bold' }}>👤 My Profile</h1>
          <p style={{ fontSize: '18px', color: colors.textLight, marginTop: '12px' }}>Coming Soon...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default SahaayaApp;
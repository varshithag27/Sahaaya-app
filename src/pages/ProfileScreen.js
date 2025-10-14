// ProfileScreen.js
import React, { useState } from 'react';
import { Phone, Mail, Calendar, MapPin, Edit } from 'lucide-react';

const colors = {
  primary: '#6C5CE7',
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
        background: gradient || '#FFFFFF',
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

const ProfileScreen = ({ onBack, user }) => {
  const profileData = {
    name: 'Rajesh Kumar',
    phone: user?.phone || '+91 9876543210',
    email: 'rajesh@example.com',
    age: '68 years',
    address: 'Bangalore, Karnataka',
    bloodGroup: 'O+',
    emergencyContact: '+91 9876543211'
  };

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

      {/* Profile Header */}
      <AnimatedCard gradient="linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)" style={{ marginBottom: '24px', textAlign: 'center' }}>
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
          {profileData.name}
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          {profileData.age}
        </p>
      </AnimatedCard>
      
      <h2 style={{ fontSize: '24px', color: colors.text, marginBottom: '16px', fontWeight: 'bold' }}>
        Personal Information
      </h2>

      {/* Phone */}
      <AnimatedCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#667eea',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Phone size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: colors.textLight, margin: '0 0 4px 0' }}>Phone Number</p>
            <p style={{ fontSize: '18px', color: colors.text, margin: 0, fontWeight: '600' }}>
              {profileData.phone}
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* Email */}
      <AnimatedCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#00b894',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: colors.textLight, margin: '0 0 4px 0' }}>Email</p>
            <p style={{ fontSize: '18px', color: colors.text, margin: 0, fontWeight: '600' }}>
              {profileData.email}
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* Blood Group */}
      <AnimatedCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#ff6b6b',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: colors.textLight, margin: '0 0 4px 0' }}>Blood Group</p>
            <p style={{ fontSize: '18px', color: colors.text, margin: 0, fontWeight: '600' }}>
              {profileData.bloodGroup}
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* Address */}
      <AnimatedCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#fdcb6e',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: colors.textLight, margin: '0 0 4px 0' }}>Address</p>
            <p style={{ fontSize: '18px', color: colors.text, margin: 0, fontWeight: '600' }}>
              {profileData.address}
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* Emergency Contact */}
      <AnimatedCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#e17055',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Phone size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: colors.textLight, margin: '0 0 4px 0' }}>Emergency Contact</p>
            <p style={{ fontSize: '18px', color: colors.text, margin: 0, fontWeight: '600' }}>
              {profileData.emergencyContact}
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* Edit Profile Button */}
      <AnimatedCard 
        gradient="linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)" 
        onClick={() => alert('Edit profile feature coming soon!')}
        style={{ marginTop: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Edit size={24} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            Edit Profile
          </span>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ProfileScreen;

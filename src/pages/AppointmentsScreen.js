// AppointmentsScreen.js
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';

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

const AppointmentsScreen = ({ onBack }) => {
  const [appointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sharma',
      specialty: 'Cardiologist',
      date: 'Dec 20, 2024',
      time: '10:00 AM',
      location: 'City Hospital',
      color: '#667eea'
    },
    {
      id: 2,
      doctor: 'Dr. Priya',
      specialty: 'General Physician',
      date: 'Dec 25, 2024',
      time: '2:30 PM',
      location: 'Health Center',
      color: '#00b894'
    },
    {
      id: 3,
      doctor: 'Dr. Kumar',
      specialty: 'Orthopedic',
      date: 'Jan 5, 2025',
      time: '11:00 AM',
      location: 'Metro Clinic',
      color: '#fdcb6e'
    }
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
        📅 My Appointments
      </h1>
      <p style={{ fontSize: '16px', color: colors.textLight, marginBottom: '28px' }}>
        Upcoming medical appointments
      </p>

      {appointments.map((apt) => (
        <AnimatedCard key={apt.id} style={{
          marginBottom: '16px',
          borderLeft: `6px solid ${apt.color}`
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '24px', color: colors.text, margin: '0 0 4px 0', fontWeight: 'bold' }}>
                  {apt.doctor}
                </h3>
                <p style={{ fontSize: '16px', color: colors.textLight, margin: 0 }}>
                  {apt.specialty}
                </p>
              </div>
              <div style={{
                background: apt.color,
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Upcoming
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <Calendar size={18} color={apt.color} />
              <p style={{ fontSize: '16px', color: colors.text, margin: 0, fontWeight: '600' }}>
                {apt.date}
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <Clock size={18} color={apt.color} />
              <p style={{ fontSize: '16px', color: colors.text, margin: 0 }}>
                {apt.time}
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <MapPin size={18} color={apt.color} />
              <p style={{ fontSize: '16px', color: colors.text, margin: 0 }}>
                {apt.location}
              </p>
            </div>
          </div>
        </AnimatedCard>
      ))}

      <AnimatedCard 
        gradient="linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)" 
        onClick={() => alert('Add appointment feature coming soon!')} 
        style={{ marginTop: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Plus size={28} color="white" />
          <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
            Add New Appointment
          </span>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AppointmentsScreen;
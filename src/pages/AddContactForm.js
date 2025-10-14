// AddContactForm.js
import React, { useState } from 'react';
import Modal from './Modals';
import { validateName, validatePhone } from './validation';

const AddContactForm = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const avatars = ['👨‍⚕️', '👨', '👩', '👴', '👵', '👦', '👧'];
  const colors = ['#667eea', '#00b894', '#fd79a8', '#fdcb6e', '#e17055'];

  const handleSubmit = () => {
    const nameValidation = validateName(formData.name);
    const phoneValidation = validatePhone(formData.phone);

    if (!nameValidation.valid || !phoneValidation.valid || !formData.relation) {
      setErrors({
        name: nameValidation.error,
        phone: phoneValidation.error,
        relation: formData.relation ? '' : 'Relation is required'
      });
      return;
    }

    const newContact = {
      ...formData,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    onAdd(newContact);
    setFormData({ name: '', relation: '', phone: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Emergency Contact">
      <div>
        <label style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
          Contact Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., John Doe"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            border: `2px solid ${errors.name ? '#FF6B6B' : '#E8E8E8'}`,
            borderRadius: '12px',
            marginBottom: '4px',
            boxSizing: 'border-box'
          }}
        />
        {errors.name && <p style={{ color: '#FF6B6B', fontSize: '14px', margin: '0 0 12px 0' }}>{errors.name}</p>}

        <label style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '8px', marginTop: '12px' }}>
          Relation
        </label>
        <input
          type="text"
          value={formData.relation}
          onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
          placeholder="e.g., Son, Daughter, Doctor"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            border: `2px solid ${errors.relation ? '#FF6B6B' : '#E8E8E8'}`,
            borderRadius: '12px',
            marginBottom: '4px',
            boxSizing: 'border-box'
          }}
        />
        {errors.relation && <p style={{ color: '#FF6B6B', fontSize: '14px', margin: '0 0 12px 0' }}>{errors.relation}</p>}

        <label style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '8px', marginTop: '12px' }}>
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setFormData({ ...formData, phone: value });
          }}
          placeholder="Enter 10-digit number"
          maxLength="10"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            border: `2px solid ${errors.phone ? '#FF6B6B' : '#E8E8E8'}`,
            borderRadius: '12px',
            marginBottom: '4px',
            boxSizing: 'border-box'
          }}
        />
        {errors.phone && <p style={{ color: '#FF6B6B', fontSize: '14px', margin: '0 0 12px 0' }}>{errors.phone}</p>}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '12px'
          }}
        >
          Add Contact
        </button>
      </div>
    </Modal>
  );
};

export default AddContactForm;
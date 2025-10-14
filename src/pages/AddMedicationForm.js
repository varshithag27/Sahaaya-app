// AddMedicationForm.js
import React, { useState } from 'react';
import Modal from './Modals';
import { validateName, validateTime } from './validation';


const AddMedicationForm = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '',
    frequency: 'Daily'
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const nameValidation = validateName(formData.name);
    const timeValidation = validateTime(formData.time);

    if (!nameValidation.valid || !timeValidation.valid || !formData.dosage) {
      setErrors({
        name: nameValidation.error,
        time: timeValidation.error,
        dosage: formData.dosage ? '' : 'Dosage is required'
      });
      return;
    }

    onAdd(formData);
    setFormData({ name: '', dosage: '', time: '', frequency: 'Daily' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Medication">
      <div>
        <label style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
          Medicine Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Aspirin"
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
          Dosage
        </label>
        <input
          type="text"
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          placeholder="e.g., 100mg"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            border: `2px solid ${errors.dosage ? '#FF6B6B' : '#E8E8E8'}`,
            borderRadius: '12px',
            marginBottom: '4px',
            boxSizing: 'border-box'
          }}
        />
        {errors.dosage && <p style={{ color: '#FF6B6B', fontSize: '14px', margin: '0 0 12px 0' }}>{errors.dosage}</p>}

        <label style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '8px', marginTop: '12px' }}>
          Time
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            border: `2px solid ${errors.time ? '#FF6B6B' : '#E8E8E8'}`,
            borderRadius: '12px',
            marginBottom: '4px',
            boxSizing: 'border-box'
          }}
        />
        {errors.time && <p style={{ color: '#FF6B6B', fontSize: '14px', margin: '0 0 12px 0' }}>{errors.time}</p>}

        <label style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '8px', marginTop: '12px' }}>
          Frequency
        </label>
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            border: '2px solid #E8E8E8',
            borderRadius: '12px',
            marginBottom: '24px',
            boxSizing: 'border-box'
          }}
        >
          <option value="Daily">Daily</option>
          <option value="Twice Daily">Twice Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="As Needed">As Needed</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add Medication
        </button>
      </div>
    </Modal>
  );
};

export default AddMedicationForm;
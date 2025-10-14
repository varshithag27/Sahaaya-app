// validation.js
export const validatePhone = (value) => {
  if (value.length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }
  if (!/^\d{10}$/.test(value)) {
    return { valid: false, error: 'Please enter a valid 10-digit phone number' };
  }
  return { valid: true, error: '' };
};

export const validateOTP = (value) => {
  if (value.length === 0) {
    return { valid: false, error: 'OTP is required' };
  }
  if (!/^\d{6}$/.test(value)) {
    return { valid: false, error: 'Please enter a valid 6-digit OTP' };
  }
  return { valid: true, error: '' };
};

export const validateName = (value) => {
  if (value.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (value.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  return { valid: true, error: '' };
};

export const validateTime = (value) => {
  if (!value) {
    return { valid: false, error: 'Time is required' };
  }
  return { valid: true, error: '' };
};
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../pages/firebaseConfig';

class AuthService {
  constructor() {
    this.confirmationResult = null;
    this.recaptchaVerifier = null;
  }

  // Initialize reCAPTCHA
  initializeRecaptcha(containerId) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.recaptchaVerifier = null;
        }
      });
    }
    return this.recaptchaVerifier;
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber) {
    try {
      // Format phone number with country code
      const formattedPhone = `+91${phoneNumber}`;
      
      // Initialize reCAPTCHA if not already done
      const recaptcha = this.initializeRecaptcha('recaptcha-container');
      
      // Send OTP
      this.confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        recaptcha
      );
      
      console.log('OTP sent successfully');
      return { success: true, message: 'OTP sent successfully' };
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Handle specific errors
      let errorMessage = 'Failed to send OTP';
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 'auth/quota-exceeded':
          errorMessage = 'SMS quota exceeded';
          break;
        default:
          errorMessage = error.message || 'Failed to send OTP';
      }
      
      return { success: false, message: errorMessage };
    }
  }

  // Verify OTP
  async verifyOTP(otpCode) {
    try {
      if (!this.confirmationResult) {
        throw new Error('No OTP request found. Please request OTP first.');
      }

      // Confirm the OTP
      const result = await this.confirmationResult.confirm(otpCode);
      
      // User is signed in
      const user = result.user;
      
      console.log('OTP verified successfully');
      return { 
        success: true, 
        message: 'Login successful',
        user: {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName || 'User'
        }
      };
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      let errorMessage = 'Invalid OTP';
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = 'Invalid OTP. Please check and try again';
          break;
        case 'auth/code-expired':
          errorMessage = 'OTP has expired. Please request a new one';
          break;
        default:
          errorMessage = error.message || 'Invalid OTP';
      }
      
      return { success: false, message: errorMessage };
    }
  }

  // Resend OTP
  async resendOTP(phoneNumber) {
    this.confirmationResult = null;
    return await this.sendOTP(phoneNumber);
  }

  // Sign out
  async signOut() {
    try {
      await auth.signOut();
      this.confirmationResult = null;
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, message: 'Failed to logout' };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
}

const authService = new AuthService();
export default authService;
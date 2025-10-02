import { useState } from 'react';
import Modal from '../shared/Modal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  const handleClose = () => {
    setMode('login'); // Reset to login when closing
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
      size="md"
    >
      {mode === 'login' ? (
        <LoginForm onSwitchToSignup={() => setMode('signup')} onClose={handleClose} />
      ) : (
        <SignupForm onSwitchToLogin={() => setMode('login')} onClose={handleClose} />
      )}
    </Modal>
  );
};

export default AuthModal;

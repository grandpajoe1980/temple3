import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Input from '../shared/Input';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';

const LoginForm = ({ onSwitchToSignup, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      showSuccess('Login successful!');
      onClose();
    } else {
      showError(result.error || 'Login failed. Please try again.');
      setErrors({ form: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        error={errors.email}
        required
        disabled={loading}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        error={errors.password}
        required
        disabled={loading}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 rounded" />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading}
      >
        {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
      </Button>

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;

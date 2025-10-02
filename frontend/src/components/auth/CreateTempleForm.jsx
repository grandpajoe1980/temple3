import { useState } from 'react';
import { tenantService } from '../../services/tenant';
import { useNotification } from '../../contexts/NotificationContext';
import Input from '../shared/Input';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';

const CreateTempleForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    contactEmail: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate subdomain from name if subdomain is empty
    if (name === 'name' && !formData.subdomain) {
      const subdomain = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, name: value, subdomain }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Temple name is required';
    }
    
    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = 'Subdomain must be at least 3 characters';
    }
    
    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await tenantService.create(formData);
      showSuccess(`Temple "${formData.name}" created successfully!`);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create temple. Please try again.';
      showError(errorMessage);
      setErrors({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Create your own temple community! You'll be set as the administrator and can invite members after creation.
        </p>
      </div>

      <Input
        label="Temple Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="First Baptist Church"
        error={errors.name}
        required
        disabled={loading}
      />

      <Input
        label="Subdomain"
        type="text"
        name="subdomain"
        value={formData.subdomain}
        onChange={handleChange}
        placeholder="first-baptist"
        error={errors.subdomain}
        required
        disabled={loading}
      />
      <p className="text-xs text-gray-500 -mt-2">
        Your temple will be accessible at: {formData.subdomain || 'your-temple'}.temple3.app
      </p>

      <Input
        label="Contact Email"
        type="email"
        name="contactEmail"
        value={formData.contactEmail}
        onChange={handleChange}
        placeholder="admin@firstbaptist.org"
        error={errors.contactEmail}
        required
        disabled={loading}
      />

      <Input
        label="Phone Number (Optional)"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+1 (555) 123-4567"
        error={errors.phone}
        disabled={loading}
      />

      <Input
        label="Address (Optional)"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="123 Main St, City, State 12345"
        error={errors.address}
        disabled={loading}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1"
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Create Temple'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTempleForm;

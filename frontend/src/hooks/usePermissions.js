import { useAuth } from '../contexts/AuthContext';
import { hasPermission, canModify, isAdmin, isClergy } from '../utils/permissions';

const usePermissions = () => {
  const { user } = useAuth();

  return {
    hasPermission: (permission) => hasPermission(user, permission),
    canModify: (resource) => canModify(user, resource),
    isAdmin: () => isAdmin(user),
    isClergy: () => isClergy(user),
    user
  };
};

export default usePermissions;

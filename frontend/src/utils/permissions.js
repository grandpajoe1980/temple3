import { PERMISSIONS, USER_ROLES } from './constants';

/**
 * Check if user has a specific permission
 * @param {Object} user - User object with permissions array
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  if (user.role === USER_ROLES.ADMIN) return true;
  if (!user.permissions) return false;
  return user.permissions.includes(PERMISSIONS.ALL) || user.permissions.includes(permission);
};

/**
 * Check if user can modify a resource
 * @param {Object} user - User object
 * @param {string} resource - Resource type (e.g., 'posts', 'events')
 * @returns {boolean}
 */
export const canModify = (user, resource) => {
  if (!user) return false;
  return hasPermission(user, `modify_${resource}`) || hasPermission(user, PERMISSIONS.ALL);
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === 'admin';
};

/**
 * Check if user is clergy
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isClergy = (user) => {
  return user?.role === 'clergy';
};

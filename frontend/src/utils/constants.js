// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CLERGY: 'clergy',
  MEMBER: 'member',
  GUEST: 'guest'
};

// Permission Types
export const PERMISSIONS = {
  VIEW_POSTS: 'view_posts',
  CREATE_POSTS: 'create_posts',
  EDIT_POSTS: 'edit_posts',
  DELETE_POSTS: 'delete_posts',
  VIEW_EVENTS: 'view_events',
  CREATE_EVENTS: 'create_events',
  EDIT_EVENTS: 'edit_events',
  DELETE_EVENTS: 'delete_events',
  VIEW_MESSAGES: 'view_messages',
  SEND_MESSAGES: 'send_messages',
  VIEW_TEXTS: 'view_texts',
  MANAGE_TEXTS: 'manage_texts',
  VIEW_MEDIA: 'view_media',
  UPLOAD_MEDIA: 'upload_media',
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  ALL: 'all'
};

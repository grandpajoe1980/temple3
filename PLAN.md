# Temple3 Frontend Development Plan

## Project Overview
Creating a modern, responsive React frontend with Tailwind CSS and Headless UI for the Temple3 multi-tenant spiritual community platform. The frontend will run on port 3001 and consume the existing Node.js API on port 3000.

## Technology Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Routing**: React Router v6
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone
- **Date/Time**: date-fns
- **Rich Text**: TinyMCE or similar for post editing

## Design Requirements
- **Landing Page**: Google-like, neutral, mostly white with logo/image
- **Navigation**: Horizontal tabs at top that stay visible with smooth scrolling
- **Layout**: Single seamless page with instant section jumping
- **Features**: Cards-based UI with granular permission system
- **Roles**: Admin, Clergy, Member with customizable permissions
- **Content**: Posts (latest + breakout), Religious Texts (separate), Messages (group/direct)
- **Donations**: Venmo/Zelle links initially, Stripe integration later
- **Bells**: Mindfulness bells with user-adjustable timing
- **Media**: Upload support for podcasts, talks, videos, YouTube embedding
- **Moderation**: Optional content approval workflows

## Project Structure
```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── temple-logo.svg
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── TempleSearch.jsx
│   │   │   └── CreateTempleButton.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── CreateTempleForm.jsx
│   │   │   └── AuthModal.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── QuickStats.jsx
│   │   │   └── RecentActivity.jsx
│   │   ├── features/
│   │   │   ├── calendar/
│   │   │   │   ├── Calendar.jsx
│   │   │   │   ├── EventCard.jsx
│   │   │   │   ├── CreateEvent.jsx
│   │   │   │   ├── EventDetails.jsx
│   │   │   │   └── RSVPButton.jsx
│   │   │   ├── posts/
│   │   │   │   ├── PostFeed.jsx
│   │   │   │   ├── PostCard.jsx
│   │   │   │   ├── CreatePost.jsx
│   │   │   │   ├── PostComments.jsx
│   │   │   │   └── PostModerationQueue.jsx
│   │   │   ├── messages/
│   │   │   │   ├── MessageCenter.jsx
│   │   │   │   ├── ChatList.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── GroupChat.jsx
│   │   │   │   └── DirectMessage.jsx
│   │   │   ├── media/
│   │   │   │   ├── PodcastLibrary.jsx
│   │   │   │   ├── VideoLibrary.jsx
│   │   │   │   ├── MediaPlayer.jsx
│   │   │   │   ├── MediaUpload.jsx
│   │   │   │   └── YouTubeEmbed.jsx
│   │   │   ├── texts/
│   │   │   │   ├── ReligiousTexts.jsx
│   │   │   │   ├── TextLibrary.jsx
│   │   │   │   ├── TextReader.jsx
│   │   │   │   ├── TextSearch.jsx
│   │   │   │   └── CreateText.jsx
│   │   │   ├── donations/
│   │   │   │   ├── DonationPage.jsx
│   │   │   │   ├── PaymentLinks.jsx
│   │   │   │   ├── DonationGoals.jsx
│   │   │   │   └── DonationHistory.jsx
│   │   │   └── bells/
│   │   │       ├── ReminderBells.jsx
│   │   │       ├── BellScheduler.jsx
│   │   │       ├── BellNotification.jsx
│   │   │       └── MindfulnessTimer.jsx
│   │   ├── admin/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── RoleManager.jsx
│   │   │   ├── PermissionEditor.jsx
│   │   │   ├── ModerationSettings.jsx
│   │   │   ├── FeatureToggle.jsx
│   │   │   ├── TenantSettings.jsx
│   │   │   └── AnalyticsDashboard.jsx
│   │   ├── shared/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   └── RichTextEditor.jsx
│   │   └── notifications/
│   │       ├── NotificationCenter.jsx
│   │       ├── NotificationItem.jsx
│   │       ├── NotificationSettings.jsx
│   │       └── PushNotifications.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── TenantContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTenant.js
│   │   ├── useAPI.js
│   │   ├── useNotifications.js
│   │   ├── usePermissions.js
│   │   ├── useLocalStorage.js
│   │   └── useBells.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── tenant.js
│   │   ├── posts.js
│   │   ├── calendar.js
│   │   ├── messages.js
│   │   ├── media.js
│   │   ├── texts.js
│   │   ├── donations.js
│   │   ├── bells.js
│   │   └── upload.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── dateUtils.js
│   │   ├── validators.js
│   │   ├── permissions.js
│   │   └── storage.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Development Phases

### Phase 1: Foundation Setup ✅ COMPLETE
**Status**: Complete and Tested
**Timeline**: Week 1 - Completed October 2, 2025

#### 1.1 Project Initialization
- [x] Create React app with Vite
- [x] Install and configure Tailwind CSS
- [x] Install Headless UI, Heroicons
- [x] Set up ESLint, Prettier
- [x] Configure Vite for development

#### 1.2 Basic API Integration
- [x] Create Axios instance with interceptors
- [x] Set up environment variables
- [x] Create base API service functions
- [x] Test connection to backend API

#### 1.3 Context Providers
- [x] AuthContext (login state, user data, token management)
- [x] TenantContext (current tenant, tenant switching)
- [x] NotificationContext (toast notifications, bell alerts)
- [x] ThemeContext (future: tenant customization)

#### 1.4 Basic Components
- [x] Layout structure (Header, Main, Footer)
- [x] Shared components (Button, Input, Modal, LoadingSpinner)
- [x] Error boundary for crash handling

### Phase 2: Landing Page & Authentication ✅ COMPLETE
**Status**: Complete
**Timeline**: Week 1-2 - Completed October 2, 2025

#### 2.1 Landing Page
- [x] Clean, Google-like design with logo
- [x] Temple search with real-time suggestions
- [x] "Create Your Temple" call-to-action
- [x] Responsive design for mobile/tablet

#### 2.2 Authentication Flow
- [x] Login modal with email/password
- [x] Signup modal with tenant selection
- [x] Create Temple form (embedded in signup)
- [x] JWT token storage and refresh (implemented in AuthContext)
- [x] Protected route wrapper
- [x] React Router v6 integration
- [x] Tenant identification and context setting
- [x] Auto-redirect to dashboard when authenticated

#### 2.3 Temple Search Functionality
- [x] API integration for tenant search
- [x] Autocomplete dropdown
- [x] Search by name, location, denomination
- [ ] Recently visited temples (future enhancement)

### Phase 3: Core Dashboard & Navigation ✅ COMPLETE
**Status**: Complete
**Timeline**: Week 2-3 - Completed October 2, 2025

#### 3.1 Main Layout
- [x] Sticky header with temple logo/name
- [x] Horizontal navigation tabs (Calendar, Posts, etc.)
- [x] Smooth navigation between sections
- [x] User avatar/menu in header with dropdown
- [x] Notification bell with badge counter
- [x] Layout wrapper with Outlet for nested routes

#### 3.2 Dashboard Overview
- [x] Feature cards showing quick stats
- [x] Recent activity feed with timestamps
- [x] Upcoming events preview (placeholder)
- [x] Latest posts summary (placeholder)
- [x] Quick action buttons via feature cards
- [x] Welcome message with user name
- [x] Gradient hero section

#### 3.3 Permission System
- [x] Role-based component rendering
- [x] Permission checking hooks (usePermissions)
- [x] Feature toggle based on user roles
- [x] Graceful degradation for restricted features
- [x] Feature cards hidden when no permission

#### 3.4 Feature Pages (Placeholders)
- [x] Calendar page placeholder
- [x] Posts page placeholder
- [x] Religious Texts page placeholder
- [x] Messages page placeholder
- [x] Media Library page placeholder
- [x] Donations page placeholder

### Phase 4: Core Features
**Status**: Not Started
**Timeline**: Week 3-5

#### 4.1 Calendar Events
- [ ] Monthly calendar view
- [ ] Event cards with details
- [ ] Create/edit event forms
- [ ] RSVP functionality
- [ ] Recurring event support
- [ ] Event categories and filtering

#### 4.2 Posts & Social Feed
- [ ] Combined post feed (staff + layperson)
- [ ] Create post with rich text editor
- [ ] Image upload for posts
- [ ] Comment system
- [ ] Like/reaction system
- [ ] Post moderation queue (admin)

#### 4.3 Religious Texts
- [ ] Text library with categories
- [ ] Search and filtering
- [ ] Reading interface with adjustable text size
- [ ] Bookmarking system
- [ ] Create/edit texts (authorized users)

#### 4.4 Messaging System
- [ ] Message center with chat list
- [ ] Direct message conversations
- [ ] Group chat functionality
- [ ] Message status (read/unread)
- [ ] Real-time message updates (polling for now)

### Phase 5: Media & Advanced Features
**Status**: Not Started
**Timeline**: Week 5-6

#### 5.1 Podcast Library
- [ ] Podcast episode list
- [ ] Audio player with controls
- [ ] Episode descriptions and show notes
- [ ] Upload podcast interface
- [ ] Series/season organization

#### 5.2 Video Library
- [ ] Video gallery with thumbnails
- [ ] Video player
- [ ] YouTube video embedding
- [ ] Video upload interface
- [ ] Video categories and tags

#### 5.3 Donation System
- [ ] Donation page with goals
- [ ] Venmo/Zelle link integration
- [ ] Donation history (for logged-in users)
- [ ] Progress tracking for campaigns
- [ ] Thank you messages

#### 5.4 Reminder Bells
- [ ] Personal bell scheduler
- [ ] Time and day selection
- [ ] Browser notification permissions
- [ ] Bell sound options
- [ ] Mindfulness timer integration

### Phase 6: Admin Panel
**Status**: Not Started
**Timeline**: Week 6-7

#### 6.1 User Management
- [ ] User list with roles
- [ ] Add/edit/deactivate users
- [ ] Bulk role assignment
- [ ] User activity tracking

#### 6.2 Role & Permission Management
- [ ] Create custom roles
- [ ] Granular permission editor
- [ ] Preset role templates (Admin, Clergy, Member)
- [ ] Permission testing interface

#### 6.3 Content Moderation
- [ ] Post approval queue
- [ ] Content flagging system
- [ ] Moderation settings toggle
- [ ] Automated content filters

#### 6.4 Temple Settings
- [ ] Temple profile editing
- [ ] Feature enable/disable toggles
- [ ] Navigation reordering
- [ ] Branding customization (future)

### Phase 7: Polish & Optimization
**Status**: Not Started
**Timeline**: Week 7-8

#### 7.1 Notifications
- [ ] In-app notification center
- [ ] Push notification setup
- [ ] Notification preferences
- [ ] Real-time notification badges

#### 7.2 File Upload System
- [ ] Drag-and-drop file upload
- [ ] Image preview and cropping
- [ ] File type validation
- [ ] Progress indicators
- [ ] Error handling

#### 7.3 Mobile Optimization
- [ ] Touch-friendly interface
- [ ] Mobile navigation patterns
- [ ] Responsive image handling
- [ ] PWA capabilities

#### 7.4 Performance & UX
- [ ] Loading states for all actions
- [ ] Error handling and user feedback
- [ ] Offline capability (basic)
- [ ] Accessibility improvements
- [ ] SEO optimization

## Technical Implementation Guidelines

### API Integration
```javascript
// Base API configuration
const API_BASE_URL = 'http://localhost:3000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add tenant and auth headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const tenant = localStorage.getItem('currentTenant');
  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (tenant) config.headers['X-Tenant-Subdomain'] = tenant;
  
  return config;
});
```

### Permission System
```javascript
// Permission checking hook
const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || user?.permissions?.includes('all');
  };
  
  const canModify = (resource) => {
    return hasPermission(`modify_${resource}`) || hasPermission('admin');
  };
  
  return { hasPermission, canModify };
};
```

### Design System

#### Color Palette
```css
/* Primary colors - spiritual/calming */
--primary-50: #f0f9ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Neutral colors - clean white base */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;

/* Accent colors */
--green-500: #10b981; /* Success/donations */
--amber-500: #f59e0b; /* Notifications/bells */
--red-500: #ef4444;   /* Errors/urgent */
```

#### Typography
- Headings: Inter or system fonts
- Body: Inter or system fonts
- Readable font sizes (16px base minimum)

#### Component Patterns
- Cards with subtle shadows
- Rounded corners (6-8px)
- Consistent spacing scale (4, 8, 12, 16, 24, 32px)
- Hover states for interactive elements
- Focus states for accessibility

## Development Rules

### Code Quality
1. **Always** use TypeScript for new components when possible
2. **Always** implement proper error boundaries
3. **Always** add loading states for async operations
4. **Always** validate props with PropTypes or TypeScript
5. **Always** make components accessible (ARIA labels, keyboard navigation)

### State Management
1. Use Context for global state (auth, tenant, notifications)
2. Use local state for component-specific data
3. Use custom hooks for reusable logic
4. Avoid prop drilling - use context when needed

### Performance
1. Lazy load route components
2. Optimize images with proper formats and sizes
3. Implement virtual scrolling for long lists
4. Use React.memo for expensive components
5. Debounce search inputs

### API Integration
1. Always handle loading and error states
2. Use consistent error messages
3. Implement retry logic for failed requests
4. Cache data when appropriate
5. Use optimistic updates for better UX

## Progress Tracking

### Current Status
- **Overall Progress**: Phase 1 ✅, Phase 2 ✅, Phase 3 ✅ Complete
- **Current Phase**: Phase 3 Complete - Ready for Phase 4 (Core Features)
- **Next Milestone**: Implement Calendar, Posts, and Religious Texts features
- **Blockers**: None
- **Last Updated**: October 2, 2025 (Evening)

### Completed Items
**Phase 1 - Foundation:**
- [x] React app initialization with Vite
- [x] Tailwind CSS configuration
- [x] Headless UI and Heroicons installation
- [x] Vite configuration (port 3001, API proxy)
- [x] Environment variables setup
- [x] Axios instance with interceptors
- [x] Auth service (login, register, logout)
- [x] Tenant service (multi-tenant support)
- [x] AuthContext with hooks
- [x] TenantContext with hooks
- [x] NotificationContext with react-hot-toast
- [x] ThemeContext for customization
- [x] Shared components (Button, Input, Modal, LoadingSpinner)
- [x] ErrorBoundary for crash handling
- [x] Layout components (Header, Footer, Layout)
- [x] Permission utilities and hooks
- [x] Backend API connection tested and verified

**Phase 2 - Authentication & Landing:**
- [x] Modern landing page with gradient design
- [x] Feature showcase section
- [x] Temple search component with autocomplete
- [x] Login form with validation
- [x] Signup form with validation
- [x] Create Temple form
- [x] Authentication modals
- [x] Header with auth integration
- [x] React Router v6 implementation
- [x] Protected route wrapper
- [x] Auto-redirect to dashboard when authenticated

**Phase 3 - Dashboard & Navigation:**
- [x] Dashboard component with feature cards
- [x] QuickStats component (upcoming events, messages, members, reminders)
- [x] RecentActivity feed component
- [x] FeatureCard component with permission-based rendering
- [x] Updated Header with navigation tabs
- [x] User avatar/menu dropdown
- [x] Notification bell with badge counter
- [x] Sticky header implementation
- [x] Layout wrapper with nested routes
- [x] Permission system integration
- [x] Feature page placeholders (Calendar, Posts, Texts, Messages, Media, Donations)
- [x] Routing structure complete

### In Progress
- [x] Phase 4: Core Features (Calendar, Posts, Religious Texts, Messages) — tenant-scoped experiences live with backend integration
- [ ] Phase 4: Media & Donations feature work

### Next Actions
1. Conduct QA across calendar, posts, texts, and messaging against seeded backend data and refine analytics hooks
2. Begin media library implementation (podcasts, videos, uploads)
3. Design and build donation flows (links + goal tracking)
4. Layer moderation and notification rules onto new content streams
5. Expand automated testing coverage for critical tenant workflows

## Notes and Decisions

### Architecture Decisions
- **Frontend Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React Context for global state, hooks for local state
- **API Client**: Axios with interceptors for auth and tenant headers
- **Routing**: React Router v6 for client-side routing

### Design Decisions
- **Layout**: Single-page application with smooth scrolling sections
- **Navigation**: Horizontal tabs that remain sticky at top
- **Permissions**: Hide features for unauthorized users rather than disable
- **Content**: Card-based UI for better visual organization
- **Mobile**: Mobile-first responsive design approach

### Business Decisions
- **Donations**: Start with Venmo/Zelle, add Stripe integration later
- **Media**: Support both uploads and YouTube embedding
- **Moderation**: Optional content approval workflows
- **Bells**: Browser-based notifications for mindfulness reminders

---

**Remember**: This plan is a living document. Update progress, add notes, and modify requirements as development progresses. Always refer back to this plan before starting new features or making architectural decisions.
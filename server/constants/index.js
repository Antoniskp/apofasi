/**
 * Application constants
 * Centralized configuration values used throughout the application
 */

export const USER_ROLES = {
  USER: 'user',
  REPORTER: 'reporter',
  ADMIN: 'admin'
};

export const ALLOWED_ROLES = Object.values(USER_ROLES);

export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google',
  FACEBOOK: 'facebook'
};

export const ALLOWED_PROVIDERS = Object.values(AUTH_PROVIDERS);

export const IMAGE_FORMATS = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp'
};

export const VALIDATION_LIMITS = {
  PASSWORD_MIN_LENGTH: 8,
  MESSAGE_MIN_LENGTH: 10,
  AVATAR_MAX_BYTES: 320 * 1024, // 320KB
  JSON_BODY_LIMIT: '1mb',
  MIN_POLL_OPTIONS: 2,
  MAX_POLL_TAGS: 10,
  NEWS_LIST_LIMIT: 50,
  POLLS_LIST_LIMIT: 100,
  USERS_LIST_LIMIT: 200
};

export const SESSION_DEFAULTS = {
  NAME: 'apofasi.sid',
  SECRET: 'apofasi-session-secret',
  MAX_AGE_DAYS: 7,
  TOUCH_AFTER_SECONDS: 24 * 3600
};

export const NETWORK = {
  DEFAULT_PORT: 5000,
  DEFAULT_HOST: '127.0.0.1',
  DEFAULT_CLIENT_ORIGIN: 'http://localhost:5173'
};

export const CONTACT_TOPICS = {
  GENERAL: 'general',
  SUPPORT: 'support',
  FEEDBACK: 'feedback',
  REPORT: 'report'
};

export const ERROR_MESSAGES = {
  // Authentication
  AUTH_REQUIRED: 'Απαιτείται σύνδεση.',
  INSUFFICIENT_PERMISSIONS: 'Δεν έχετε δικαιώματα για αυτή την ενέργεια.',
  INVALID_CREDENTIALS: 'Λανθασμένα στοιχεία σύνδεσης.',
  SESSION_CREATE_FAILED: 'Η δημιουργία συνεδρίας απέτυχε.',
  
  // Registration
  EMAIL_PASSWORD_REQUIRED: 'Απαιτούνται email και κωδικός.',
  INVALID_EMAIL: 'Μη έγκυρο email.',
  PASSWORD_TOO_SHORT: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.',
  EMAIL_IN_USE: 'Το email χρησιμοποιείται ήδη.',
  USERNAME_IN_USE: 'Το username χρησιμοποιείται ήδη.',
  
  // News
  NEWS_TITLE_CONTENT_REQUIRED: 'Απαιτούνται τίτλος και περιεχόμενο.',
  NEWS_FETCH_FAILED: 'Δεν ήταν δυνατή η ανάκτηση ειδήσεων.',
  NEWS_CREATE_FAILED: 'Δεν ήταν δυνατή η προσθήκη της είδησης.',
  
  // Polls
  POLL_QUESTION_OPTIONS_REQUIRED: 'Χρειάζονται ερώτηση και τουλάχιστον δύο μοναδικές επιλογές.',
  POLL_OPTIONS_MUST_BE_UNIQUE: 'Οι επιλογές πρέπει να είναι διαφορετικές μεταξύ τους.',
  POLL_FETCH_FAILED: 'Δεν ήταν δυνατή η ανάκτηση ψηφοφοριών.',
  POLL_NOT_FOUND: 'Η ψηφοφορία δεν βρέθηκε.',
  POLL_CREATE_FAILED: 'Δεν ήταν δυνατή η δημιουργία ψηφοφορίας.',
  POLL_INVALID_ID: 'Μη έγκυρη ψηφοφορία.',
  POLL_OPTION_REQUIRED: 'Επιλέξτε μία από τις διαθέσιμες απαντήσεις.',
  POLL_ALREADY_VOTED: 'Έχετε ήδη ψηφίσει σε αυτή την ψηφοφορία.',
  POLL_ALREADY_VOTED_ANONYMOUS: 'Έχετε ήδη ψηφίσει ανώνυμα σε αυτή την ψηφοφορία.',
  POLL_INVALID_OPTION: 'Μη έγκυρη επιλογή ψηφοφορίας.',
  POLL_VOTE_FAILED: 'Δεν ήταν δυνατή η καταχώρηση της ψήφου.',
  POLL_AUTH_REQUIRED: 'Χρειάζεται σύνδεση για να ψηφίσετε.',
  
  // Location
  INVALID_REGION: 'Η περιφέρεια δεν είναι διαθέσιμη.',
  REGION_REQUIRED_FOR_CITY: 'Επιλέξτε πρώτα περιφέρεια για να προσθέσετε πόλη ή χωριό.',
  CITY_NOT_IN_REGION: 'Η πόλη ή το χωριό δεν ανήκει στην επιλεγμένη περιφέρεια.',
  
  // Users
  INVALID_USER_ID: 'Μη έγκυρο αναγνωριστικό χρήστη.',
  INVALID_ROLE: 'Μη έγκυρος ρόλος.',
  USER_NOT_FOUND: 'Ο χρήστης δεν βρέθηκε.',
  USERS_FETCH_FAILED: 'Δεν ήταν δυνατή η ανάκτηση χρηστών.',
  USER_ROLE_UPDATE_FAILED: 'Δεν ήταν δυνατή η ενημέρωση του ρόλου.',
  
  // Profile
  PROFILE_UPDATE_FAILED: 'Δεν ήταν δυνατή η ενημέρωση του προφίλ.',
  AVATAR_INVALID_FORMAT: 'Η φωτογραφία πρέπει να είναι JPG, PNG ή WebP.',
  AVATAR_TOO_LARGE: 'Η φωτογραφία προφίλ είναι πολύ μεγάλη.',
  AVATAR_INVALID: 'Η φωτογραφία προφίλ δεν είναι έγκυρη.',
  
  // Contact
  MESSAGE_TOO_SHORT: 'Παρακαλώ γράψτε ένα μήνυμα με τουλάχιστον 10 χαρακτήρες.',
  VALID_EMAIL_REQUIRED: 'Απαιτείται έγκυρο email επικοινωνίας.',
  CONTACT_MESSAGE_FAILED: 'Δεν ήταν δυνατή η αποστολή του μηνύματος.',
  
  // OAuth
  PROVIDER_NOT_CONFIGURED: 'δεν είναι διαμορφωμένο ακόμα.',
  
  // Generic
  SOMETHING_WENT_WRONG: 'Κάτι πήγε στραβά. Προσπαθήστε ξανά.',
  CORS_NOT_ALLOWED: 'Not allowed by CORS'
};

export const SUCCESS_MESSAGES = {
  CONTACT_MESSAGE_SENT: 'Το μήνυμα καταχωρήθηκε με επιτυχία.',
  LOGGED_OUT: 'Logged out'
};

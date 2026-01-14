/**
 * Validation utilities for poll enhancements
 */

// Image upload constraints
export const MAX_PHOTO_FILE_BYTES = 4 * 1024 * 1024; // 4MB file size limit
export const MAX_PHOTO_BYTES = 320 * 1024; // 320KB after processing
export const MAX_PHOTO_DIMENSION = 360; // 360x360 max
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Validates if a URL is HTTPS
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isHttpsUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Validates and sanitizes a domain name
 * @param {string} domain - Domain to validate
 * @returns {{valid: boolean, sanitized?: string, error?: string}}
 */
export const validateDomain = (domain) => {
  if (!domain || typeof domain !== "string") {
    return { valid: false, error: "Μη έγκυρο domain." };
  }

  const trimmed = domain.trim().toLowerCase();
  
  // Basic domain format validation (no protocol, no path, alphanumeric + dots + hyphens)
  const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  
  if (!domainRegex.test(trimmed)) {
    return { valid: false, error: `Μη έγκυρο domain: ${domain}` };
  }

  // Prevent common malicious patterns
  if (trimmed.includes("..") || trimmed.startsWith(".") || trimmed.endsWith(".")) {
    return { valid: false, error: `Μη έγκυρο domain: ${domain}` };
  }

  return { valid: true, sanitized: trimmed };
};

/**
 * Validates link policy configuration
 * @param {object} linkPolicy - Link policy object {mode, allowedDomains}
 * @returns {{valid: boolean, sanitized?: object, error?: string}}
 */
export const validateLinkPolicy = (linkPolicy) => {
  if (!linkPolicy || typeof linkPolicy !== "object") {
    return { valid: true, sanitized: { mode: "any", allowedDomains: [] } };
  }

  const { mode = "any", allowedDomains = [] } = linkPolicy;

  if (!["any", "allowlist"].includes(mode)) {
    return { valid: false, error: "Μη έγκυρη λειτουργία link policy." };
  }

  if (mode === "allowlist") {
    if (!Array.isArray(allowedDomains)) {
      return { valid: false, error: "Τα allowedDomains πρέπει να είναι πίνακας." };
    }

    const sanitizedDomains = [];
    for (const domain of allowedDomains) {
      const validation = validateDomain(domain);
      if (!validation.valid) {
        return validation;
      }
      sanitizedDomains.push(validation.sanitized);
    }

    return {
      valid: true,
      sanitized: {
        mode: "allowlist",
        allowedDomains: sanitizedDomains
      }
    };
  }

  return { valid: true, sanitized: { mode: "any", allowedDomains: [] } };
};

/**
 * Validates a profile URL against poll's link policy
 * @param {string} url - URL to validate
 * @param {object} linkPolicy - Poll's link policy {mode, allowedDomains}
 * @returns {{valid: boolean, error?: string}}
 * 
 * Note: This function should only be called when a URL is provided.
 * The initial null/empty check is defensive programming.
 */
export const validateProfileUrl = (url, linkPolicy = {}) => {
  // Defensive check: this shouldn't be reached in normal flow
  if (!url || typeof url !== "string" || !url.trim()) {
    return { valid: false, error: "Το URL δεν είναι έγκυρο." };
  }

  if (!isHttpsUrl(url)) {
    return { valid: false, error: "Επιτρέπονται μόνο HTTPS URLs." };
  }

  const { mode = "any", allowedDomains = [] } = linkPolicy;

  if (mode === "allowlist" && allowedDomains.length > 0) {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      
      const isAllowed = allowedDomains.some((domain) => {
        const normalizedDomain = domain.toLowerCase();
        return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`);
      });

      if (!isAllowed) {
        return {
          valid: false,
          error: `Το domain δεν επιτρέπεται. Επιτρεπόμενα: ${allowedDomains.join(", ")}`
        };
      }
    } catch {
      return { valid: false, error: "Μη έγκυρο URL." };
    }
  }

  return { valid: true };
};

/**
 * Validates a photo data URL
 * @param {string} dataUrl - Base64 data URL
 * @returns {{valid: boolean, error?: string}}
 * 
 * Note: This function should only be called when a photo is provided.
 * The initial null/empty check is defensive programming.
 */
export const validatePhotoDataUrl = (dataUrl) => {
  // Defensive check: this shouldn't be reached in normal flow
  if (!dataUrl || typeof dataUrl !== "string") {
    return { valid: false, error: "Η φωτογραφία δεν είναι έγκυρη." };
  }

  // Check if it's a data URL
  if (!dataUrl.startsWith("data:image/")) {
    return { valid: false, error: "Μη έγκυρη μορφή εικόνας." };
  }

  // Extract MIME type
  const mimeMatch = dataUrl.match(/^data:(image\/[^;]+);/);
  if (!mimeMatch) {
    return { valid: false, error: "Δεν βρέθηκε τύπος εικόνας." };
  }

  const mimeType = mimeMatch[1];
  if (!ALLOWED_PHOTO_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Μη έγκυρος τύπος εικόνας. Επιτρέπονται: ${ALLOWED_PHOTO_TYPES.join(", ")}`
    };
  }

  // Check size
  const base64 = dataUrl.split(",")[1] || "";
  const sizeBytes = Math.ceil((base64.length * 3) / 4);
  
  if (sizeBytes > MAX_PHOTO_BYTES) {
    return {
      valid: false,
      error: `Η εικόνα είναι πολύ μεγάλη (${Math.round(sizeBytes / 1024)}KB). Μέγιστο: ${MAX_PHOTO_BYTES / 1024}KB`
    };
  }

  return { valid: true };
};

/**
 * Validates a people mode option
 * @param {object} option - Option object to validate
 * @param {object} linkPolicy - Poll's link policy
 * @returns {{valid: boolean, error?: string}}
 */
export const validatePeopleOption = (option, linkPolicy) => {
  if (!option || typeof option !== "object") {
    return { valid: false, error: "Μη έγκυρη επιλογή." };
  }

  const { text, photoUrl, photo, profileUrl } = option;

  // Text is required
  if (!text || typeof text !== "string" || !text.trim()) {
    return { valid: false, error: "Το όνομα είναι υποχρεωτικό." };
  }

  // Photo is now optional: validate photoUrl if provided
  const hasPhotoUrl = photoUrl && typeof photoUrl === "string" && photoUrl.trim();
  const hasPhoto = photo && typeof photo === "string" && photo.trim();

  if (hasPhotoUrl && !isHttpsUrl(photoUrl)) {
    return { valid: false, error: "Το URL φωτογραφίας πρέπει να είναι HTTPS." };
  }

  // Validate photo data URL if provided
  if (hasPhoto) {
    const photoValidation = validatePhotoDataUrl(photo);
    if (!photoValidation.valid) {
      return photoValidation;
    }
  }

  // ProfileUrl is now optional: validate if provided
  if (profileUrl && typeof profileUrl === "string" && profileUrl.trim()) {
    const urlValidation = validateProfileUrl(profileUrl, linkPolicy);
    if (!urlValidation.valid) {
      return urlValidation;
    }
  }

  return { valid: true };
};

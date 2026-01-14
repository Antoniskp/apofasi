/**
 * Image upload and compression utilities
 */

export const MAX_PHOTO_FILE_BYTES = 4 * 1024 * 1024; // 4MB
export const MAX_PHOTO_BYTES = 320 * 1024; // 320KB after compression
export const MAX_PHOTO_DIMENSION = 360; // 360x360 max
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Calculate the size of a base64 data URL in bytes
 * @param {string} dataUrl - Base64 data URL
 * @returns {number} Size in bytes
 */
export const getDataUrlSize = (dataUrl) => {
  if (!dataUrl) return 0;
  const base64 = dataUrl.split(",")[1] || "";
  return Math.ceil((base64.length * 3) / 4);
};

/**
 * Resize and compress an image file to meet size/dimension requirements
 * @param {File} file - Image file to process
 * @param {number} maxDimension - Maximum width or height
 * @param {number} maxBytes - Maximum size in bytes after compression
 * @returns {Promise<string>} Promise resolving to base64 data URL
 */
export const resizeImage = (file, maxDimension = MAX_PHOTO_DIMENSION, maxBytes = MAX_PHOTO_BYTES) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDimension / image.width, maxDimension / image.height);
      const targetWidth = Math.round(image.width * scale);
      const targetHeight = Math.round(image.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Δεν ήταν δυνατή η επεξεργασία της εικόνας."));
        return;
      }

      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      
      // Use binary search for more efficient quality finding
      let minQuality = 0.55;
      let maxQuality = 0.88;
      let dataUrl = canvas.toDataURL("image/jpeg", maxQuality);
      
      // If already small enough at max quality, return it
      if (getDataUrlSize(dataUrl) <= maxBytes) {
        resolve(dataUrl);
        return;
      }

      // Binary search for optimal quality
      while (maxQuality - minQuality > 0.05) {
        const quality = (minQuality + maxQuality) / 2;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        const size = getDataUrlSize(dataUrl);
        
        if (size <= maxBytes) {
          minQuality = quality;
        } else {
          maxQuality = quality;
        }
      }
      
      // Final attempt at minimum quality
      dataUrl = canvas.toDataURL("image/jpeg", minQuality);

      if (getDataUrlSize(dataUrl) > maxBytes) {
        reject(new Error("Η φωτογραφία είναι πολύ μεγάλη μετά τη συμπίεση."));
        return;
      }

      resolve(dataUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Δεν ήταν δυνατή η φόρτωση της εικόνας."));
    };

    image.src = objectUrl;
  });

/**
 * Validate and handle photo file upload
 * @param {File} file - File to validate
 * @returns {Promise<{valid: boolean, error?: string, dataUrl?: string}>}
 */
export const handlePhotoFile = async (file) => {
  if (!file) {
    return { valid: false, error: "Δεν επιλέχθηκε αρχείο." };
  }

  if (file.size > MAX_PHOTO_FILE_BYTES) {
    return { valid: false, error: `Η φωτογραφία είναι πολύ μεγάλη (μέγιστο ${MAX_PHOTO_FILE_BYTES / (1024 * 1024)}MB).` };
  }

  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Μη έγκυρος τύπος εικόνας. Επιτρέπονται: ${ALLOWED_PHOTO_TYPES.map(t => t.split('/')[1]).join(", ")}` 
    };
  }

  try {
    const dataUrl = await resizeImage(file);
    return { valid: true, dataUrl };
  } catch (error) {
    return { valid: false, error: error.message || "Σφάλμα επεξεργασίας φωτογραφίας." };
  }
};

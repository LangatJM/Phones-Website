// Global Store Settings & Centralized Config

export const DEFAULT_CONFIG = {
  storeName: "Simu Rahisi",
  tagline: "Own Your Dream Smartphone Today with Lipa Mdogo Mdogo",
  whatsappNumber: "+254703523393", // Easily updated via Admin Dashboard
  salesPhone: "+254703523393",
  currency: "KSh",
  location: "Tom Mboya Street, Nairobi CBD",
  workingHours: "Mon - Sat: 8:00 AM - 7:00 PM"
};

// Admin panel password (stored as a simple hash for client-side auth)
// Change this value to set a new password
export const ADMIN_PASSWORD = "simurahisi2026";

/**
 * Converts any Google Drive sharing URL into a direct embeddable image URL.
 * Supports:
 *   https://drive.google.com/file/d/FILE_ID/view
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID
 *   https://drive.google.com/uc?export=view&id=FILE_ID
 * Returns the input unchanged if it is not a Drive URL.
 */
export function driveUrlToImage(url) {
  if (!url || !url.includes('drive.google.com')) return url;

  // Extract file ID from /file/d/ID/ pattern
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }

  // Extract file ID from ?id=ID or &id=ID pattern
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return url; // Return original if no pattern matched
}

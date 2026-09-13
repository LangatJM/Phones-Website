// Contextual WhatsApp URL & Message Helper

/**
 * Builds a direct wa.me link with encoded contextual prefilled text
 * @param {string} phoneNumber - Target WhatsApp phone number
 * @param {Object} phoneItem - Optional selected phone details
 * @param {string} mode - 'INQUIRY' | 'BUY' | 'GENERAL'
 */
export function buildWhatsAppLink(phoneNumber, phoneItem = null, mode = 'INQUIRY') {
  // Strip spaces, dashes, plus sign for clean international format
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  let message = "";

  if (phoneItem) {
    if (mode === 'BUY' || mode === 'INQUIRY') {
      message = `Hello! I am interested in getting the *${phoneItem.name}* (${phoneItem.ram} / ${phoneItem.storage}).\n\n` +
        `• Lipa Mdogo Deposit: KSh ${phoneItem.deposit.toLocaleString()}\n` +
        `• Daily Payment: KSh ${phoneItem.dailyPayment.toLocaleString()}/day\n\n` +
        `Please explain the Lipa Mdogo Mdogo requirements and how I can receive or pick up this device.`;
    }
  } else {
    message = `Hello! I would like to inquire about your available smartphones and Lipa Mdogo Mdogo deposit payment plans.`;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

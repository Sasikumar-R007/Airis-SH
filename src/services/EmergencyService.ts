// Emergency Service for sending SOS alerts
// Supports phone calls, SMS, and email notifications

interface EmergencyContact {
  id: number
  name: string
  phone: string
  email: string
}

/**
 * Call emergency contact via phone
 * Uses tel: protocol which works on mobile devices and some desktop apps
 */
export const callEmergencyContact = (phone: string): void => {
  try {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    const telUrl = `tel:${cleanPhone}`
    
    // For mobile devices, this will initiate a call
    // For desktop, it may open a dialer app or Skype
    window.location.href = telUrl
    
    console.log(`Calling emergency contact: ${phone}`)
  } catch (error) {
    console.error(`Failed to call ${phone}:`, error)
    // Fallback: try opening in new window
    window.open(`tel:${phone.replace(/[\s\-\(\)]/g, '')}`, '_blank')
  }
}

/**
 * Send SMS to emergency contact
 */
export const sendSMSToContact = (phone: string, message: string): void => {
  try {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    const encodedMessage = encodeURIComponent(message)
    const smsUrl = `sms:${cleanPhone}?body=${encodedMessage}`
    
    // Open SMS app with pre-filled message
    window.location.href = smsUrl
    
    console.log(`Sending SMS to: ${phone}`)
  } catch (error) {
    console.error(`Failed to send SMS to ${phone}:`, error)
    // Fallback
    window.open(`sms:${phone.replace(/[\s\-\(\)]/g, '')}?body=${encodeURIComponent(message)}`, '_blank')
  }
}

/**
 * Send email to emergency contact
 */
export const sendEmailToContact = (email: string, message: string): void => {
  try {
    const subject = encodeURIComponent('🚨 SOS Alert from Airis-SH')
    const body = encodeURIComponent(message)
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`
    
    window.location.href = mailtoUrl
    
    console.log(`Sending email to: ${email}`)
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error)
  }
}

/**
 * Send SOS alert to all emergency contacts
 * This function will:
 * 1. Call the first contact (primary emergency contact)
 * 2. Send SMS to all contacts with phone numbers
 * 3. Send email to all contacts with email addresses
 */
export const sendSOSAlert = async (
  contacts: EmergencyContact[],
  message: string,
  options?: {
    callFirst?: boolean // Call the first contact immediately
    sendSMS?: boolean   // Send SMS to all phone contacts
    sendEmail?: boolean // Send email to all email contacts
  }
): Promise<{ success: boolean; sent: number; failed: number; called: number }> => {
  let sent = 0
  let failed = 0
  let called = 0

  const opts = {
    callFirst: true,
    sendSMS: true,
    sendEmail: true,
    ...options
  }

  try {
    // 1. Call the first contact with a phone number (if enabled)
    if (opts.callFirst) {
      const firstPhoneContact = contacts.find(c => c.phone && c.phone.trim() !== '')
      if (firstPhoneContact) {
        try {
          callEmergencyContact(firstPhoneContact.phone)
          called++
          console.log(`🚨 Calling primary emergency contact: ${firstPhoneContact.name}`)
        } catch (error) {
          console.error('Failed to call primary contact:', error)
          failed++
        }
      }
    }

    // 2. Send SMS to all contacts with phone numbers (if enabled)
    if (opts.sendSMS) {
      const phoneContacts = contacts.filter(c => c.phone && c.phone.trim() !== '')
      for (const contact of phoneContacts) {
        try {
          // Add a small delay between SMS to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 500))
          sendSMSToContact(contact.phone, message)
          sent++
        } catch (error) {
          console.error(`Failed to send SMS to ${contact.phone}:`, error)
          failed++
        }
      }
    }

    // 3. Send Email to all contacts with email addresses (if enabled)
    if (opts.sendEmail) {
      const emailContacts = contacts.filter(c => c.email && c.email.trim() !== '')
      if (emailContacts.length > 0) {
        try {
          // Send to all emails at once via mailto
          const emails = emailContacts.map(c => c.email).join(',')
          const subject = encodeURIComponent('🚨 SOS Alert from Airis-SH')
          const body = encodeURIComponent(message)
          const mailtoUrl = `mailto:${emails}?subject=${subject}&body=${body}`
          window.location.href = mailtoUrl
          sent += emailContacts.length
        } catch (error) {
          console.error('Failed to send email:', error)
          failed += emailContacts.length
        }
      }
    }

    return { success: sent > 0 || called > 0, sent, failed, called }
  } catch (error) {
    console.error('Emergency alert failed:', error)
    return { success: false, sent, failed, called }
  }
}

export const validateContact = (contact: EmergencyContact): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!contact.name || contact.name.trim() === '') {
    errors.push('Name is required')
  }

  if (!contact.phone && !contact.email) {
    errors.push('At least phone or email is required')
  }

  if (contact.phone && !/^[\d\s\-\+\(\)]+$/.test(contact.phone)) {
    errors.push('Invalid phone number format')
  }

  if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.push('Invalid email format')
  }

  return { valid: errors.length === 0, errors }
}


# Emergency & Caregiver System - Implementation Guide

## Overview
The Emergency & Caregiver system allows users to configure emergency contacts and send SOS alerts when triggered by the Airis-SH device gesture.

## Current Implementation Status
✅ **UI Complete:** All interface elements are functional
⚠️ **Backend Required:** SMS/Email sending needs backend service

## Implementation Options

### Option 1: Backend API Service (Recommended for Production)

**Architecture:**
```
ESP32 (SOS Gesture) → BLE → Web App → Backend API → SMS/Email Services
```

**Backend Services Needed:**
1. **SMS Service:**
   - Twilio API (https://www.twilio.com/)
   - AWS SNS (https://aws.amazon.com/sns/)
   - Vonage API (formerly Nexmo)

2. **Email Service:**
   - SendGrid (https://sendgrid.com/)
   - AWS SES (https://aws.amazon.com/ses/)
   - Mailgun (https://www.mailgun.com/)

**Implementation Steps:**

1. **Create Backend API** (Node.js/Express example):
```javascript
// server.js
const express = require('express');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(express.json());

// Twilio setup
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/emergency/send', async (req, res) => {
  const { contacts, message, location } = req.body;
  
  try {
    // Send SMS to all contacts
    const smsPromises = contacts
      .filter(c => c.phone)
      .map(contact => 
        client.messages.create({
          body: `${message}\n\nLocation: ${location || 'Not available'}`,
          from: process.env.TWILIO_PHONE,
          to: contact.phone
        })
      );
    
    // Send Email to all contacts
    const emailPromises = contacts
      .filter(c => c.email)
      .map(contact =>
        sgMail.send({
          to: contact.email,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: '🚨 SOS Alert from Airis-SH',
          text: message,
          html: `<h2>SOS Alert</h2><p>${message}</p><p>Location: ${location || 'Not available'}</p>`
        })
      );
    
    await Promise.all([...smsPromises, ...emailPromises]);
    
    res.json({ success: true, message: 'Alerts sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000);
```

2. **Frontend Integration:**
```typescript
// src/services/EmergencyService.ts
export const sendSOSAlert = async (
  contacts: EmergencyContact[],
  message: string
) => {
  try {
    // Get user location (optional)
    const location = await getCurrentLocation();
    
    const response = await fetch('/api/emergency/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contacts,
        message,
        location: location ? `${location.lat}, ${location.lng}` : null
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to send SOS alert:', error);
    throw error;
  }
};
```

### Option 2: Client-Side Only (Limited Functionality)

**For Development/Testing:**

1. **Email via mailto:**
```typescript
const sendEmailViaMailto = (contacts: EmergencyContact[], message: string) => {
  const emails = contacts.filter(c => c.email).map(c => c.email).join(',');
  const subject = encodeURIComponent('SOS Alert from Airis-SH');
  const body = encodeURIComponent(message);
  window.location.href = `mailto:${emails}?subject=${subject}&body=${body}`;
};
```

2. **SMS via tel:**
```typescript
const sendSMSViaTel = (phone: string, message: string) => {
  const encodedMessage = encodeURIComponent(message);
  window.location.href = `sms:${phone}?body=${encodedMessage}`;
};
```

**Limitations:**
- Requires user interaction (opens email/SMS app)
- Not automatic
- May not work on all devices

### Option 3: Hybrid Approach (Recommended for MVP)

1. **Use Web Push Notifications** for immediate alerts
2. **Fallback to mailto/sms** for actual message sending
3. **Add backend later** for full automation

## Recommended Implementation Path

### Phase 1: MVP (Current)
- ✅ UI for contact management
- ✅ Message template editor
- ✅ Test SOS button (shows toast)
- ⚠️ Use mailto/sms links for actual sending

### Phase 2: Backend Integration
- Add Node.js/Express backend
- Integrate Twilio for SMS
- Integrate SendGrid for Email
- Add Web Push Notifications

### Phase 3: Advanced Features
- Location tracking
- Alert history/logging
- Multiple alert types
- Caregiver dashboard

## Security Considerations

1. **API Keys:** Never expose API keys in frontend code
2. **Rate Limiting:** Prevent abuse of SOS system
3. **Authentication:** Verify user identity before sending alerts
4. **Privacy:** Encrypt contact information
5. **GDPR Compliance:** Handle user data according to regulations

## Cost Estimates

- **Twilio SMS:** ~$0.0075 per SMS (US)
- **SendGrid Email:** Free tier: 100 emails/day
- **Backend Hosting:** Free tier available (Vercel, Railway, etc.)

## Testing

1. **Test with real phone numbers** (your own)
2. **Verify email delivery**
3. **Test error handling** (invalid numbers, network failures)
4. **Test rate limiting**

## Next Steps

1. Choose implementation option
2. Set up backend service (if Option 1)
3. Integrate with frontend
4. Test thoroughly
5. Deploy

---

**Note:** For production use, Option 1 (Backend API) is strongly recommended for reliability and security.


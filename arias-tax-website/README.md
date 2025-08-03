# Arias Tax Service Website

Professional, mobile-friendly website for Arias Tax Service (One Point Professional Services) in Fresno, CA.

## 🌟 Features

- **Responsive Design**: Mobile-first approach with modern blue/white theme
- **Interactive Navigation**: Smooth scrolling with sticky header
- **Contact Form**: EmailJS integration for direct email submissions
- **Smart Chatbot**: Local JavaScript chatbot with business-aware responses
- **Security Features**: Comprehensive input sanitization and spam protection
- **Professional Content**: Complete service information and business details

## 🏢 Business Information

- **Address**: 441 West Olive Ave, Fresno, CA
- **Phone**: 559-202-9047
- **Email**: gariastax@gmail.com
- **Hours**: 
  - Monday-Friday: 10:00 AM - 6:00 PM
  - Saturday: 10:00 AM - 2:00 PM  
  - Sunday: Closed

## 🔧 Setup Instructions

### 1. EmailJS Configuration (Required for Contact Form)

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Get your Service ID, Template ID, and Public Key
4. Encode each credential using base64:
   ```javascript
   // In browser console or Node.js:
   btoa('your_service_id')    // Copy this result
   btoa('your_template_id')   // Copy this result  
   btoa('your_public_key')    // Copy this result
   ```
5. Replace the base64 values in `script.js` at the top:
   ```javascript
   const EMAILJS_CONFIG = {
       SERVICE_ID: atob('YOUR_ENCODED_SERVICE_ID'),
       TEMPLATE_ID: atob('YOUR_ENCODED_TEMPLATE_ID'), 
       PUBLIC_KEY: atob('YOUR_ENCODED_PUBLIC_KEY')
   };
   ```

### 2. Deployment Options

#### Static Hosting (Recommended)
- **Netlify**: Drag and drop the files
- **Vercel**: Connect your Git repository  
- **GitHub Pages**: Upload to a GitHub repository
- **Any web hosting**: Upload files via FTP/cPanel

#### Local Testing
```bash
# Python (built-in server)
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server

# Then visit: http://localhost:8000
```

## 🔒 Security Features

- ✅ Input sanitization for all form fields and chatbot
- ✅ Rate limiting (30-second cooldown between submissions)
- ✅ Spam detection and content filtering
- ✅ HTTPS enforcement for production
- ✅ Real-time form validation with visual feedback
- ✅ Attempt tracking and suspicious activity logging
- ✅ Enhanced email/phone validation
- ✅ Basic code obfuscation for sensitive data

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 File Structure

```
├── index.html          # Main website page
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript functionality and security
├── README.md           # This file
└── replit.md           # Technical documentation
```

## 🤖 Chatbot Features

The chatbot provides intelligent responses for:
- Business hours and location
- Services offered
- Appointment scheduling
- Contact information
- Sunday/after-hours inquiries with friendly messages

## 📞 Support

For technical support or customization requests, contact the business owner at gariastax@gmail.com or 559-202-9047.

---

**Built with security, performance, and user experience in mind.**
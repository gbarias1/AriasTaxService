# Arias Tax Service Website

## Overview

Professional business website for Arias Tax Service (One Point Professional Services) in Fresno, CA. Complete single-page application with comprehensive security features, responsive design, and intelligent chatbot. Ready for production deployment with EmailJS integration for contact forms.

## Recent Changes (August 2, 2025)

✓ Updated business hours: Mon-Fri 10AM-6PM, Sat 10AM-2PM, Sun closed
✓ Enhanced chatbot with human-like responses and time-aware functionality  
✓ Implemented comprehensive security features (input sanitization, rate limiting, spam detection)
✓ Added real-time form validation with visual feedback
✓ Applied code obfuscation for sensitive configurations
✓ Added HTTPS enforcement for production environments

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without any frameworks
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox layouts
- **Component-Based Styling**: Modular CSS architecture with clear separation of concerns
- **Smooth Scrolling Navigation**: JavaScript-powered scroll behavior with sticky navigation bar

### Design System
- **Color Scheme**: Blue and white gradient theme (`#1e3a8a` to `#3b82f6`) reflecting professional trust
- **Typography**: Inter font family with varied weights (300-700) for hierarchy
- **Layout System**: CSS Grid and Flexbox for responsive layouts with breakpoints for mobile and desktop
- **Visual Assets**: Placeholder system for stock imagery (tax preparation, finance, professional services)

### Interactive Features
- **Mobile Navigation**: Hamburger menu with toggle functionality for small screens
- **Contact System**: EmailJS integration for client-side email sending without server backend
- **Local Chatbot**: JavaScript-only chatbot implementation without external APIs
- **Form Validation**: Client-side form validation with user feedback

### Client-Side Email Integration
- **EmailJS Service**: Handles contact form submissions directly from browser
- **Configuration Pattern**: Centralized config object for service credentials
- **Template System**: Email template structure for consistent communication formatting

## External Dependencies

### Third-Party Services
- **EmailJS**: Client-side email service for contact form functionality (requires service ID, template ID, and public key configuration)
- **Google Fonts**: Inter font family hosting
- **Font Awesome**: Icon library (version 6.4.0) for UI elements
- **CDN Resources**: All external dependencies loaded via CDN (no local hosting required)

### Email Configuration Requirements
- EmailJS service account setup required
- Template configuration for email formatting
- Public key integration for browser-based sending
- Target email: gariastax@gmail.com
- **IMPORTANT**: Replace base64-encoded placeholders in EMAILJS_CONFIG with actual credentials

### Security Features
- Input sanitization for all form fields and chatbot
- Rate limiting (30-second cooldown between submissions)
- Spam detection and content filtering
- HTTPS enforcement for production
- Real-time form validation with visual feedback
- Attempt tracking and suspicious activity logging
- Basic code obfuscation using base64 encoding
- Enhanced email/phone validation patterns

### No Backend Dependencies
- No server-side code or database
- No authentication system
- All functionality runs in browser environment
- Static hosting compatible (GitHub Pages, Netlify, Vercel, etc.)

## Deployment Instructions

1. **EmailJS Setup**:
   - Sign up at https://www.emailjs.com/
   - Create service and email template
   - Encode your credentials in base64 and replace in `script.js`

2. **Domain Setup**:
   - Upload files to any static hosting service
   - Ensure HTTPS is enabled
   - Update any domain-specific configurations

3. **Testing Checklist**:
   - Test contact form submission
   - Verify chatbot responses
   - Check mobile responsiveness
   - Test all navigation links
   - Validate form security features
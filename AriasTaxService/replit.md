# Arias Tax Service Website

## Overview

Professional business website for Arias Tax Service (One Point Professional Services) in Fresno, CA. Complete single-page application with working contact form, responsive design, and intelligent chatbot. Production-ready with Brevo API email integration.

## Recent Changes (August 5, 2025) - EMAIL SYSTEM COMPLETE ✅

✓ BREVO API INTEGRATION: Contact form now sends real emails to gariastax@gmail.com using Brevo REST API
✓ EMAIL DELIVERY CONFIRMED: Successful email sending with message tracking
✓ SUCCESS ANIMATION: Beautiful green checkmark animation when email is sent
✓ FUNCTIONAL HAMBURGER MENU: Mobile navigation works perfectly with slide-in animation
✓ DISTINCT COLOR SCHEME: Solid green (#15803d) and red (#b91c1c) colors without gradients
✓ CHATBOT PRICING: AI responds "Many things vary on the price of the service" for pricing questions
✓ NODE.JS BACKEND: Secure email API with Brevo integration
✓ ERROR HANDLING: User-friendly error messages with SendGrid fallback
✓ MOBILE RESPONSIVE: Hamburger menu slides from right with proper animations
✓ FORM VALIDATION: JavaScript form handling with proper field mapping

🎯 PRODUCTION READY: Website is fully functional and ready for deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without any frameworks
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox layouts with working hamburger menu
- **Component-Based Styling**: Modular CSS architecture with clear separation of concerns
- **Smooth Scrolling Navigation**: JavaScript-powered scroll behavior with sticky navigation bar
- **Mobile Navigation**: Slide-in hamburger menu with animated hamburger icon transformation

### Backend Architecture
- **Node.js Express Server**: Handles email sending via Brevo API
- **RESTful API**: /api/send-email endpoint for contact form submissions
- **Environment Variables**: Secure API key management using Replit Secrets

### Design System
- **Color Scheme**: Distinct green (#15803d) and red (#b91c1c) theme with solid colors
- **Typography**: Inter font family with varied weights (300-700) for hierarchy
- **Layout System**: CSS Grid and Flexbox for responsive layouts with breakpoints for mobile and desktop
- **Visual Assets**: Professional tax and finance themed design elements
- **Animations**: Success overlay with bouncing checkmark, sliding mobile menu, error notifications

### Interactive Features
- **Mobile Navigation**: Functional hamburger menu with slide-in animation and icon transformation
- **Email System**: Node.js backend with Brevo API for reliable email delivery
- **Success Animations**: Overlay with bouncing checkmark and auto-close functionality
- **Local Chatbot**: JavaScript-only chatbot with pricing responses
- **Form Validation**: Client-side form validation with user feedback
- **Error Handling**: User-friendly error notifications with auto-dismiss

### Server-Side Email Integration
- **Brevo API**: Secure email delivery via Node.js backend
- **HTML Templates**: Professional email formatting with business branding
- **API Security**: Environment variable protection for API keys
- **Error Recovery**: Fallback messaging for failed email attempts

## External Dependencies

### Third-Party Services
- **Brevo API**: Server-side email service for contact form functionality
- **Google Fonts**: Inter font family hosting
- **Font Awesome**: Icon library (version 6.4.0) for UI elements
- **CDN Resources**: All external dependencies loaded via CDN

### Email Configuration
- Brevo API integrated and configured
- Professional email templates with business branding
- Target email: gariastax@gmail.com
- Environment variables configured for API security

### Security Features
- Input sanitization for all form fields and chatbot
- Rate limiting (30-second cooldown between submissions)
- Spam detection and content filtering
- HTTPS enforcement for production
- Real-time form validation with visual feedback
- Attempt tracking and suspicious activity logging
- Basic code obfuscation using base64 encoding
- Enhanced email/phone validation patterns

### Backend Dependencies
- Node.js Express server for email API
- Brevo API integration for reliable email delivery
- Environment variables for API key security
- Requires Node.js hosting (Replit, Heroku, Vercel, etc.)

## Deployment Instructions

1. **Environment Setup**:
   - Ensure BREVO_API_KEY is configured in environment variables
   - Node.js hosting service required (Replit, Heroku, Vercel, etc.)

2. **Domain Setup**:
   - Deploy to Node.js compatible hosting service
   - Ensure HTTPS is enabled for production
   - Configure custom domain if needed

3. **Production Checklist**:
   - Contact form sending emails successfully ✅
   - Mobile responsive design working ✅
   - Chatbot responding correctly ✅
   - All navigation links functional ✅
   - Email delivery confirmed ✅
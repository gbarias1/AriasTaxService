// EmailJS Configuration (Base64 encoded for basic obfuscation)
// IMPORTANT: Replace these placeholder values with your actual EmailJS credentials
// Get these from your EmailJS dashboard: https://www.emailjs.com/
const EMAILJS_CONFIG = {
    // Replace 'your_service_id' with your actual EmailJS service ID (base64 encoded)
    SERVICE_ID: atob('eW91cl9zZXJ2aWNlX2lk'), // 'your_service_id' 
    
    // Replace 'your_template_id' with your actual EmailJS template ID (base64 encoded)
    TEMPLATE_ID: atob('eW91cl90ZW1wbGF0ZV9pZA=='), // 'your_template_id'
    
    // Replace 'your_public_key' with your actual EmailJS public key (base64 encoded)
    PUBLIC_KEY: atob('eW91cl9wdWJsaWNfa2V5') // 'your_public_key'
};

// Security configuration (obfuscated)
const SEC_CONFIG = {
    MAX_ATTEMPTS: parseInt(atob('MzA=')), // 30
    COOLDOWN: parseInt(atob('MzAwMDA=')), // 30000
    MAX_LENGTH: parseInt(atob('MTAwMA==')) // 1000
};

// HTTPS enforcement and security initialization
function enforceHTTPS() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        location.replace('https:' + window.location.href.substring(window.location.protocol.length));
    }
}

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Enforce HTTPS for production
    enforceHTTPS();
    
    // Initialize EmailJS with public key
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    
    // Initialize all functionality
    initializeNavigation();
    initializeChatbot();
    initializeContactForm();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Security and rate limiting for form submissions
const formSecurity = {
    lastSubmission: 0,
    submissionCooldown: SEC_CONFIG.COOLDOWN,
    maxMessageLength: SEC_CONFIG.MAX_LENGTH,
    maxNameLength: 100,
    attemptCount: 0,
    maxAttempts: SEC_CONFIG.MAX_ATTEMPTS,
    
    // Input sanitization
    sanitizeInput: function(input) {
        if (typeof input !== 'string') return '';
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential script tags
            .replace(/javascript:/gi, '') // Remove javascript: protocols
            .replace(/on\w+=/gi, '') // Remove event handlers
            .substring(0, this.maxMessageLength);
    },
    
    // Enhanced email validation
    validateEmail: function(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    },
    
    // Enhanced phone validation
    validatePhone: function(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 15 && /^[\d\s\-\+\(\)\.]+$/.test(phone);
    },
    
    // Rate limiting check
    canSubmit: function() {
        const now = Date.now();
        if (now - this.lastSubmission < this.submissionCooldown) {
            return false;
        }
        this.lastSubmission = now;
        return true;
    },
    
    // Check for spam patterns
    isSpam: function(message) {
        const spamPatterns = [
            /(.)\1{10,}/, // Repeated characters
            /http[s]?:\/\//gi, // URLs
            /\b(buy|sale|cheap|free|money|cash|loan|credit|viagra|casino|gambling)\b/gi, // Common spam words
            /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/, // Credit card patterns
            /\$\d+/g // Money amounts
        ];
        
        return spamPatterns.some(pattern => pattern.test(message));
    },
    
    // Track submission attempts
    trackAttempt: function() {
        this.attemptCount++;
        if (this.attemptCount > this.maxAttempts) {
            this.logSuspiciousActivity('Excessive form submissions detected');
            return false;
        }
        return true;
    },
    
    // Log suspicious activity (in production, this would send to server)
    logSuspiciousActivity: function(activity) {
        console.warn(`Security Alert: ${activity} - ${new Date().toISOString()}`);
        // In production, send this to your security monitoring system
    }
};

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('appointment-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Rate limiting and attempt tracking
        if (!formSecurity.canSubmit()) {
            showError('Please wait 30 seconds before submitting another message.');
            return;
        }
        
        if (!formSecurity.trackAttempt()) {
            showError('Too many submission attempts. Please contact us directly.');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Get and sanitize form data
        const rawData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        const formData = {
            fullName: formSecurity.sanitizeInput(rawData.fullName).substring(0, formSecurity.maxNameLength),
            email: formSecurity.sanitizeInput(rawData.email),
            phone: formSecurity.sanitizeInput(rawData.phone),
            message: formSecurity.sanitizeInput(rawData.message),
            to_email: 'gariastax@gmail.com'
        };

        // Validate form data
        if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
            showError('Please fill in all required fields.');
            resetSubmitButton();
            return;
        }

        // Enhanced validation
        if (!formSecurity.validateEmail(formData.email)) {
            showError('Please enter a valid email address.');
            resetSubmitButton();
            return;
        }

        if (!formSecurity.validatePhone(formData.phone)) {
            showError('Please enter a valid phone number (10-15 digits).');
            resetSubmitButton();
            return;
        }

        // Spam detection
        if (formSecurity.isSpam(formData.message) || formSecurity.isSpam(formData.fullName)) {
            showError('Your message appears to contain invalid content. Please try again.');
            resetSubmitButton();
            return;
        }

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                formData
            );

            if (response.status === 200) {
                // Success
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successMessage.style.display = 'none';
                    resetSubmitButton();
                }, 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            showError('There was an error sending your message. Please try again or call us directly at 559-202-9047.');
            resetSubmitButton();
        }
    });

    // Real-time input validation and sanitization
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    // Add input event listeners for real-time validation
    nameInput.addEventListener('input', function() {
        this.value = formSecurity.sanitizeInput(this.value).substring(0, formSecurity.maxNameLength);
        validateField(this, this.value.length > 0, 'Name is required');
    });

    emailInput.addEventListener('input', function() {
        this.value = formSecurity.sanitizeInput(this.value);
        validateField(this, formSecurity.validateEmail(this.value), 'Please enter a valid email address');
    });

    phoneInput.addEventListener('input', function() {
        this.value = formSecurity.sanitizeInput(this.value);
        validateField(this, formSecurity.validatePhone(this.value), 'Please enter a valid phone number');
    });

    messageInput.addEventListener('input', function() {
        this.value = formSecurity.sanitizeInput(this.value);
        const isValid = this.value.length > 0 && !formSecurity.isSpam(this.value);
        validateField(this, isValid, 'Message is required and cannot contain spam content');
    });

    function validateField(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            formGroup.appendChild(errorElement);
        }

        if (isValid) {
            field.style.borderColor = '#10b981';
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } else if (field.value.length > 0) {
            field.style.borderColor = '#ef4444';
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        } else {
            field.style.borderColor = '#d1d5db';
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    function resetSubmitButton() {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }

    function showError(message) {
        errorMessage.style.display = 'block';
        errorMessage.querySelector('p').textContent = message;
        
        // Hide error message after 8 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 8000);
    }
}

// Chatbot functionality
function initializeChatbot() {
    const chatIcon = document.getElementById('chat-icon');
    const chatbot = document.getElementById('chatbot');
    const closeChatBtn = document.getElementById('close-chat');
    const openChatBtn = document.getElementById('open-chat');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');

    // Predefined responses for the chatbot
    const chatResponses = {
        'hours': {
            keywords: ['hours', 'time', 'open', 'close', 'when'],
            response: "We're open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 2:00 PM. We're closed on Sundays. Let us know how we can help!"
        },
        'sunday': {
            keywords: ['sunday', 'sun'],
            response: "Hey, sorry but we're closed on Sundays! We're open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 2:00 PM. Feel free to call us or send a message during business hours and we'll be happy to help you out!"
        },
        'afterhours': {
            keywords: ['help', 'service', 'need', 'appointment', 'question'],
            response: null // This will be handled by time-based logic
        },
        'location': {
            keywords: ['location', 'address', 'where', 'directions', 'find'],
            response: "We're at 441 West Olive Avenue in Fresno — just a few blocks east of the Fresno Chaffee Zoo. Feel free to call if you need directions!"
        },
        'appointment': {
            keywords: ['appointment', 'schedule', 'book', 'meeting', 'visit'],
            response: "I'd be happy to help you schedule an appointment! You can give us a call at 559-202-9047 or fill out the contact form right here on the website. We'll get back to you quickly to set up a time that works for you."
        },
        'services': {
            keywords: ['services', 'offer', 'do', 'help', 'tax', 'bookkeeping', 'payroll'],
            response: "Great question! We specialize in tax preparation, bookkeeping, payroll services, and small business support. Whether you need help with your personal taxes or running your business, we've got you covered. What specific service are you interested in?"
        },
        'phone': {
            keywords: ['phone', 'number', 'call', 'contact', 'reach'],
            response: "You can reach us during business hours at 559-202-9047. We're always happy to chat about how we can help with your tax and business needs!"
        },
        'greeting': {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            response: "Hello! Welcome to Arias Tax Service. I'm here to help you with any questions about our services, location, or hours. How can I assist you today?"
        },
        'thanks': {
            keywords: ['thank', 'thanks', 'appreciate'],
            response: "You're very welcome! Is there anything else I can help you with today?"
        }
    };

    // Check if we're currently outside business hours
    function isAfterHours() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 100 + minute; // Convert to HHMM format
        
        // Sunday = closed
        if (day === 0) return true;
        
        // Monday-Friday: 10:00 AM - 6:00 PM (1000-1800)
        if (day >= 1 && day <= 5) {
            return currentTime < 1000 || currentTime >= 1800;
        }
        
        // Saturday: 10:00 AM - 2:00 PM (1000-1400)
        if (day === 6) {
            return currentTime < 1000 || currentTime >= 1400;
        }
        
        return false;
    }

    // Default response for complex questions
    const defaultResponse = "That's a great question! Please call us at 559-202-9047 or fill out the contact form — one of our experts will follow up with you directly.";

    // Open chatbot
    function openChat() {
        chatbot.style.display = 'block';
        chatInput.focus();
    }

    // Close chatbot
    function closeChatFunction() {
        chatbot.style.display = 'none';
    }

    // Event listeners
    chatIcon.addEventListener('click', openChat);
    openChatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openChat();
    });
    closeChatBtn.addEventListener('click', closeChatFunction);

    // Chatbot input sanitization
    const chatSecurity = {
        sanitizeChatInput: function(input) {
            return input
                .trim()
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '')
                .substring(0, 200); // Limit chat input length
        },
        
        isValidChatInput: function(input) {
            const bannedPatterns = [
                /script/gi,
                /iframe/gi,
                /object/gi,
                /embed/gi
            ];
            return !bannedPatterns.some(pattern => pattern.test(input));
        }
    };

    // Send message functionality
    function sendMessage() {
        let message = chatInput.value.trim();
        if (!message) return;

        // Sanitize chat input
        message = chatSecurity.sanitizeChatInput(message);
        
        // Validate chat input
        if (!chatSecurity.isValidChatInput(message)) {
            chatInput.value = '';
            return;
        }

        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';

        // Generate and add bot response
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, 500);
    }

    // Add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Generate bot response based on user input
    function generateResponse(userMessage) {
        const lowercaseMessage = userMessage.toLowerCase();
        
        // Check for Sunday-specific inquiries first
        if (chatResponses.sunday.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
            return chatResponses.sunday.response;
        }
        
        // Check for greeting first
        if (chatResponses.greeting.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
            return chatResponses.greeting.response;
        }
        
        // Check for thanks
        if (chatResponses.thanks.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
            return chatResponses.thanks.response;
        }
        
        // Check if they're asking for help/services and it's after hours
        const isServiceRequest = chatResponses.afterhours.keywords.some(keyword => 
            lowercaseMessage.includes(keyword)
        );
        
        if (isServiceRequest && isAfterHours()) {
            const now = new Date();
            const day = now.getDay();
            
            if (day === 0) { // Sunday
                return "Hey, sorry but we can't help right now since we're closed on Sundays! We're open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 2:00 PM. Please give us a call or send a message during business hours and we'll be happy to help you out!";
            } else {
                return "Hey, sorry but we're currently closed for the day. We're open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 2:00 PM. Please call us at 559-202-9047 during business hours or fill out our contact form and we'll get back to you first thing!";
            }
        }
        
        // Check for specific topics
        for (const [topic, data] of Object.entries(chatResponses)) {
            if (topic === 'greeting' || topic === 'thanks' || topic === 'sunday' || topic === 'afterhours') continue;
            
            if (data.keywords && data.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
                return data.response;
            }
        }
        
        // Return default response for unrecognized questions
        return defaultResponse;
    }

    // Event listeners for sending messages
    sendMessageBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (!chatbot.contains(e.target) && !chatIcon.contains(e.target) && !openChatBtn.contains(e.target)) {
            if (chatbot.style.display === 'block') {
                closeChatFunction();
            }
        }
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and other elements
    const animatedElements = document.querySelectorAll('.service-card, .contact-item, .hero-content, .hero-image');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image img');
        
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: debounce scroll events
const debouncedScrollHandler = debounce(function() {
    // Any scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for EmailJS
window.addEventListener('error', function(e) {
    if (e.message.includes('emailjs')) {
        console.warn('EmailJS error detected. Please check your configuration.');
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Close chatbot with Escape key
    if (e.key === 'Escape') {
        const chatbot = document.getElementById('chatbot');
        if (chatbot.style.display === 'block') {
            chatbot.style.display = 'none';
        }
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Console message for developers
console.log(`
🏢 Arias Tax Service Website
📧 Contact: gariastax@gmail.com
📞 Phone: 559-202-9047

🔒 SECURITY FEATURES ENABLED:
✓ Input sanitization for all form fields and chatbot
✓ Rate limiting (30-second cooldown between submissions)
✓ Spam detection and content filtering
✓ HTTPS enforcement (production only)
✓ Enhanced email/phone validation
✓ Real-time input validation with visual feedback
✓ Attempt tracking and suspicious activity logging
✓ Basic code obfuscation for sensitive configurations

⚠️  SETUP REQUIRED:
To enable the contact form, please:
1. Sign up at https://www.emailjs.com/
2. Create a service and template  
3. Replace the base64 encoded values in EMAILJS_CONFIG with your actual credentials (base64 encoded)

For support, contact the business owner.
`);

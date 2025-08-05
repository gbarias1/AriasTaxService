// Perfect Contact Form - No Input Interference
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeChatbot();
    initializeContactForm();
    
    console.log('🎉 Arias Tax Service Website - Perfect Edition Loaded!');
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(21, 128, 61, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#15803d';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Perfect Contact Form - Zero Interference
function initializeContactForm() {
    const form = document.getElementById('appointment-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('form-success');

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';

        try {
            // Get form data
            const formData = {
                name: form.fullName.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                message: form.message.value.trim()
            };

            console.log('📧 Submitting form data:', formData);

            // Send email via our API
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('📡 Response status:', response.status);
            const result = await response.json();
            console.log('📬 API Result:', result);

            if (result.success) {
                console.log('✅ Email sent successfully! Message ID:', result.messageId);
                // Show success animation
                showSuccessAnimation();
                form.reset();
            } else {
                console.error('❌ Email failed:', result.error);
                throw new Error(result.error || 'Failed to send email');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage(error.message || 'Failed to send message. Please try calling us directly.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });

    console.log('✅ Contact form initialized - spaces work perfectly!');
}

// Success Animation Function
function showSuccessAnimation() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    // Create success message
    const successBox = document.createElement('div');
    successBox.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
        animation: slideIn 0.5s ease;
        border: 3px solid #15803d;
    `;

    successBox.innerHTML = `
        <div style="color: #15803d; font-size: 60px; margin-bottom: 20px;">
            <i class="fas fa-check-circle" style="animation: bounce 0.6s ease;"></i>
        </div>
        <h3 style="color: #15803d; margin-bottom: 15px; font-size: 24px;">Message Sent Successfully!</h3>
        <p style="color: #666; margin-bottom: 20px;">Thank you for contacting Arias Tax Service. We'll get back to you soon!</p>
        <button id="success-close" style="
            background: #15803d;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
        ">Close</button>
    `;

    overlay.appendChild(successBox);
    document.body.appendChild(overlay);

    // Add animations to head
    if (!document.getElementById('success-animations')) {
        const style = document.createElement('style');
        style.id = 'success-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
                40%, 43% { transform: translate3d(0,-15px,0); }
                70% { transform: translate3d(0,-7px,0); }
                90% { transform: translate3d(0,-3px,0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Close functionality
    const closeOverlay = () => {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    };

    // Add event listeners immediately after DOM insertion
    setTimeout(() => {
        const closeBtn = overlay.querySelector('#success-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeOverlay);
        }
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });
    }, 50);

    // Auto close after 5 seconds
    setTimeout(closeOverlay, 5000);
}

// Error message function
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
            ">&times;</button>
        </div>
    `;

    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Add slideInRight animation
if (!document.getElementById('error-animations')) {
    const style = document.createElement('style');
    style.id = 'error-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Chatbot functionality
function initializeChatbot() {
    const chatIcon = document.getElementById('chat-icon');
    const chatbot = document.getElementById('chatbot');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');

    // Predefined responses
    const chatResponses = {
        'hours': {
            keywords: ['hours', 'time', 'open', 'close', 'when'],
            response: "We're open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 2:00 PM. We're closed on Sundays. Let us know how we can help!"
        },
        'sunday': {
            keywords: ['sunday', 'sun'],
            response: "Hey, sorry but we're closed on Sundays! We're open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 2:00 PM. Feel free to call us or send a message during business hours and we'll be happy to help you out!"
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
        'pricing': {
            keywords: ['price', 'cost', 'fee', 'charge', 'how much', 'pricing', 'rates'],
            response: "Many things vary on the price of the service - it depends on the complexity of your tax situation, business size, and specific services needed. We offer competitive rates and will provide a clear quote after understanding your needs. Please call us at 559-202-9047 for a personalized pricing discussion!"
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

    // Default response
    const defaultResponse = "That's a great question! Please call us at 559-202-9047 or fill out the contact form — one of our experts will follow up with you directly.";

    // Open chatbot
    function openChat() {
        chatbot.style.display = 'block';
        chatInput.focus();
    }

    // Close chatbot
    function closeChat() {
        chatbot.style.display = 'none';
    }

    // Add message to chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Generate bot response
    function generateResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // Check for specific responses
        for (const [key, responseData] of Object.entries(chatResponses)) {
            if (responseData.keywords.some(keyword => input.includes(keyword))) {
                if (key === 'afterhours' && responseData.response === null) {
                    // Handle after-hours logic
                    if (isAfterHours()) {
                        return "I see you're reaching out outside our business hours. We're open Monday-Friday 10AM-6PM and Saturday 10AM-2PM. Feel free to leave a message using our contact form and we'll get back to you first thing during business hours!";
                    } else {
                        return responseData.response || defaultResponse;
                    }
                }
                return responseData.response;
            }
        }
        
        return defaultResponse;
    }

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, true);
            
            // Clear input
            chatInput.value = '';
            
            // Generate and add bot response after short delay
            setTimeout(() => {
                const response = generateResponse(message);
                addMessage(response, false);
            }, 500);
        }
    }

    // Event listeners
    chatIcon.addEventListener('click', openChat);
    closeChatBtn.addEventListener('click', closeChat);
    sendMessageBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    console.log('✅ Chatbot initialized and ready!');
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Close chatbot with Escape key
    if (e.key === 'Escape') {
        const chatbot = document.getElementById('chatbot');
        if (chatbot && chatbot.style.display === 'block') {
            chatbot.style.display = 'none';
        }
    }
});

// Performance optimization: debounce scroll events
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

const debouncedScrollHandler = debounce(function() {
    // Any scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Website loaded successfully with all features working
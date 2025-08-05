// Working backup version of server.js before modifications
const express = require('express');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Debug environment
console.log('Server running on port', PORT);
console.log('Brevo SMTP Key configured:', !!process.env.BREVO_SMTP_LOGIN);
console.log('Brevo SMTP Login configured:', !!process.env.BREVO_SMTP_LOGIN);
console.log('SMTP Key format check:', process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 10) + '...' : 'NOT SET');
console.log('SMTP Login:', process.env.BREVO_SMTP_LOGIN);

console.log('=== BREVO API INTEGRATION ===');
console.log('Using Brevo REST API for reliable email delivery');
console.log('API Key configured:', !!process.env.BREVO_API_KEY);
console.log('SendGrid fallback available:', !!process.env.SENDGRID_API_KEY);
console.log('===============================');

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Email API endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required.'
            });
        }

        // Create email template
        const mailOptions = {
            from: {
                name: 'Arias Tax Service Website',
                address: 'gariastax@gmail.com'
            },
            to: 'gariastax@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #15803d, #22c55e); color: white; padding: 20px; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px;">
                        <h2 style="margin: 0; text-align: center;">New Contact Form Submission</h2>
                        <p style="margin: 10px 0 0 0; text-align: center; opacity: 0.9;">Arias Tax Service</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <p><strong style="color: #b91c1c;">Name:</strong> ${name}</p>
                        <p><strong style="color: #b91c1c;">Email:</strong> ${email}</p>
                        <p><strong style="color: #b91c1c;">Phone:</strong> ${phone || 'Not provided'}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <p><strong style="color: #b91c1c;">Message:</strong></p>
                        <div style="background: white; padding: 15px; border-left: 4px solid #15803d; margin-top: 10px;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                        <p>This message was sent from the Arias Tax Service website contact form.</p>
                        <p>Timestamp: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `
        };

        // Try Brevo API first (more reliable than SMTP)
        let emailSent = false;
        let result;
        
        try {
            console.log('Attempting Brevo API...');
            
            // Create email data for Brevo API
            const brevoEmailData = {
                sender: { 
                    name: "Arias Tax Service Website", 
                    email: "gariastax@gmail.com" 
                },
                to: [{ 
                    email: "gariastax@gmail.com", 
                    name: "Arias Tax Service" 
                }],
                replyTo: { 
                    email: email, 
                    name: name 
                },
                subject: `New Contact Form Submission from ${name}`,
                htmlContent: mailOptions.html
            };

            // Send email using Brevo API
            const postData = JSON.stringify(brevoEmailData);
            
            const options = {
                hostname: 'api.brevo.com',
                port: 443,
                path: '/v3/smtp/email',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            result = await new Promise((resolve, reject) => {
                const req = https.request(options, (response) => {
                    let data = '';

                    response.on('data', (chunk) => {
                        data += chunk;
                    });

                    response.on('end', () => {
                        try {
                            const result = JSON.parse(data);
                            if (response.statusCode === 201) {
                                resolve(result);
                            } else {
                                reject(new Error(result.message || `HTTP ${response.statusCode}: ${data}`));
                            }
                        } catch (parseError) {
                            console.log('Raw API Response:', data);
                            reject(new Error(`Failed to parse response: ${data}`));
                        }
                    });
                });

                req.on('error', (error) => {
                    reject(error);
                });

                req.write(postData);
                req.end();
            });
            
            console.log('Email sent successfully via Brevo API:', result.messageId);
            emailSent = true;
            
        } catch (brevoError) {
            console.log('Brevo API failed:', brevoError.message);
            
            // Fallback to SendGrid if available
            if (process.env.SENDGRID_API_KEY) {
                try {
                    console.log('Trying SendGrid fallback...');
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    
                    const sgMailOptions = {
                        to: 'gariastax@gmail.com',
                        from: {
                            name: 'Arias Tax Service Website',
                            email: 'gariastax@gmail.com'
                        },
                        replyTo: {
                            name: name,
                            email: email
                        },
                        subject: `New Contact Form Submission from ${name}`,
                        html: mailOptions.html
                    };
                    
                    result = await sgMail.send(sgMailOptions);
                    console.log('Email sent successfully via SendGrid:', result[0].headers['x-message-id']);
                    emailSent = true;
                } catch (sgError) {
                    console.log('SendGrid also failed:', sgError.message);
                }
            }
        }

        if (emailSent) {
            return res.json({
                success: true,
                message: 'Email sent successfully!',
                messageId: result.messageId || result[0]?.headers?.['x-message-id'] || 'Unknown'
            });
        } else {
            throw new Error('All email services failed');
        }

    } catch (error) {
        console.log('Email sending error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send email. Please try again or call us directly.'
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
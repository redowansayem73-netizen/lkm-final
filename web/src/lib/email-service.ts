import nodemailer from 'nodemailer';

type EmailType = 'support' | 'order' | 'service';

export function getEmailTransporter(type: EmailType) {
    let user = '';

    switch (type) {
        case 'support':
            user = process.env.EMAIL_SUPPORT || 'support@lakembamobileking.com.au';
            break;
        case 'order':
            user = process.env.EMAIL_ORDER || 'order@lakembamobileking.com.au';
            break;
        case 'service':
            user = process.env.EMAIL_SERVICE || 'service@lakembamobileking.com.au';
            break;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true, // true for 465, false for other ports
        auth: {
            user: user,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    return { transporter, user };
}

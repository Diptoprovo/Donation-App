import nodemailer from 'nodemailer';

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send notification email
export const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html: html || text
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${subject}`);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

// Send donation match notification to donor
export const sendDonationMatchEmail = async (donor, request) => {
    const subject = 'New donation match found';
    const html = `
        <h2>Hello ${donor.name},</h2>
        <p>A new recipient has requested your donated item.</p>
        <p>Request details:</p>
        <ul>
            <li>Item requested: ${request.name}</li>
            <li>Category: ${request.category}</li>
            <li>Requested by: ${request.receiverId.name}</li>
        </ul>
        <p>Please login to your account to accept or decline this request.</p>
        <p>Thank you for your generosity!</p>
    `;
    
    return await sendEmail(donor.email, subject, 'A new recipient has matched with your donation', html);
};

// Send request accepted notification to recipient
export const sendRequestAcceptedEmail = async (receiver, item) => {
    const subject = 'Your donation request has been accepted';
    const html = `
        <h2>Hello ${receiver.name},</h2>
        <p>Great news! Your request has been accepted by the donor.</p>
        <p>Item details:</p>
        <ul>
            <li>Item: ${item.name}</li>
            <li>Category: ${item.category}</li>
            <li>Condition: ${item.condition}</li>
            <li>Donated by: ${item.donorId.name}</li>
        </ul>
        <p>Please login to your account to arrange pickup/delivery details.</p>
        <p>Thank you for using our platform!</p>
    `;
    
    return await sendEmail(receiver.email, subject, 'Your donation request has been accepted', html);
};

export default { sendEmail, sendDonationMatchEmail, sendRequestAcceptedEmail }; 

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import nodemailer from 'nodemailer';
import { getEmailTransporter } from '@/lib/email-service';
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            brand,
            model,
            issue,
            price,
            bookingDate,
            bookingTime,
            customerName,
            customerEmail,
            customerPhone,
            notes
        } = body;

        // Validation
        if (!brand || !model || !issue || !bookingDate || !bookingTime || !customerName || !customerEmail || !customerPhone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Insert into Database
        await db.insert(bookings).values({
            brand,
            model,
            issue,
            price: price ? price.toString() : null,
            bookingDate,
            bookingTime,
            customerName,
            customerEmail,
            customerPhone,
            notes,
            status: 'pending'
        });

        // 2. Send Email
        const { transporter, user } = getEmailTransporter('service');

        const adminMailOptions = {
            from: user,
            to: process.env.EMAIL_SERVICE || user, // send back to the service email
            subject: `New Repair Booking: ${customerName} - ${brand} ${model}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">New Repair Booking Alert</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p><strong>Customer:</strong> ${customerName}</p>
                        <p><strong>Email:</strong> ${customerEmail}</p>
                        <p><strong>Phone:</strong> ${customerPhone}</p>
                        <hr style="border-top: 1px solid #e5e7eb;">
                        <h3>Device Details</h3>
                        <p><strong>Device:</strong> ${brand} ${model}</p>
                        <p><strong>Issue:</strong> ${issue}</p>
                        <p><strong>Estimated Price:</strong> $${price}</p>
                        <hr style="border-top: 1px solid #e5e7eb;">
                        <h3>Appointment</h3>
                        <p><strong>Date:</strong> ${bookingDate}</p>
                        <p><strong>Time:</strong> ${bookingTime}</p>
                        <p><strong>Notes:</strong> ${notes || 'None'}</p>
                    </div>
                </div>
            `
        };

        const customerMailOptions = {
            from: `"Lakemba Mobile King" <${user}>`,
            to: customerEmail,
            subject: `Booking Confirmed: ${brand} ${model} Repair - Lakemba Mobile King`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Booking Confirmed!</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hi ${customerName},</p>
                        <p>Thank you for booking your repair with <strong>Lakemba Mobile King</strong>!</p>
                        <p>We've successfully received your appointment request. Please review your booking details below:</p>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Device:</strong> ${brand} ${model}</p>
                            <p style="margin: 5px 0;"><strong>Reported Issue:</strong> ${issue}</p>
                            <p style="margin: 5px 0;"><strong>Estimated Quote:</strong> $${price}</p>
                            <hr style="border-top: 1px solid #e5e7eb; margin: 15px 0;">
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${bookingDate}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${bookingTime}</p>
                            <p style="margin: 5px 0;"><strong>Store Address:</strong> Shop 2, 52 Railway Parade, Lakemba, NSW 2195</p>
                        </div>
                        
                        <p>If you need to reschedule or have any questions, simply reply to this email or call us directly at <strong>0410 807 546</strong>.</p>
                        <p>We look forward to seeing you!</p>
                        <br>
                        <p>Best Regards,</p>
                        <p><strong>The Lakemba Mobile King Team</strong></p>
                    </div>
                    
                    <div style="background-color: #f8fafc; text-align: center; padding: 25px; color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: bold; color: #0f172a;">Lakemba Mobile King</p>
                        <p style="margin: 5px 0;">Shop 2, 52 Railway Parade, Lakemba, NSW 2195</p>
                        <p style="margin: 5px 0;">Phone: 0410 807 546 | Email: info@lakembamobileking.com.au</p>
                        <p style="margin: 10px 0 0;">© ${new Date().getFullYear()} Lakemba Mobile King. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        // Send both emails simultaneously
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(customerMailOptions)
        ]);

        return NextResponse.json({ success: true, message: 'Booking received' }, { status: 201 });

    } catch (error: any) {
        console.error('Booking error:', error);
        return NextResponse.json({
            error: 'Failed to process booking',
            details: error.message || String(error)
        }, { status: 500 });
    }
}

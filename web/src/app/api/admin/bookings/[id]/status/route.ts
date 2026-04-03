import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import { getEmailTransporter } from '@/lib/email-service';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await request.json();
        const { status } = body;

        if (!['pending', 'processing', 'done'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Fetch the booking first to get customer details
        const [booking] = await db.select().from(bookings).where(eq(bookings.id, parseInt(id))).limit(1);

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const updateData: any = { status };

        if (status === 'done') {
            const now = new Date();
            updateData.completionDate = now.toISOString().split('T')[0];
            updateData.completionTime = now.toTimeString().slice(0, 5);
        }

        // Update the status
        await db.update(bookings)
            .set(updateData)
            .where(eq(bookings.id, parseInt(id)));

        // Send email notification to customer
        try {
            const { transporter, user } = getEmailTransporter('service');

            let statusMessage = '';
            let subjectStr = '';

            if (status === 'processing') {
                statusMessage = 'Your repair has been confirmed and is now being processed by our technicians. We will notify you once it is complete.';
                subjectStr = `Update: Your Repair Booking is Confirmed - Lakemba Mobile King`;
            } else if (status === 'done') {
                statusMessage = 'Great news! Your device repair is now complete and ready for pickup. Please visit our store at your earliest convenience.';
                subjectStr = `Update: Your Repair is Complete! - Lakemba Mobile King`;
            }

            if (statusMessage) {
                const mailOptions = {
                    from: `"Lakemba Mobile King" <${user}>`,
                    to: booking.customerEmail,
                    subject: subjectStr,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
                            <h2 style="color: #1f5494;">Repair Booking Update</h2>
                            <p>Dear ${booking.customerName},</p>
                            <p>${statusMessage}</p>
                            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin-top: 0; color: #333;">Device Details</h3>
                                <p><strong>Device:</strong> ${booking.brand} ${booking.model}</p>
                                <p><strong>Issue:</strong> ${booking.issue}</p>
                                <p><strong>Status:</strong> <span style="text-transform: capitalize; color: #1f5494; font-weight: bold;">${status}</span></p>
                            </div>
                            <p>If you have any questions, please contact us at 0410 807 546.</p>
                            <p>Best regards,<br><strong>Lakemba Mobile King Team</strong></p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
            }
        } catch (emailError) {
            console.error('Failed to send status update email:', emailError);
            // We don't fail the whole request if email fails, but we might want to log it
        }

        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

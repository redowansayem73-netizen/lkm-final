import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About Us | Lakemba Mobile King | Mobile Repair Shop',
    description: 'Lakemba Mobile King is your trusted local mobile repair shop in Lakemba for cheap mobile repair, iPhone repair, Samsung repair, and professional cell phone repair services.',
    keywords: 'mobile repair shop, lakemba mobile repair shop, cheap mobile repair, phone repair, cell phone repair, professional repair, iphone repair, samsung repair',
};

export default function AboutPage() {
    return <AboutClient />;
}

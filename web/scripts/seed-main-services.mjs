import 'dotenv/config';
import mysql from 'mysql2/promise';

async function main() {
    const conn = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    });

    const services = [
        {
            title: 'Phone Screen Repair',
            slug: 'phone-screen-repair',
            icon: 'Smartphone',
            heroDescription: `Fast & Professional Phone Screen Repairs in Lakemba

Looking for reliable phone screen repair in Lakemba? Our expert technicians provide fast and professional screen replacement for all phone models. Whether you've cracked, damaged, or completely broken your screen, we can fix it quickly and efficiently.

Most phone screens are repaired within 30 minutes, so you can get back to using your device without long waiting times. As Lakemba's leading phone repair specialists, we use high-quality parts and expert techniques to ensure your phone looks and works like new.

Accidentally cracked your phone screen? Don't worry — our friendly team is here to help. Visit us today for quick, affordable, and reliable mobile phone screen repairs in Lakemba.`,
            content: `<h2>Expert Phone Screen Repair Services</h2>
<p>A broken screen can range from a hairline crack to a completely black display. At Lakemba Mobile King, we use premium replacement screens that match original specifications for color, brightness, and touch sensitivity.</p>
<p>Whether you have an iPhone, Samsung, Oppo, or Pixel, our technicians can get your screen looking and working like new on the same day.</p>
<h3>Why Choose Us?</h3>
<ul>
<li>30-minute express screen repairs</li>
<li>High-quality OEM-grade replacement parts</li>
<li>6-month warranty on all screen repairs</li>
<li>Competitive pricing with no hidden fees</li>
<li>Walk-in service — no appointment needed</li>
</ul>`,
            turnaroundTime: 'Most phone screen repairs are completed within 30 minutes.',
            modelsList: JSON.stringify([
                'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max',
                'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13', 'iPhone 12',
                'iPhone 11', 'iPhone SE', 'Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24',
                'Samsung Galaxy S23', 'Samsung Galaxy A54', 'Samsung Galaxy A34',
                'Google Pixel 8 Pro', 'Google Pixel 8', 'OPPO Find X6', 'OPPO A78'
            ]),
            faqData: JSON.stringify([
                { q: "How long does a phone screen repair take?", a: "Most phone screen repairs are completed within 30 minutes. Some complex repairs may take up to 1 hour." },
                { q: "Do you use original parts?", a: "We use high-quality OEM-grade parts that match the original specifications for color, brightness, and touch sensitivity." },
                { q: "Is there a warranty on screen repairs?", a: "Yes, all our screen repairs come with a 6-month warranty covering defects in parts and workmanship." },
                { q: "How much does a phone screen repair cost?", a: "Pricing varies by phone model. Contact us for a free quote — we offer competitive pricing with no hidden fees." },
                { q: "Do I need an appointment?", a: "No appointment needed! We offer walk-in service. Just visit our store in Lakemba during business hours." },
                { q: "Will I lose my data during the repair?", a: "Screen repairs do not affect your data. However, we always recommend backing up your device before any repair as a precaution." }
            ]),
            metaTitle: 'Phone Screen Repair Lakemba | Fast 30-Min Repairs',
            metaDescription: 'Professional phone screen repair in Lakemba. Fast 30-minute screen replacement for iPhone, Samsung & all brands. Quality parts, 6-month warranty. Walk-in today!',
            focusKeyword: 'phone screen repair lakemba',
        },
        {
            title: 'Apple Watch Repairs',
            slug: 'apple-watch-repair',
            icon: 'Watch',
            heroDescription: `Fast & Professional Apple Watch Repairs in Lakemba

Looking for reliable Apple Watch repair in Lakemba? Our expert technicians provide professional repairs for all Apple Watch models. Whether your screen is cracked, battery is draining fast, or your watch has water damage, we can fix it.

We understand your Apple Watch is an essential part of your daily life, and we strive for the fastest possible turnaround without compromising on quality. Our team uses genuine replacement parts to ensure your watch looks and works like new.`,
            content: `<h2>Apple Watch Repair Information</h2>
<p>If you want to fix your Apple Watch, our team at Lakemba Mobile King can help you out in no time. We understand your Apple Watch is an essential part of your daily life, and we strive for the fastest possible turnaround without compromising on quality.</p>
<h3>Our Apple Watch Repair Services</h3>
<ul>
<li>Screen / Glass Replacement</li>
<li>Battery Replacement</li>
<li>Water Damage Repair</li>
<li>Digital Crown Repair</li>
<li>Button Repair</li>
</ul>
<p>We provide free quotes for all Apple Watch repair services. Simply visit our store or call us for an estimate.</p>`,
            turnaroundTime: 'Repair times for Apple Watch are around 1-3 business days.',
            modelsList: JSON.stringify([
                'Apple Watch 1st Gen', 'Apple Watch 2nd Gen', 'Apple Watch 3rd Gen',
                'Apple Watch 4th Gen', 'Apple Watch 5th Gen', 'Apple Watch 6th Gen',
                'Apple Watch 7th Gen', 'Apple Watch 8th Gen', 'Apple Watch 9th Gen',
                'Apple Watch SE', 'Apple Watch Ultra'
            ]),
            faqData: JSON.stringify([
                { q: "What does my repair estimate include?", a: "The repair price estimate includes both replacement parts and labour." },
                { q: "What types of devices do you repair?", a: "We repair all major brands including iPhone, Samsung, OPPO, Google Pixel, and tablets like iPad and Samsung Tab, plus all Apple Watch models." },
                { q: "What if there are more repairs required?", a: "We will always contact you before proceeding with any additional repairs or costs discovered during diagnostic." },
                { q: "When should an Apple Watch battery be replaced?", a: "We recommend replacement when battery health drops below 80% or you experience abrupt shutdowns." },
                { q: "What is a Door to Door Repair?", a: "Our technician comes to your location to perform the repair on-site for your convenience." },
                { q: "Will I lose my data?", a: "While we take every precaution to protect your data, we always recommend making a backup before any repair." }
            ]),
            metaTitle: 'Apple Watch Repair Lakemba | All Models Serviced',
            metaDescription: 'Professional Apple Watch repair in Lakemba. Screen replacement, battery swap & more for all Apple Watch models. Free quotes, expert technicians.',
            focusKeyword: 'apple watch repair lakemba',
        }
    ];

    for (const svc of services) {
        const [existing] = await conn.execute('SELECT id FROM services WHERE slug = ?', [svc.slug]);
        if (existing.length > 0) {
            // Update existing
            await conn.execute(
                `UPDATE services SET title=?, icon=?, hero_description=?, content=?, turnaround_time=?, models_list=?, faq_data=?, meta_title=?, meta_description=?, focus_keyword=?, is_active=1, updated_at=NOW() WHERE slug=?`,
                [svc.title, svc.icon, svc.heroDescription, svc.content, svc.turnaroundTime, svc.modelsList, svc.faqData, svc.metaTitle, svc.metaDescription, svc.focusKeyword, svc.slug]
            );
            console.log(`  ✅ Updated "${svc.title}"`);
        } else {
            await conn.execute(
                `INSERT INTO services (title, slug, icon, hero_description, content, turnaround_time, models_list, faq_data, meta_title, meta_description, focus_keyword, is_active, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
                [svc.title, svc.slug, svc.icon, svc.heroDescription, svc.content, svc.turnaroundTime, svc.modelsList, svc.faqData, svc.metaTitle, svc.metaDescription, svc.focusKeyword]
            );
            console.log(`  ✅ Inserted "${svc.title}"`);
        }
    }

    console.log('\nDone!');
    await conn.end();
}

main().catch(err => { console.error(err); process.exit(1); });

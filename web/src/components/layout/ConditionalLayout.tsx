'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');
    const isCheckoutRoute = pathname?.startsWith('/checkout');

    // Admin and Checkout routes have their own layout, don't show global header/footer
    if (isAdminRoute || isCheckoutRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="min-h-screen bg-white"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
            <Footer />
        </>
    );
}

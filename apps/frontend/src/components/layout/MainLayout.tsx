
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface MainLayoutProps {
    children: React.ReactNode

}
export default function MainLayout({ children }: MainLayoutProps) {

    return (
        <div className="min-h-screen flex flex-col bg-zinc-950">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}





import DefaultLayout from './DefaultLayout';
import React from 'react';
import AppConfig from "@/layout/AppConfig";
interface LandingLayoutProps {
    children: React.ReactNode;
}

export default function LandingLayout({children}: LandingLayoutProps) {
    return <>{children}
        <AppConfig/>
    </>;
}

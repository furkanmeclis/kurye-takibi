import AppConfig from '@/layout/AppConfig';
import React from 'react';
import DefaultLayout from './DefaultLayout';

interface FullPageLayoutProps {
    children: React.ReactNode;
}


export default function FullPageLayout({children}: FullPageLayoutProps) {
    return (
        <>
            {children}
        </>
    );
}

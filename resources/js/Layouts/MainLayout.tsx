import Layout from '@/layout/layout';
import DefaultLayout from '@/Layouts/DefaultLayout';

interface MainLayoutProps {
    children: React.ReactNode;
}


export default function MainLayout({children}: MainLayoutProps) {
    return <>
        <Layout>{children}</Layout>
    </>;
}

import './bootstrap';
import '../css/app.css';

import {createRoot} from 'react-dom/client';
import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import DefaultLayout from '@/Layouts/DefaultLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({el, App, props}) {
        const root = createRoot(el);
        // @ts-ignore
        root.render(<DefaultLayout {...props.initialPage.props}>
            <App {...props} />
        </DefaultLayout>);
    },
    progress: {
        color: '#4B5563',
        showSpinner: true
    },
}).then(r => {
    //document.getElementById('app')?.removeAttribute("data-page")
});

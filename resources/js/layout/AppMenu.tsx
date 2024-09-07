import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: 'Kuryeler',
            icon: 'pi pi-users',
            roles: ['admin'],
            items: [
                {
                    label: 'Yeni Ekle',
                    icon: 'pi pi-fw pi-user-plus',
                    to: route("admin.couriers.create"),
                },
                {
                    label: 'Onay Bekleyenler',
                    icon: 'pi pi-fw pi-clock',
                    to: route("admin.couriers.waitApproval"),
                },
                {
                    label: 'Tüm Kuryeler',
                    icon: 'pi pi-fw pi-users',
                    to: route("admin.couriers.index"),
                }
            ]
        },
        {
            label: 'İşletmeler',
            icon: 'pi pi-shop',
            roles: ['admin'],
            items: [
                {
                    label: 'Yeni Ekle',
                    icon: 'pi pi-fw pi-plus-circle',
                    to: route("admin.businesses.create"),
                },
                {
                    label: 'Onay Bekleyenler',
                    icon: 'pi pi-fw pi-clock',
                    to: route("admin.businesses.waitApproval"),
                },
                {
                    label: 'Tüm İşletmeler',
                    icon: 'pi pi-fw pi-home',
                    to: route("admin.businesses.index"),
                }
            ]
        },
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;

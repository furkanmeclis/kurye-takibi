import AppSubMenu from './AppSubMenu';
import type {MenuModel} from '@/types';

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: "Anasayfa",
            icon: 'pi pi-home',
            roles: ["*"],
            items: [
                {
                    label: 'Anasayfa',
                    icon: 'pi pi-fw pi-home',
                    to: route("dashboard"),
                }
            ]
        },
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
                    label: 'Kuryeler',
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
                    label: 'İşletmeler',
                    icon: 'pi pi-fw pi-home',
                    to: route("admin.businesses.index"),
                }
            ]
        },
        {
            label: "Siparişler",
            icon: "pi pi-shopping-cart",
            roles: ["admin"],
            items: [
                {
                    label: "İptal İşlemleri",
                    icon: "pi pi-fw pi-hourglass",
                    to: route("admin.orders.cancellationRequests")
                }
            ]
        },
        //Businesses Menus
        {
            label: "Müşteriler",
            icon: "pi pi-users",
            roles: ["business"],
            items: [
                {
                    label: "Müşteri Ekle",
                    icon: "pi pi-fw pi-user-plus",
                    to: route("business.customers.create")
                },
                {
                    label: "Müşteriler",
                    icon: "pi pi-fw pi-users",
                    to: route("business.customers.index")
                }
            ]
        },
        {
            label: "Siparişler",
            icon: "pi pi-shopping-cart",
            roles: ["business"],
            items: [
                {
                    label: "Sipariş Ekle",
                    icon: "pi pi-fw pi-cart-plus",
                    to: route("business.orders.create")
                },
                {
                    label: "Siparişler",
                    icon: "pi pi-fw pi-shopping-cart",
                    to: route("business.orders.index")
                }
            ]
        },
        //Courier Menus
        {
            label: "Siparişler",
            icon: "pi pi-shopping-cart",
            roles: ["courier"],
            items: [
                {
                    label: "Yeni Siparişler",
                    icon: "pi pi-fw pi-shopping-cart",
                    to: route("courier.orders.newOrders")
                },
                {
                    label:"Geçmiş Siparişler",
                    icon:"pi pi-fw pi-history",
                    to:route("business.orders.index")
                }
            ]
        },
    ];

    return <AppSubMenu model={model}/>;
};

export default AppMenu;

import { InputText } from 'primereact/inputtext';
import { forwardRef, useContext, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import type { AppTopbarRef } from '@/types';
import { Ripple } from 'primereact/ripple';
import {Link,router} from "@inertiajs/react";
import { StyleClass } from 'primereact/styleclass';
import { classNames } from 'primereact/utils';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { onMenuToggle, layoutConfig, tabs, closeTab,auth } = useContext(LayoutContext);
    const [searchActive, setSearchActive] = useState<boolean | null>(false);

    const pathname = window.location.pathname;
    const menubuttonRef = useRef(null);

    const searchRef = useRef(null);

    const onMenuButtonClick = () => {
        onMenuToggle();
    };

    const activateSearch = () => {
        setSearchActive(true);
        setTimeout(() => {
            const element = document.querySelector('.searchInput');
            (element as HTMLElement)?.focus();
        }, 100);
    };
    const deactivateSearch = () => {
        setSearchActive(false);
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));
    const logo = () => {
        const path = '/layout/images/logo-';
        let logo;
        if (layoutConfig.layoutTheme === 'primaryColor' && layoutConfig.theme !== 'yellow') {
            logo = 'light.png';
        } else {
            logo = layoutConfig.colorScheme === 'light' ? 'dark.png' : 'light.png';
        }
        return path + logo;
    };
    useEffect(() => {
        logo();
    }, []);

    const onCloseTab = (index: number) => {
        if (tabs.length > 1) {
            if (index === tabs?.length - 1) router.visit(tabs?.[tabs.length - 2].to);
            else router.visit(tabs?.[index + 1].to);
        } else {
            router.visit('/');
        }
        closeTab(index);
    };

    return (
        <div className="layout-topbar">
            <Link href={'/'} className="app-logo">
                <img alt="app logo" src={logo()} />
                <span className="app-name">{import.meta.env.VITE_APP_NAME}</span>
            </Link>

            <button ref={menubuttonRef} className="topbar-menubutton p-link" type="button" onClick={onMenuButtonClick}>
                <span></span>
            </button>

            <ul className="topbar-menu">
                {tabs.map((item, i) => {
                    return (
                        <li key={i}>
                            <Link href={item.to} className={classNames({ 'active-route': item.to === pathname })}>
                                <span>{item.label}</span>
                            </Link>
                            <i className="pi pi-times" onClick={() => onCloseTab(i)}></i>
                        </li>
                    );
                })}
                {!tabs || (tabs.length === 0 && <li className="topbar-menu-empty">v1.0</li>)}
            </ul>

            {searchActive === true && (<div
                className={classNames('topbar-search', {
                    'topbar-search-active': searchActive
                })}
            >
                <button className="topbar-searchbutton p-link" onClick={activateSearch}>
                    <i className="pi pi-search"></i>
                </button>

                <div className="search-input-wrapper">
                    <span className="p-input-icon-right">
                        <InputText className="searchInput" type="text" placeholder="Search" onBlur={deactivateSearch} />
                        <i className="pi pi-search"></i>
                    </span>
                </div>
            </div>)}

            <div className="topbar-profile">
                <StyleClass nodeRef={searchRef} selector="@next" enterClassName="hidden" enterActiveClassName="scalein" leaveToClassName="hidden" leaveActiveClassName="fadeout" hideOnOutsideClick>
                    <button ref={searchRef} className="topbar-profile-button p-link" type="button">
                        <img alt="avatar" src="/demo/images/avatar/onyamalimba.png" />
                        <span className="profile-details">
                            <span className="profile-name">{auth?.user?.name}</span>
                            <span className="profile-job">{auth?.user?.role}</span>
                        </span>
                        <i className="pi pi-angle-down"></i>
                    </button>
                </StyleClass>
                <ul className="list-none p-3 m-0 border-round shadow-2 hidden absolute surface-overlay origin-top w-full sm:w-12rem mt-2 right-0 top-auto">
                    <li>
                        <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                            <i className="pi pi-user mr-3"></i>
                            <span>Profil</span>
                            <Ripple />
                        </a>
                        <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                            <i className="pi pi-inbox mr-3"></i>
                            <span>Gelen Kutusu</span>
                            <Ripple />
                        </a>
                        <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                            <i className="pi pi-cog mr-3"></i>
                            <span>Ayarlar</span>
                            <Ripple />
                        </a>
                        <a onClick={() => {
                            window.location.href = route("auth.logout")
                        }} className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                            <i className="pi pi-power-off mr-3"></i>
                            <span>Çıkış Yap</span>
                            <Ripple />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;

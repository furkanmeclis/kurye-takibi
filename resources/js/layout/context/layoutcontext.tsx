'use client';
import {Head, router} from '@inertiajs/react';
import React, {useState} from 'react';
import type {ChildContainerProps, LayoutContextProps, LayoutConfig, LayoutState, Breadcrumb} from '@/types';
import {useLocalStorage} from "primereact/hooks";

export const LayoutContext = React.createContext({} as LayoutContextProps);
export const LayoutProvider = (props: ChildContainerProps) => {
    const [tabs, setTabs] = useState<any>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [layoutConfig, setLayoutConfig] = useLocalStorage<LayoutConfig>({
        ripple: true,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        componentTheme: 'indigo',
        scale: 14,
        theme: 'indigo',
        menuTheme: 'light',
        layoutTheme: 'colorScheme',
        topBarTheme: 'colorScheme'
    },'themeSettings');

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        profileSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        rightMenuActive: false,
        topbarMenuActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false,
        menuProfileActive: false,
        resetMenu: false
    });

    const onMenuProfileToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            menuProfileActive: !prevLayoutState.menuProfileActive
        }));
    };

    const isSidebarActive = () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive || layoutState.overlaySubmenuActive;

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
            }));
        }
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isSlim = () => {
        return layoutConfig.menuMode === 'slim';
    };

    const isSlimPlus = () => {
        return layoutConfig.menuMode === 'slim-plus';
    };

    const isHorizontal = () => {
        return layoutConfig.menuMode === 'horizontal';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };
    const onTopbarMenuToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            topbarMenuActive: !prevLayoutState.topbarMenuActive
        }));
    };
    const showRightSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            rightMenuActive: true
        }));
    };
    const openTab = (value: number) => {
        setTabs((prevTabs: number[]) => [...prevTabs, value]);
    };
    const closeTab = (index: number) => {
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);
    };
    const [authObject, setAuthObject] = useState(props?.auth);
    const [csrfTokenState, setCsrfTokenState] = useState(props?.csrfToken);
    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        isSidebarActive,
        breadcrumbs,
        setBreadcrumbs,
        onMenuProfileToggle,
        onTopbarMenuToggle,
        showRightSidebar,
        tabs,
        closeTab,
        openTab,
        setAuth: setAuthObject,
        setCsrfToken: setCsrfTokenState,
        auth: authObject,
        csrfToken: csrfTokenState
    };

    return (
        <LayoutContext.Provider value={value as any}>
            <>
                {props.children}
            </>
        </LayoutContext.Provider>
    );
};

import React, { ReactNode } from 'react';
import {
    // @ts-ignore
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    ColorScheme,
    MenuProps,
    MenuModel,
    // @ts-ignore
    AppSubMenuProps,
    LayoutConfig,
    LayoutState,
    // @ts-ignore
    AppBreadcrumbState,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    // @ts-ignore
    MenuModelItem,
    AppMenuItemProps,
    UseSubmenuOverlayPositionProps
} from './layout';
import type { Demo, LayoutType, SortOrderType, CustomEvent, ChartDataState, ChartOptionsState, AppMailSidebarItem, AppMailReplyProps, AppMailProps, MailKeys } from './demo';

type ChildContainerProps = {
    children: ReactNode;
    auth?: any;
    csrfToken?: any;
};
type LaravelInertiaProps = {
    auth: object;
    csrfToken: string ;
}
export type {
    LaravelInertiaProps,
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    ColorScheme,
    MenuProps,
    MenuModel,
    MailKeys,
    LayoutConfig,
    LayoutState,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    AppMenuItemProps,
    UseSubmenuOverlayPositionProps,
    ChildContainerProps,
    Demo,
    LayoutType,
    SortOrderType,
    CustomEvent,
    ChartDataState,
    ChartOptionsState,
    AppMailSidebarItem,
    AppMailReplyProps,
    AppMailProps,
};

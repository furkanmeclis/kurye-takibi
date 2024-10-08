import { Tooltip } from 'primereact/tooltip';
import { useContext, useEffect, useRef } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import type { MenuProps, MenuModel, Breadcrumb, BreadcrumbItem } from '@/types';

const AppSubMenu = (props: MenuProps) => {
    const { layoutState, setBreadcrumbs,auth } = useContext(LayoutContext);
    const tooltipRef = useRef<Tooltip | null>(null);

    useEffect(() => {
        if (tooltipRef.current) {
            tooltipRef.current.hide();
            (tooltipRef.current as any).updateTargetEvents();
        }
    }, [layoutState.overlaySubmenuActive]);

    useEffect(() => {
        generateBreadcrumbs(props.model);
    }, []);

    const generateBreadcrumbs = (model: MenuModel[]) => {
        let breadcrumbs: Breadcrumb[] = [];

        const getBreadcrumb = (item: BreadcrumbItem, labels: string[] = []) => {
            const { label, to, items } = item;

            label && labels.push(label);
            items &&
                items.forEach((_item) => {
                    getBreadcrumb(_item, labels.slice());
                });
            to && breadcrumbs.push({ labels, to });
        };

        model.forEach((item) => {
            getBreadcrumb(item);
        });
        setBreadcrumbs(breadcrumbs);
    };
    const getVisibility = (item: MenuModel) => {
        let accesableRoles = item.roles || ["*"];
        if (accesableRoles.includes("*")) {
            return true;
        }
        let userRole = auth?.user?.role;
        if (userRole) {
            return accesableRoles.includes(userRole);
        }
        return false;
    }
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {props.model.map((item, i) => {
                    // @ts-ignore
                    return getVisibility(item) ? !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>: null;
                })}
            </ul>
            <Tooltip ref={tooltipRef} target="li:not(.active-menuitem)>.tooltip-target" />
        </MenuProvider>
    );
};

export default AppSubMenu;

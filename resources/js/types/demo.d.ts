// FullCalendar Types
import { EventApi, EventInput } from '@fullcalendar/core';

// Chart.js Types
import { ChartData, ChartOptions } from 'chart.js';
import BaseFolder = Demo.BaseFolder;

// Custom Types
type InventoryStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
type Status = 'DELIVERED' | 'PENDING' | 'RETURNED' | 'CANCELLED';
type SmallFolder = Omit<BaseFolder, 'icon'> & {
    icon: 'pi pi-folder' | 'pi pi-images' | 'pi pi-folder-open';
};
type LargeFolder = Omit<BaseFolder, 'icon'> & {
    icon: 'pi pi-folder' | 'pi pi-image' | 'pi pi-folder-open';
};
type Icon = 'pi pi-image' | 'pi pi-file-excel' | 'pi pi-file-pdf' | 'pi pi-ellipsis-v' | 'pi pi-folder' | 'pi pi-images' | 'pi pi-folder-open';
type Color = 'bg-yellow-500' | 'bg-pink-500' | 'bg-green-500' | 'bg-indigo-500';
type LightColor = 'bg-yellow-100' | 'bg-pink-100' | 'bg-green-100' | 'bg-indigo-100';
type MailKeys = 'important' | 'starred' | 'trash' | 'spam' | 'archived' | 'sent';

// Exported Types
export type LayoutType = 'list' | 'grid';
export type SortOrderType = 1 | 0 | -1;

// Interfaces
export interface CustomEvent {
    name?: string;
    status?: 'Ordered' | 'Processing' | 'Shipped' | 'Delivered';
    date?: string;
    color?: string;
    icon?: string;
    image?: string;
}

interface ShowOptions {
    severity?: string;
    content?: string;
    summary?: string;
    detail?: string;
    life?: number;
}

export interface ChartDataState {
    barData?: ChartData;
    pieData?: ChartData;
    lineData?: ChartData;
    polarData?: ChartData;
    radarData?: ChartData;
}
export interface ChartOptionsState {
    barOptions?: ChartOptions;
    pieOptions?: ChartOptions;
    lineOptions?: ChartOptions;
    polarOptions?: ChartOptions;
    radarOptions?: ChartOptions;
}

// @ts-ignore
export interface MonthlyDataChart extends ChartOptions<'bar'> {
    animation?: {
        animateScale: boolean;
        animateRotate: boolean;
    };
}

export interface AppMailProps {
    mails: Demo.Mail[];
}

export interface AppMailSidebarItem {
    label: string;
    icon: string;
    to?: string;
    badge?: number;
    badgeValue?: number;
}

export interface AppMailReplyProps {
    content: Demo.Mail | null;
    hide: () => void;
}

// Demo Namespace
declare namespace Demo {
    // Interfaces
    interface Base {
        name: string;
        icon?: Icon;
        objectURL?: string;
    }

    interface IFile extends Base {
        date?: string;
        fileSize?: string;
    }
// @ts-ignore
    interface Metric extends Base {
        title: string;
        icon: 'pi pi-ellipsis-v';
        fieldColor: Color;
        color: LightColor;
        files: string;
        fileSize: string;
    }

    interface BaseFolder extends Base {
        size: string;
    }
    interface Task {
        id?: number;
        name?: string;
        description?: string;
        completed?: boolean;
        status?: string;
        comments?: string;
        attachments?: string;
        members?: Member[];
        startDate?: string;
        endDate?: string;
    }

    interface DailyTask {
        id: number;
        checked: boolean;
        label: string;
        description: string;
        avatar: string;
        borderColor: string;
    }

    interface Member {
        name: string;
        image: string;
    }

    interface TeamMember {
        avatar: string;
        name: string;
        title: string;
        taskCount: number;
        doneCount: number;
        sprintCount: number;
        onProjectsCount: number;
        team: string;
    }

    interface ProjectList {
        id: number;
        title: string;
        totalTasks: number;
        completedTask: number;
    }

    interface Team {
        title: string;
        avatar: string[];
        avatarText?: string;
        badgeClass: string;
    }

    interface DialogConfig {
        visible: boolean;
        header: string;
        newTask: boolean;
    }

    interface Mail {
        id: number;
        from: string;
        to: string;
        email: string;
        image: string;
        title: string;
        message: string;
        date: string;
        important: boolean;
        starred: boolean;
        trash: boolean;
        spam: boolean;
        archived: boolean;
        sent: boolean;
    }

    interface User {
        id: number;
        name: string;
        image: string;
        status: string;
        messages: Message[];
        lastSeen: string;
    }

    interface Message {
        text: string;
        ownerId: number;
        createdAt: number;
    }

    //ProductService
    type Product = {
        id?: string;
        code?: string;
        name: string;
        description: string;
        image?: string;
        price?: number | string;
        category?: string;
        quantity?: number;
        inventoryStatus?: InventoryStatus;
        rating?: number;
        orders?: ProductOrder[];
        colors?: string[];
        [key: string]: string | string[] | number | boolean | undefined | ProductOrder[] | InventoryStatus | File[];
    };

    type ProductOrder = {
        id?: string;
        productCode?: string;
        date?: string;
        amount?: number;
        quantity?: number;
        customer?: string;
        status?: Status;
    };

    type Payment = {
        name: string;
        amount: number;
        paid: boolean;
        date: string;
    };

    //CustomerService
    type Customer = {
        id?: number;
        name?: string;
        country?: string;
        company?: string;
        date: Date;
        status?: string;
        activity?: number;
        balance?: number | string;
        activated?: boolean;
        amount?: number;
        price?: number;
        rating?: number;
        image?: string;
        orders?: Demo.Customer[];
        inventoryStatus?: string;
        representative: {
            name: string;
            image: string;
        };
    };

    // EventService
    interface Event extends EventInput {
        location?: string;
        description?: string;
        tag?: {
            name: string;
            color: string;
        };
    }

    // PhotoService
    type Photo = {
        title: string;
        itemImageSrc?: string | undefined;
        thumbnailImageSrc?: string | undefined;
        alt?: string | undefined;
    };

    type Country = {
        name: string;
        code: string;
    };

    // IconService
    type Icon = {
        icon?: {
            paths?: string[];
            attrs?: [{}];
            isMulticolor?: boolean;
            isMulticolor2?: boolean;
            grid?: number;
            tags?: string[];
        };
        attrs?: [{}];
        properties?: {
            order?: number;
            id: number;
            name: string;
            prevSize?: number;
            code?: number;
        };
        setIdx?: number;
        setId?: number;
        iconIdx?: number;
    };
}

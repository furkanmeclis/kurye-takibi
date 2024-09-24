'use client';
import {LayoutContext, LayoutProvider} from '@/layout/context/layoutcontext';
import {addLocale, locale, PrimeReactProvider} from 'primereact/api';
import '../../css/layout/layout.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import {router} from "@inertiajs/react";
import {useContext, useEffect, useState} from "react";
import AppConfig from "@/layout/AppConfig";
import {ConfirmPopup} from "primereact/confirmpopup";

addLocale('tr', {
    firstDayOfWeek: 1,
    dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
    dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
    dayNamesMin: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
    monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    monthNamesShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
    today: 'Bugün',
    clear: 'Temizle',
    dateFormat: 'dd.mm.yy',
    weekHeader: 'Hafta',
    emptyFilterMessage: 'Eşleşen kayıt bulunamadı',
    emptyMessage: 'Kayıt bulunamadı',
    cancel: 'Vazgeç',
    accept: 'Onayla',
    reject: 'Reddet',
    choose: 'Seç',
    upload: 'Yükle',
    filter: 'Filtrele',
    matchAll: 'Eşleşen tüm öğeler',
    matchAny: 'Eşleşen herhangi bir öğe',
    addRule: 'Kural ekle',
    removeRule: 'Kuralı kaldır',
    contains: 'İçerir',
    notContains: 'İçermez',
    startsWith: 'Başlar',
    endsWith: 'Biter',
    equals: 'Eşit',
    notEquals: 'Eşit Değil',
    lt: 'Küçük',
    lte: 'Küçük veya Eşit',
    noFilter: 'Filtre Yok',
    gt: 'Büyük',
});
locale('tr');
export default function RootLayout({children, auth = {}, csrfToken = ""}: {
    children: React.ReactNode,
    auth?: any,
    csrfToken?: string,
}) {

    return (
        <PrimeReactProvider>
            <LayoutProvider auth={auth} csrfToken={csrfToken}>
                <ConfirmPopup />
                {children}
                <AppConfig/>
            </LayoutProvider>
        </PrimeReactProvider>
    );
}

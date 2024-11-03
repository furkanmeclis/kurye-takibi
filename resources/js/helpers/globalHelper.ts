import {Toast} from "primereact/toast";
import Pusher from "pusher-js";

export const getDetailKeysTranslation = (key: string) => {
    const labelTranslations = {
        "name": "Ad Soyad",
        "phone": "Telefon",
        "email": "Email",
        "address": "Adres",
        "city": "İl",
        "state": "İlçe",
        "zip": "Posta Kodu",
        "country": "Ülke",
        "billing": "Faturalandırma Türü",
        "tax_name": "Vergi Mükellefi Adı",
        "tax_number": "Vergi Numarası",
        "tax_address": "Vergi Adresi",
        "tax_office": "Vergi Aairesi",
        "vehicle_type": "Teslimat Türü",
        "created_at": "Oluşturulma Tarihi",
        "updated_at": "Güncellenme Tarihi",
        "identity": "Kimlik Numarası",
        "birth_date": "Doğum Tarihi",
        "latitude": "Enlem",
        "longitude": "Boylam",
        "sector": "Sektör",
        "businessPhone": "İşletme Telefonu",
    };
    // @ts-ignore
    return labelTranslations[key];
}
export const getRoleTag = (role: any) => {
    let roles = {
        admin: {
            label: "Yönetici",
            severity: "danger"
        },
        business: {
            label: "İşletme",
            severity: "info"
        },
        courier: {
            label: "Kurye",
            severity: "warning"
        }
    }
    // @ts-ignore
    if (roles[role]) {
        // @ts-ignore
        return roles[role];
    }
    return {
        label: role,
        severity: "secondary"
    }
}
export const getOrderStatuses = (status: "draft" | "opened" | "transporting" | "delivered" | "canceled" | "deleted", getAll = false, accepted = true, rejected = false) => {
    // ["draft", "opened", "transporting", "delivered", "canceled", "deleted"]
    let statuses = {
        draft: {
            label: "Taslak",
            severity: "secondary"
        },
        opened: {
            label: "Açık",
            severity: "warning"
        },
        transporting: {
            label: "Taşımada",
            severity: "info"
        },
        delivered: {
            label: "Teslim Edildi",
            severity: "success"
        },
        canceled: {
            label: "İptal Edildi",
            severity: "danger"
        },
        deleted: {
            label: "Silindi",
            severity: "danger"
        }
    }
    if (getAll) {
        return Object.entries(statuses).map(([key, value]) => ({
            value: key,
            label: value.label,
            severity: value.severity
        }));
    }
    if (status === "canceled" && rejected && !accepted) {
        return {
            label: "İptal - Reddedildi",
            severity: "danger"
        }
    }

    if (status === "canceled" && !accepted && !rejected) {
        return {
            label: "İptal - Onay Bekliyor",
            severity: "warning"
        }
    }
    return statuses[status] as { label: string, severity: string };

}
export const getDetailsValueTranslation = (key: string, value: any) => {
    if (key === "billing") {
        return value === "company" ? "Şirket" : "Bireysel";
    }
    if (key === "vehicle_type") {
        if (value === "motorcycle") {
            return "Motosiklet";
        } else if (value === "bicycle") {
            return "Bisiklet";
        } else if (value === "car") {
            return "Araba";
        }
        return value;
    }
    if (key === "created_at" || key === "updated_at") {
        return new Date(value).toLocaleString();
    }
    if (key === "country") {
        if (value === "turkey") {
            return "Türkiye";
        }
        return value;
    }
    return value;

}
export const updateProfile = async (data: any, csrfToken: any) => {
    if (csrfToken) {
        let url = route("profile.update");
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        headers.append("Content-Type", "application/json");
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({...data, _method: "PUT"})
        });
        return await response.json();
    } else {
        return false;
    }

}
export const getLocation = (toast: Toast) => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (error) => {
                console.log(error)
                toast.show({
                    severity: "error",
                    summary: "Hata",
                    detail: "Konum Bilginiz Alınamadı.Lütfen Tarayıcı Ayarlarınızı Kontrol Ediniz."
                });
                reject("Konum Bilgisi Alınamadı");
            });
        } else {
            toast.show({
                severity: "error",
                summary: "Hata",
                detail: "Konum Bilginiz Alınamadı.Lütfen Tarayıcı Ayarlarınızı Kontrol Ediniz."
            });
            reject("Konum Bilgisi Alınamadı");
        }
    });
}
export const getEmergencyStatuses = (key: any, getAll = false) => {
    let statuses = {
        wrongAddress: "Yanlış Adres",
        notInAddress: "Adreste Yok",
        addressMismatch: "Adres Uyuşmaması",
        accident: "Kaza",
        heavyTraffic: "Yoğun Trafik",
        productDamaged: "Ürün Hasar Aldı",
        tireBust: "Lastik Patladı"
    }
    if (getAll) {
        return statuses
    } else {
        // @ts-ignore
        return statuses[key];
    }
}
export const subscribeOrderEventsGlobal = (businessId: any) => {
    let pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });
    pusher.subscribe(`order-channel`).bind(`order-event`, (data: any) => {
        if (data.businessId === businessId) {
            window.dispatchEvent(new CustomEvent("order-event", {detail: data}));
        }
    });
    return () => {
        pusher.unsubscribe(`order-channel`);
    }
}
export const listenOrderEvents = (callback: any) => {
    let listenerCallback = (event: any) => {
        callback(event.detail);
    }
    window.addEventListener("order-event", listenerCallback);
    return () => {
        window.removeEventListener("order-event", listenerCallback);
    }
}
export const getOrderDetails = async (orderId: number, csrfToken: string) => {
    let url = route("getOrderDetails", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}
export const getOrderLocations = async (orderId: number, csrfToken: string) => {
    let url = route("getOrderLocations", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}
export const getSectors = () => {
    return [
        "Restoran",
        "Market",
        "Eczane",
        "Kırtasiye",
        "Çiçekçi",
        "Elektronik",
        "Giyim",
        "Mobilya",
        "Ev ve Bahçe",
        "Hizmet",
        "Otel",
        "Temizlik",
        "Pet Shop",
        "Oto Servis",
        "Kuaför",
        "Eğitim",
        "Kargo",
        "Yemek Dağıtım",
        "Sağlık",
        "Spor ve Fitness",
        "İnşaat Malzemeleri",
        "Büro Malzemeleri",
        "Emlak",
        "Yazılım",
        "Tarım ve Hayvancılık",
        "Toptan Ticaret",
        "Sigorta",
        "Danışmanlık",
        "Medya ve Yayıncılık",
        "Lojistik",
        "Sanayi ve Üretim",
        "Gıda Üretimi",
        "Finans ve Bankacılık",
        "Kimya",
        "Turizm",
        "Mücevher ve Takı",
        "Kitapçı",
        "Oyun ve Eğlence",
        "Optik",
        "Sanat Galerisi",
        "Nakliye",
        "Bahçe ve Peyzaj",
        "Mobilya ve Dekorasyon",
        "Fotoğrafçılık",
        "Sinema ve Tiyatro",
        "Yapı Market",
        "Güzellik ve Kozmetik",
        "Dondurma ve Tatlı",
        "Balıkçı",
        "Bilişim Teknolojileri",
        "Hukuk Bürosu",
        "Mimarlık ve İç Mimarlık",
        "Bireysel Eğitim ve Dershane",
        "Hayvancılık ve Ürünleri",
        "Çocuk Giyim",
        "Kadın Giyim",
        "Erkek Giyim",
        "Saat ve Aksesuar",
        "Turizm Acentası",
        "Veteriner",
        "Küçük Ev Aletleri",
        "Bebek ve Çocuk Ürünleri",
        "Araba Kiralama",
        "Tatil Köyü",
        "Kuruyemiş",
        "Mobilya İmalatı",
        "Ayakkabı ve Çanta",
        "Moda ve Tekstil",
        "Organizasyon",
        "Spor Salonu",
        "Kahve Dükkanı",
        "Atölye",
        "Seramik ve Çömlekçilik",
        "Çikolata ve Şekerleme",
        "Seyahat Acentası",
        "Fırın",
        "Tasarım ve Grafik",
        "İkinci El Mağaza",
        "Antikacılık",
        "Biyoteknoloji",
        "Ambalaj ve Paketleme",
        "Sigorta ve Finans",
        "Motosiklet Aksesuarları",
        "Online Eğitim",
        "Hediye ve Aksesuar",
        "Deniz Ürünleri",
        "Bahçe ve Çiçek Düzenleme",
    ];
}

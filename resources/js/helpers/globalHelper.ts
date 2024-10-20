import {Toast} from "primereact/toast";

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
        "longitude": "Boylam"
    };
    // @ts-ignore
    return labelTranslations[key];
}
export const getOrderStatuses = (status: "draft" | "opened" | "transporting" | "delivered" | "canceled" | "deleted", getAll = false) => {
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

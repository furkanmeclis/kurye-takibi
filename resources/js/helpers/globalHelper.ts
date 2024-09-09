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
    };
    // @ts-ignore
    return labelTranslations[key];
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

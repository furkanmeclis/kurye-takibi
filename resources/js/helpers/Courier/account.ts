export const savePersonalInformation = async (data: any) => {
    let url = route("courier.savePersonalInformation");
    let headers = new Headers();
    let csrfToken = String(document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'));
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });
    return await response.json();
}
export const getPersonalInformation = async () => {
    let url = route("courier.getPersonalInformation");
    let headers = new Headers();
    let csrfToken = String(document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'));
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}

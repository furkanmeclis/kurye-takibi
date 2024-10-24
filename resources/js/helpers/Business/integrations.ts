export const getIntegrations = async (csrfToken: any) => {
    let url = route("business.integrations.getIntegrations");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
    });
    return await response.json();
}
export const saveTrendyolSettings = async (credentials:any,csrfToken: any) => {
    let url = route("business.integrations.saveTrendyolSettings");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(credentials)
    });
    return await response.json();
}
export const saveGetirSettings = async (credentials:any,csrfToken: any) => {
    let url = route("business.integrations.saveGetirSettings");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(credentials)
    });
    return await response.json();
}
export const saveYemeksepetiSettings = async (credentials:any,csrfToken: any) => {
    let url = route("business.integrations.saveYemeksepetiSettings");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(credentials)
    });
    return await response.json();
}

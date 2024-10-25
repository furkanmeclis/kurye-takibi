export const savePersonalInformation = async (data: any, csrfToken: any) => {
    let url = route("business.savePersonalInformation");
    let headers = new Headers();

    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });
    return await response.json();
}
export const getPersonalInformation = async (csrfToken: any) => {
    let url = route("business.getPersonalInformation");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}
export const getBusinessStatics = async (csrfToken: any) => {
    let url = route("business.getStatics");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}

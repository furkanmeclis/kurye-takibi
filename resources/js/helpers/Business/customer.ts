export const getCustomers = async (csrfToken: any) => {
    let url = route("business.customers.listCustomers");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}
export const getCustomer = async (id: any, csrfToken: any) => {
    let url = route("business.customers.getCustomer", id);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();

}
export const storeCustomer = async (data: any, csrfToken: any) => {
    let url = route("business.customers.store");
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
export const updateCustomer = async (id: any, data: any, csrfToken: any) => {
    let url = route("business.customers.update", id);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({...data, _method: "PUT"})
    });
    return await response.json();
}
export const destroyCustomer = async (id: any, csrfToken: any) => {
    let url = route("business.customers.destroy", id);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "DELETE",
        headers: headers
    });
    return await response.json();
}
export const multipleDestroyCustomers = async (ids: number[], csrfToken: any) => {
    if (csrfToken) {
        let url = route("business.customers.multipleDestroy");
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        headers.append("Content-Type", "application/json");
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ids})
        });
        return await response.json();
    } else {
        return false;
    }
}
export const getAdresses = async (customerId: any, csrfToken: any) => {
    let url = route("business.customers.getAdresses", customerId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}
export const storeAdress = async (customerId: any, data: any, csrfToken: any) => {
    let url = route("business.customers.storeAdress", customerId);
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
export const updateAdress = async (addressId: any, data: any, csrfToken: any) => {
    let url = route("business.customers.updateAdress", addressId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({...data, _method: "PUT"})
    });
    return await response.json();
}
export const destroyAddress = async (addressId: any, csrfToken: any) => {
    let url = route("business.customers.destroyAdress", addressId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "DELETE",
        headers: headers
    });
    return await response.json();
}

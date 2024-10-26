export const getCancellationOrders = async (csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.orders.listCancellationRequests");
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        let response = await fetch(url, {
            method: "POST",
            headers: headers
        });
        return await response.json();
    } else {
        return false;
    }
}
export const approveCancellationOrder = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.orders.approveCancellation", id);
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({_method: "PUT"})
        });
        return await response.json();
    } else {
        return false;
    }
}
export const rejectCancellationOrder = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.orders.rejectCancellation", id);
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
        });
        return await response.json();
    } else {
        return false;
    }
}
export const getOrders = async (csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.orders.listOrders");
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        let response = await fetch(url, {
            method: "POST",
            headers: headers
        });
        return await response.json();
    } else {
        return false;
    }
}

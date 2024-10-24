import Pusher from "pusher-js";

export const getOrders = async (csrfToken: any) => {
    let url = route("business.orders.listOrders");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}
export const storeOrder = async (order: any, csrfToken: any) => {
    let url = route("business.orders.store");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(order)
    });
    return await response.json();
}


export const updateOrderStatus = async (orderId: any, status: "opened" | "transporting" | "delivered" | "canceled", csrfToken: any, cancellationReason = "") => {
    if (status === "canceled") {
        if (cancellationReason === "") {
            return Promise.resolve({
                success: false,
                message: "İptal sebebi giriniz."
            });
        } else {
            let url = route("business.orders.updateStatus", orderId);
            let headers = new Headers();
            headers.append("X-CSRF-TOKEN", csrfToken);
            headers.append("Content-Type", "application/json");
            let response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({status, cancellation_reason: cancellationReason, _method: "PUT"})
            });
            return await response.json();
        }
    } else {
        let url = route("business.orders.updateStatus", orderId);
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        headers.append("Content-Type", "application/json");
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({status, _method: "PUT"})
        });
        return await response.json();
    }
}

export const destroyOrder = async (orderId: any, csrfToken: any) => {
    let url = route("business.orders.destroy", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "DELETE",
        headers: headers,
    });
    return await response.json();
}
export const getOrder = async (orderId: any, csrfToken: any) => {
    let url = route("business.orders.getOrder", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
    });
    return await response.json();
}
export const subscribeOrderEvents = (orderId: any, callback: any) => {
    if (import.meta.env.VITE_ALLOW_PUSHER === "false") return;
    let pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });
    return pusher.subscribe(`order-channel`).bind(`update-order-${orderId}`, callback);
}
export const unsubscribeOrderEvents = (orderId: any) => {
    if (import.meta.env.VITE_ALLOW_PUSHER === "false") return;
    let pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });
    return pusher.unsubscribe(`order-channel`);
}
export const subscribeUpdateOrder = (businessId: any, callback: any) => {
    if (import.meta.env.VITE_ALLOW_PUSHER === "false") return;
    let pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });
    return pusher.subscribe(`order-channel`).bind(`update-order-business-${businessId}`, callback);
}

export const subscribeOrderLocationChange = (orderId: any, callback: any, allowAlways = false) => {
    if (import.meta.env.VITE_ALLOW_PUSHER === "false" && !allowAlways) return;
    let pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });
    return pusher.subscribe(`order-channel`).bind(`update-order-location-${orderId}`, callback);
}

export const getLocations = async (orderId: any, csrfToken: any) => {
    let url = route("business.orders.getLocations", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}
export const listTrendyolOrders = async (csrfToken: any) => {
    let url = route("business.orders.listTrendyolOrders");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    let response = await fetch(url, {
        method: "POST",
        headers: headers
    });
    return await response.json();
}

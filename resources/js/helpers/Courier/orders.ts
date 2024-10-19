export const getNearbyNewOrders = async (latitude: any, longitude: any, csrfToken: any, listCount: number | boolean) => {
    let url = route("courier.orders.listNearbyOrders");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let body = {
        latitude: latitude,
        longitude: longitude,
    } as any;
    if (listCount !== false) {
        body.listCount = listCount;
    }
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });
    return await response.json();
}
export const getReviewOrderDetails = async (orderId: any, csrfToken: any) => {
    let url = route("courier.orders.listReviewOrder", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
    });
    return await response.json();
}
export const acceptOrderFromCourier = async (orderId: any, latitude: any, longitude: any, csrfToken: any) => {
    let url = route("courier.orders.acceptOrderFromCourier", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({latitude: latitude, longitude: longitude})
    });
    return await response.json();
}
export const getActiveOrder = async (csrfToken: any, location = null) => {
    let url = route("courier.orders.activeOrder");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let body = {} as any;
    if (location !== null) {
        body = location;
    }
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });
    return await response.json();
}
export const watchPosition = (csrfToken: any, callback: any) => {
    if (navigator.geolocation) {
        return navigator.geolocation.watchPosition((position) => {
            let url = route("courier.orders.updateCourierLocation");
            let headers = new Headers();
            headers.append("X-CSRF-TOKEN", csrfToken);
            headers.append("Content-Type", "application/json");
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            }).then(() => {
                callback(true);
            }).catch(() => {
                callback(false);
            })
        }, (error) => {
            console.log(error)
            callback(false);
        }, {
            enableHighAccuracy: true,
        });
    }
}

export const deliverOrder = async (orderId: any, csrfToken: any) => {
    let url = route("courier.orders.deliverOrder", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
    });
    return await response.json();
}

export const getPastOrders = async (csrfToken: any) => {
    let url = route("courier.orders.listPastOrders");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
    });
    return await response.json();
}
export const emergencyAction = async (orderId: any, reason: any, csrfToken: any) => {
    let url = route("courier.orders.emergencyAction", orderId);
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            reason
        })
    });
    return await response.json();
}

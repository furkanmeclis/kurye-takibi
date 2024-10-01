export const getNearbyNewOrders = async (latitude: any, longitude: any, csrfToken: any) => {
    let url = route("courier.orders.listNearbyOrders");
    let headers = new Headers();
    headers.append("X-CSRF-TOKEN", csrfToken);
    headers.append("Content-Type", "application/json");
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })
    });
    return await response.json();
}

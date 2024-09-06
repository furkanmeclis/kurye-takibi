export const getCouriers = async (type = "all", csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.listCouriers", type);
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

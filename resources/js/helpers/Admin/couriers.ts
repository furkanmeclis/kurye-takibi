export const getCourier = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.showDetails", id);
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

export const getCouriers = async (type: "activated" | "unactivated" | "waitApprovals" | "all", csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.listCouriers", type);
        if (type === "waitApprovals") {
            url = route("admin.couriers.getWaitApprovalCouriers");
        }
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
export const storeCourier = async (data: any, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.store");
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        headers.append("Content-Type", "application/json");
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        return await response.json();
    } else {
        return false;
    }
}
export const updateCourier = async (id: number, data: any, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.update", id);
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
export const destroyCourier = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.destroy", id);
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        let response = await fetch(url, {
            method: "DELETE",
            headers: headers
        });
        return await response.json();
    } else {
        return false;
    }
}
export const multipleDestroyCourier = async (ids: number[], csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.multipleDestroy");
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
export const approveCourier = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.approve", id);
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
export const multipleApproveCourier = async (ids: number[], csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.multipleApprove");
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
export const approveDetails = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.couriers.approveDetails", id);
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

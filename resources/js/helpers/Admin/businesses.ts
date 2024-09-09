export const getBusiness = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.businesses.showDetails", id);
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
export const getBusinesses = async (type: "activated" | "unactivated" | "waitApprovals" | "all", csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.businesses.listBusinesses", type);
        if (type === "waitApprovals") {
            url = route("admin.businesses.getWaitApprovalBusinesses");
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
export const storeBusiness = async (data: any, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.businesses.store");
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
export const updateBusiness = async (id: number, data: any, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.businesses.update", id);
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
export const destroyBusiness = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.businesses.destroy", id);
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
export const multipleDestroyBusiness = async (ids: number[], csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.businesses.multipleDestroy");
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
export const approveBusiness = async (id: number, csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.businesses.approve", id);
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
export const multipleApproveBusiness = async (ids: number[], csrfToken: any) => {
    if (csrfToken) {
        let url = route("admin.businesses.multipleApprove");
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
        let url = route("admin.businesses.approveDetails", id);
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

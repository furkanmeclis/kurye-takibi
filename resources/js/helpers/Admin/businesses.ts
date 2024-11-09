import {Toast} from "primereact/toast";

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
export const exportOrdersReport = async (id: number, startDate: any, endDate: any, exportType: "xlsx" | "pdf", csrfToken: any, toast: Toast,callback:any) => {
    if (csrfToken) {
        let url = route("admin.businesses.exportOrdersReport", id);
        let headers = new Headers();
        headers.append("X-CSRF-TOKEN", csrfToken);
        headers.append("Content-Type", "application/json");

        let body = JSON.stringify({
            startDate,
            endDate,
            exportType
        });

        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        });

        if (response.ok) {
            let blob = await response.blob() as Blob;
            if (exportType === "pdf") {
                let pdfURL = URL.createObjectURL(blob);
                window.open(pdfURL, "_blank");
                toast.show({severity: "success", summary: "Başarılı", detail: "PDF dosyası yeni sekmede açıldı."});
            } else if (exportType === "xlsx") {
                let link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                let fileNameRandom = Math.random().toString(36).substring(7);
                link.download = "Sipariş Çıktısı-"+fileNameRandom+".xlsx";
                link.click();
                toast.show({severity: "success", summary: "Başarılı", detail: "Excel dosyası başarıyla indirildi."});
            }
            callback();
            // @ts-ignore
            URL.revokeObjectURL(blob);
        } else {
            toast.show({severity: "error", summary: "Hata", detail: "Dosya indirilemedi veya açılamadı."});
        }
    } else {
        return false;
    }
};

import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import React, { useEffect, useState} from 'react';
import {Toast} from "primereact/toast";
import {
    getBusinesses,
    approveBusiness as approveBusinessFunc,
    destroyBusiness as destroyBusinessFunc,
    multipleApproveBusiness as multipleApproveBusinessFunc,
    multipleDestroyBusiness as multipleDestroyBusinessFunc
} from "@/helpers/Admin/businesses";
import {DataTable} from "primereact/datatable";
import {Column, ColumnProps} from "primereact/column";
import {Message} from "primereact/message";
import {Toolbar} from "primereact/toolbar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Checkbox} from "primereact/checkbox";
import {useLocalStorage} from "primereact/hooks";
import {confirmPopup} from "primereact/confirmpopup";

const WaitApprovalBusinesses = ({auth, csrfToken}: {
    auth?: any,
    csrfToken?: string
}) => {
    const [loading, setLoading] = useState(true);
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusinesses, setSelectedBusinesses] = useState([] as any[]);
    const [selectedColumns, setSelectedColumns] = useLocalStorage(["name", "email", "phone", "created_at", "actions"], "adminBusinessesWaitApprovalsColumns");
    const [error, setError] = useState(null);
    useEffect(() => {
        getBusinesses("unverified", csrfToken).then(data => {
            if (data.status) {
                setBusinesses(data.businesses);
                setLoading(false);
                setError(null)
            } else {
                setError(data.message);
                setLoading(false);
            }
        }).catch(error => {
            setError(error.message);
            setLoading(false);
        });
    }, []);
    const deleteCourier = (event: any, id: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: "İşletmeyi silmek istediğinize emin misiniz?",
            acceptLabel: "Sil",
            acceptClassName: "p-button-danger",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                destroyBusinessFunc(id, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setBusinesses(businesses.filter((c: any) => c.id !== id));
                            setSelectedBusinesses([]);
                            toast.current?.show({severity: "success", summary: "Başarılı", detail: message});
                        } else {
                            toast.current?.show({severity: "error", summary: "Hata", detail: message});
                        }
                    })
                    .catch(error => {
                        toast.current?.show({severity: "error", summary: "Hata", detail: error.message});
                    })
                    .finally(() => setLoading(false))
            }
        });
    }
    const approveCourier = (event: any, id: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: "İşletme Hesabı Onaylanacaktır. Onaylamak istediğinize emin misiniz?",
            acceptLabel: "Onayla",
            acceptClassName: "p-button-success",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                approveBusinessFunc(id, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setBusinesses(businesses.filter((c: any) => c.id !== id));
                            setSelectedBusinesses([]);
                            toast.current?.show({severity: "success", summary: "Başarılı", detail: message});
                        } else {
                            toast.current?.show({severity: "error", summary: "Hata", detail: message});
                        }
                    })
                    .catch(error => {
                        toast.current?.show({severity: "error", summary: "Hata", detail: error.message});
                    })
                    .finally(() => setLoading(false))
            }
        });
    }
    const multipleApproveCouriers = (event: any, ids: number[]) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Seçilen işletmelerin hesapları onaylanacaktır. Onaylamak istediğinize emin misiniz?",
            acceptLabel: "Onayla" + ` (${ids.length} İşletme)`,
            acceptClassName: "p-button-success",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                multipleApproveBusinessFunc(ids, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setBusinesses(businesses.filter((c: any) => !ids.includes(c.id)));
                            setSelectedBusinesses([]);
                            toast.current?.show({severity: "success", summary: "Başarılı", detail: message});
                        } else {
                            toast.current?.show({severity: "error", summary: "Hata", detail: message});
                        }
                    })
                    .catch(error => {
                        toast.current?.show({severity: "error", summary: "Hata", detail: error.message});
                    })
                    .finally(() => setLoading(false))
            }
        });
    }
    const multipleDestroyCouriers = (event: any, ids: number[]) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Seçilen işletmeler silinecektir. Silmek istediğinize emin misiniz?",
            acceptLabel: "Sil" + ` (${ids.length} İşletme)`,
            acceptClassName: "p-button-danger",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                multipleDestroyBusinessFunc(ids, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setBusinesses(businesses.filter((c: any) => !ids.includes(c.id)));
                            setSelectedBusinesses([]);
                            toast.current?.show({severity: "success", summary: "Başarılı", detail: message});
                        } else {
                            toast.current?.show({severity: "error", summary: "Hata", detail: message});
                        }
                    })
                    .catch(error => {
                        toast.current?.show({severity: "error", summary: "Hata", detail: error.message});
                    })
                    .finally(() => setLoading(false))
            }
        });
    }
    let columns: ColumnProps[] = [
        {
            selectionMode: "multiple",
            headerStyle: {width: '3rem'},
            header: ""
        },
        {
            field: "name",
            header: "Ad Soyad (İşletme Sahibi)",
            hidden: !selectedColumns.includes("name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Ad'a Göre",
        }, {
            field: "email",
            header: "Email Adresi",
            hidden: !selectedColumns.includes("email"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Email'e Göre",
        }, {
            field: "phone",
            header: "Telefon Numarası",
            hidden: !selectedColumns.includes("phone"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Telefon Numarası'na Göre",
        },
        {
            field: "created_at",
            header: "Kayıt Tarihi",
            hidden: !selectedColumns.includes("created_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Kayıt Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return <span>{new Date(rowData.created_at).toLocaleString()}</span>
            }
        },
        {
            field: "updated_at",
            header: "Güncelleme Tarihi",
            hidden: !selectedColumns.includes("updated_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Güncellenme Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return <span>{new Date(rowData.updated_at).toLocaleString()}</span>
            }
        },
        {
            field: "actions",
            header: "İşlemler",
            hidden: !selectedColumns.includes("actions"),
            body: (rowData: any) => {
                return <div className={"flex gap-2"}>
                    <Button size={"small"} icon={"pi pi-check-circle"} severity={"success"} tooltip={"Onayla"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={(event) => {
                                approveCourier(event, rowData.id);
                            }}
                    /><Button size={"small"} icon={"pi pi-pencil"} severity={"warning"} tooltip={"Düzenle"}
                              tooltipOptions={{
                                  position: "top"
                              }}
                              onClick={(event) => {
                                  router.visit(route("admin.businesses.edit", {id: rowData.id}))
                              }}
                />
                    <Button size={"small"} icon={"pi pi-trash"} severity={"danger"} tooltip={"Sil"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={(event) => {
                                deleteCourier(event, rowData.id);
                            }}
                    />
                </div>
            }
        }
    ];
    const columnsRef = React.useRef<OverlayPanel>(null);
    const renderHeader = () => {
        return <>
            <Toolbar
                start={selectedBusinesses.length > 0 && <>
                    <Button size={"small"} icon={"pi pi-check-circle"} className={"mr-2"}
                            tooltip={"Toplu Onay Yapmanızı Sağlar"} tooltipOptions={{
                        position: "top"
                    }} label={"Onayla (" + selectedBusinesses.length + ")"} severity={"success"}
                            onClick={(event) => {
                                multipleApproveCouriers(event, selectedBusinesses.map((c) => c.id));
                            }}
                    />
                    <Button size={"small"} icon={"pi pi-trash"} className={"mr-2"}
                            tooltip={"Seçilen İşletmeleri Silmenizi Sağlar"} tooltipOptions={{
                        position: "top"
                    }} label={"Sil (" + selectedBusinesses.length + ")"} severity={"danger"}
                            onClick={(event) => {
                                multipleDestroyCouriers(event, selectedBusinesses.map((c) => c.id));
                            }}
                    />
                    <Button size={"small"} icon={"pi pi-filter-slash"} label={"Seçimi Temizle"} severity={"warning"}
                            onClick={() => setSelectedBusinesses([])}/>
                </>}

                end={<>
                    <Button icon={"pi pi-bars"} onClick={(event) => {
                        columnsRef.current?.toggle(event)
                    }}/>
                </>}/>
        </>
    }
    const toast = React.useRef<Toast>(null);
    return <PageContainer auth={auth} csrfToken={csrfToken}>
        <MainLayout>
            <Head title="Onay Bekleyen İşletmeler"/>
            <Toast ref={toast}/>
            <OverlayPanel ref={columnsRef} showCloseIcon style={{width: '300px'}}>
                <div className="flex align-items-center justify-content-start mb-3">
                    <span className="text-900 text-lg font-bold">Sütunlar ({selectedColumns.length})</span>
                </div>
                <div className="flex flex-column justify-content-center gap-2">
                    {columns.map((col, index) => {
                        if (col.selectionMode === "multiple") return null;
                        let header = col.header as string;
                        let field = col.field as string;
                        return <div className="flex align-items-center" key={index}>
                            <Checkbox
                                inputId={`column${index}`}
                                checked={selectedColumns.includes(field)}
                                onChange={(e) => {
                                    if (e.checked) {
                                        setSelectedColumns([...selectedColumns, field])
                                    } else {
                                        setSelectedColumns(selectedColumns.filter((c) => c !== field))
                                    }
                                }}
                            />
                            <label htmlFor={`column${index}`} className="ml-2">{header}</label>
                        </div>
                    })}
                </div>
            </OverlayPanel>
            <div className="card">
                <span className="text-900 text-xl font-bold mb-4 block">Onay Bekleyen İşletmeler</span>
                {error !== null &&
                    <Message
                        className="w-full"
                        severity="error"
                        text={error}
                    />
                }
                {!loading && businesses.length === 0 && <Message
                    className={"w-full"}
                    severity="info" text={"Onay bekleyen işletme bulunamadı."}
                />}
                <DataTable
                    hidden={!loading && businesses.length === 0 || error !== null}
                    loading={loading}
                    value={businesses}
                    removableSort paginator
                    filterDisplay="row"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    rowsPerPageOptions={[5, 10, 25, 50]} rows={10}
                    dataKey="id"
                    header={renderHeader}
                    filters={{
                        name: {value: null, matchMode: 'contains'},
                        email: {value: null, matchMode: 'contains'},
                        phone: {value: null, matchMode: 'contains'},
                        created_at: {value: null, matchMode: 'contains'},
                        updated_at: {value: null, matchMode: 'contains'},
                    }}
                    emptyMessage="İşletme bulunamadı."
                    currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                    selectionMode={"checkbox"}
                    selection={selectedBusinesses}
                    onSelectionChange={(e) => setSelectedBusinesses(e.value)}
                >
                    {columns.map((col, index) => {
                        return <Column key={index} {...col} />
                    })}
                </DataTable>
            </div>
        </MainLayout>
    </PageContainer>
}
export default WaitApprovalBusinesses;

import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import React, {useEffect, useState} from 'react';
import {Toast} from "primereact/toast";
import {getCustomers, destroyCustomer, multipleDestroyCustomers} from "@/helpers/Business/customer";
import {DataTable} from "primereact/datatable";
import {Column, ColumnProps} from "primereact/column";
import {Message} from "primereact/message";
import {Toolbar} from "primereact/toolbar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Checkbox} from "primereact/checkbox";
import {useLocalStorage} from "primereact/hooks";
import {confirmPopup} from "primereact/confirmpopup";

interface PageProps {
    auth?: any,
    csrfToken?: string,
    flash?: {
        message?: string,
        type?: string,
        title?: string
    }
}

const AllCustomersPage = ({auth, csrfToken, flash}: PageProps) => {
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([] as any[]);
    const [selectedColumns, setSelectedColumns] = useLocalStorage(["name", "phone", "note","created_at", "actions"], "businessCustomersTableColumns");
    const [error, setError] = useState(null);
    const getCustomersData = () => {
        setLoading(true);
        getCustomers(csrfToken).then(data => {
            if (data.status) {
                setCustomers(data.customers);
                setLoading(false);
                setError(null);
            } else {
                setError(data.message);
                setLoading(false);
            }
        }).catch(error => {
            setError(error.message);
            setLoading(false);
        }).finally(() => setLoading(false))
    }
    useEffect(() => {
        getCustomersData();
        if (flash?.message) {
            // @ts-ignore
            toast.current?.show({severity: flash?.type ?? "info", summary: flash.title, detail: flash.message ?? ""});
        }
    }, []);
    const deleteCustomer = (event: any, id: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Müşteriyi silmek istediğinize emin misiniz?",
            acceptLabel: "Sil",
            acceptClassName: "p-button-danger",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                destroyCustomer(id, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setCustomers(customers.filter((c: any) => c.id !== id));
                            setSelectedCustomers([]);
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
    const multipleDeleteCustomers = (event: any, ids: number[]) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Seçilen Müşteriler silinecektir. Silmek istediğinize emin misiniz?",
            acceptLabel: "Sil" + ` (${ids.length} Müşteri)`,
            acceptClassName: "p-button-danger",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                multipleDestroyCustomers(ids, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setCustomers(customers.filter((c: any) => !ids.includes(c.id)));
                            setSelectedCustomers([]);
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
            header: "Müşteri Adı",
            hidden: !selectedColumns.includes("name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Ad'a Göre",
        }, {
            field: "phone",
            header: "Telefon Numarası",
            hidden: !selectedColumns.includes("phone"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Telefon Numarası'na Göre",
        },
        {
            field: "note",
            header: "Not(Sadece İşletme Görebilir)",
            hidden: !selectedColumns.includes("note"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Not'a Göre",
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
                    <Button
                        size={"small"}
                        icon={"pi pi-map-marker"}
                        severity={"info"}
                        tooltip={"Adresler"}
                        tooltipOptions={{
                            position: "top"
                        }}
                        onClick={() => {
                            router.visit(route("business.customers.edit", {id: rowData.id}))
                        }}
                    />
                    <Button
                        size={"small"}
                        icon={"pi pi-pencil"}
                        severity={"warning"}
                        tooltip={"Düzenle"}
                        tooltipOptions={{
                            position: "top"
                        }}
                        onClick={() => {
                            router.visit(route("business.customers.edit", {id: rowData.id}))
                        }}
                    />
                    <Button
                        size={"small"}
                        icon={"pi pi-trash"}
                        severity={"danger"}
                        tooltip={"Sil"}
                        tooltipOptions={{
                            position: "top"
                        }}
                        onClick={(event) => {
                            deleteCustomer(event, rowData.id);
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
                start={selectedCustomers.length > 0 && <>
                    <Button size={"small"} icon={"pi pi-trash"} className={"mr-2"}
                            tooltip={"Seçilen Müşterileri Silmenizi Sağlar"} tooltipOptions={{
                        position: "top"
                    }} label={"Sil (" + selectedCustomers.length + ")"} severity={"danger"}
                            onClick={(event) => {
                                multipleDeleteCustomers(event, selectedCustomers.map((c) => c.id));
                            }}
                    />
                    <Button size={"small"} icon={"pi pi-filter-slash"} label={"Seçimi Temizle"} severity={"warning"}
                            onClick={() => setSelectedCustomers([])}/>
                </>}

                end={<>
                    <Button size={"small"} icon={"pi pi-sync"} severity={"help"} className={"mr-2"}
                            tooltip={"Verileri Yenile"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                getCustomersData();
                            }}
                    />
                    <Button size={"small"} icon={"pi pi-bars"} onClick={(event) => {
                        columnsRef.current?.toggle(event)
                    }}/>
                </>}/>
        </>
    }
    const toast = React.useRef<Toast>(null);
    return <PageContainer auth={auth} csrfToken={csrfToken}>
        <MainLayout>
            <Head title="Müşteriler"/>
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
                <span className="text-900 text-xl font-bold mb-4 block">Müşteriler</span>
                {error !== null &&
                    <Message
                        className="w-full"
                        severity="error"
                        text={error}
                    />
                }
                {!loading && customers.length === 0 && <Message
                    className={"w-full"}
                    severity="info" text={"Müşteri bulunamadı."}
                />}
                <DataTable
                    hidden={!loading && customers.length === 0 || error !== null}
                    loading={loading}
                    value={customers}
                    removableSort paginator
                    filterDisplay="row"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    rowsPerPageOptions={[5, 10, 25, 50]} rows={10}
                    dataKey="id"
                    header={renderHeader}
                    filters={{
                        name: {value: null, matchMode: 'contains'},
                        phone: {value: null, matchMode: 'contains'},
                        created_at: {value: null, matchMode: 'contains'},
                        updated_at: {value: null, matchMode: 'contains'},
                        note: {value: null, matchMode: 'contains'},
                    }}
                    emptyMessage="Müşteri bulunamadı."
                    currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                    selectionMode={"checkbox"}
                    selection={selectedCustomers}
                    onSelectionChange={(e) => setSelectedCustomers(e.value)}
                >
                    {columns.map((col, index) => {
                        return <Column key={index} {...col} />
                    })}
                </DataTable>
            </div>
        </MainLayout>
    </PageContainer>
}
export default AllCustomersPage;

import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import React, {useEffect, useState} from 'react';
import {Toast} from "primereact/toast";
import {DataTable} from "primereact/datatable";
import {Column, ColumnProps} from "primereact/column";
import {Message} from "primereact/message";
import {Toolbar} from "primereact/toolbar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Checkbox} from "primereact/checkbox";
import {useLocalStorage} from "primereact/hooks";
import {confirmPopup} from "primereact/confirmpopup";
import {TriStateCheckbox} from "primereact/tristatecheckbox";
import {classNames} from "primereact/utils";
import {getCancellationOrders, approveCancellationOrder} from "@/helpers/Admin/orders";
import {Dropdown} from "primereact/dropdown";

interface AllCouriersProps {
    auth?: any,
    csrfToken?: string,
    flash?: {
        message?: string,
        type?: string,
        title?: string
    }
}

const CancellationRequestsPage = ({auth, csrfToken, flash}: AllCouriersProps) => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([] as any[]);
    const [selectedColumns, setSelectedColumns] = useLocalStorage(["name", "email", "phone", "created_at", "actions"], "adminOrdersCancellationColumns");
    const [error, setError] = useState(null);
    const cancelReasonOP = React.useRef<OverlayPanel>(null);
    const [cancelReason, setCancelReason] = useState("");
    const getCancellationOrdersData = () => {
        setLoading(true);
        getCancellationOrders(csrfToken).then(data => {
            if (data.status) {
                setOrders(data.orders.map((order: any) => {
                    return {
                        ...order,
                        cancellation_accepted: order.cancellation_accepted === 1,
                    }
                }));
                setLoading(false);
                setError(null)
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
        getCancellationOrdersData();
        if (flash?.message) {
            // @ts-ignore
            toast.current?.show({severity: flash?.type ?? "info", summary: flash.title, detail: flash.message ?? ""});
        }
    }, []);
    const approveCancellationRequestOrder = (event: any, id: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Sipariş İptalini Onaylamak İstediğinize Emin Misiniz?",
            acceptLabel: "Onayla",
            acceptClassName: "p-button-success",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                approveCancellationOrder(id, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            getCancellationOrdersData();
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
            field: "business.name",
            header: "Ad(İşletme)",
            hidden: !selectedColumns.includes("business.name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Ad(İşletme)'a Göre",
        },
        {
            field: "business.phone",
            header: "İşletme Telefon Numarası",
            hidden: !selectedColumns.includes("business.phone"),
            sortable: true,
            filter: true,
            filterPlaceholder: "İşletme Telefon Numarası'na Göre",
        },
        {
            field: "customer.name",
            header: "Ad(Müşteri)",
            hidden: !selectedColumns.includes("customer.name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Ad(Müşteri)'a Göre",
        },
        {
            field: "customer.phone",
            header: "Müşteri Telefon Numarası",
            hidden: !selectedColumns.includes("customer.phone"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Müşteri Telefon Numarası'na Göre",
        },
        {
            field: "courier.name",
            header: "Ad(Kurye)",
            hidden: !selectedColumns.includes("courier.name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Ad(Kurye)'a Göre",
            body: (rowData: any) => {
                return <span>{rowData.courier ? rowData.courier.name :
                    <span><i className={"pi pi-exclamation-circle text-red-400"}></i> Kurye Atanmamış</span>}</span>
            }
        },
        {
            field: "courier.phone",
            header: "Kurye Telefon Numarası",
            hidden: !selectedColumns.includes("courier.phone"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Kurye Telefon Numarası'na Göre",
            body: (rowData: any) => {
                return <span>{rowData.courier ? rowData.courier.phone :
                    <span><i className={"pi pi-exclamation-circle text-red-400"}></i> Kurye Atanmamış</span>}</span>
            }
        },
        {
            field: "price",
            header: "Paket Ücreti",
            hidden: !selectedColumns.includes("price"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Fiyata'a Göre",
            body: (rowData: any) => {
                return <span>{rowData.price} ₺</span>
            }
        },
        {
            field: "cancellation_accepted",
            header: "İptal Durumu",
            hidden: !selectedColumns.includes("cancellation_accepted"),
            sortable: true,
            filter: true,
            dataType: "boolean",
            filterElement: (options) => {
                return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)}/>;
            },
            body: (rowData) => {
                return <span><i className={classNames('pi', {
                    'pi-check-circle text-green-400': rowData.cancellation_accepted,
                    'pi-times-circle text-red-400': !rowData.cancellation_accepted
                })}></i> {rowData.cancellation_accepted ? "Onaylandı" : "Onay Bekliyor"}

                </span>;
            }
        },
        {
            field: "cancellation_accepted_by.name",
            header: "İptali Onaylayan Yetkili",
            hidden: !selectedColumns.includes("cancellation_accepted_by.name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "İptali Onaylayan Yetkili'ye Göre",
            body: (rowData: any) => {
                return <span>{rowData.cancellation_accepted_by ? rowData.cancellation_accepted_by.name :
                    <span><i className={"pi pi-exclamation-circle text-red-400"}></i> Onay Bekliyor</span>}</span>
            }
        },
        {
            field: "cancellation_reason",
            header: "İptal Nedeni",
            hidden: !selectedColumns.includes("cancellation_reason"),
            sortable: true,
            filter: true,
            filterPlaceholder: "İptal Nedeni'ne Göre",
            body: (rowData: any) => {
                return <span
                    className={"cursor-pointer"}
                    onMouseEnter={(e) => {
                        setCancelReason(rowData.cancellation_reason);
                        cancelReasonOP.current?.toggle(e);
                    }}
                    onMouseLeave={() => {
                        setCancelReason("")
                        cancelReasonOP.current?.hide();
                    }}
                >{String(rowData.cancellation_reason).substring(0, 20)}{String(rowData.cancellation_reason).length > 20 && "..."}</span>
            }
        },
        {
            field: "cancellation_requested_by",
            header: "İptal Talep Eden",
            hidden: !selectedColumns.includes("cancellation_requested_by"),
            sortable: true,
            filter: true,
            filterElement: (options) => {
                return <Dropdown value={options.value} options={[
                    {label: "Kurye", value: "courier"},
                    {label: "İşletme", value: "business"}
                ]} onChange={(e) => options.filterApplyCallback(e.value)} placeholder={"İptal Talep Eden"}/>
            },
            body: (rowData: any) => {
                return <span>{rowData.cancellation_requested_by === "courier" ? "Kurye" : "İşletme"}</span>
            }
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
            field: "courier_accepted_at",
            header: "Kurye Teslim Alma Tarihi",
            hidden: !selectedColumns.includes("courier_accepted_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Kurye Teslim Alma Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return rowData.courier_accepted_at ?
                    <span>{new Date(rowData.courier_accepted_at).toLocaleString()}</span> :
                    <span><i className={"pi pi-ban text-red-400"}></i> Teslim Alınmadı</span>
            }
        },
        {
            field: "delivered_at",
            header: "Teslim Tarihi",
            hidden: !selectedColumns.includes("delivered_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Teslim Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return rowData.delivered_at ?
                    <span>{new Date(rowData.delivered_at).toLocaleString()}</span> :
                    <span><i className={"pi pi-ban text-red-400"}></i> Teslim Edilmedi</span>
            }
        },
        {
            field: "canceled_at",
            header: "İptal Tarihi",
            hidden: !selectedColumns.includes("canceled_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Aktifleştirme Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return <span>{rowData.canceled_at === null ?
                    <i className={"pi pi-times-circle text-red-400"}></i> : new Date(rowData.canceled_at).toLocaleString()}</span>
            }
        },

        {
            field: "actions",
            header: "İşlemler",
            hidden: !selectedColumns.includes("actions"),
            body: (rowData: any) => {
                return <div className={"flex gap-2"}>
                    <Button visible={!rowData.cancellation_accepted} size={"small"} icon={"pi pi-check-circle"} severity={"success"}
                            tooltip={"İptali Onayla"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={(event) => {
                                approveCancellationRequestOrder(event, rowData.id);
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
                end={<>
                    <Button size={"small"} icon={"pi pi-sync"} severity={"help"} className={"mr-2"}
                            tooltip={"Verileri Yenile"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                getCancellationOrdersData();
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
            <Head title="İptal Edilen Siparişler"/>
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
            <OverlayPanel ref={cancelReasonOP} style={{width: '300px'}}>
                <p>
                    {cancelReason}
                </p>
            </OverlayPanel>
            <div className="card">
                <span className="text-900 text-xl font-bold mb-4 block">İptal Edilen Siparişler</span>
                {error !== null &&
                    <Message
                        className="w-full"
                        severity="error"
                        text={error}
                    />
                }
                {!loading && orders.length === 0 && <Message
                    className={"w-full"}
                    severity="info" text={"Sipariş bulunamadı."}
                />}
                <DataTable
                    hidden={!loading && orders.length === 0 || error !== null}
                    loading={loading}
                    value={orders}
                    removableSort paginator
                    filterDisplay="row"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    rowsPerPageOptions={[5, 10, 25, 50]} rows={10}
                    dataKey="id"
                    header={renderHeader}
                    filters={{
                        "customer.name": {value: null, matchMode: "contains"},
                        "customer.phone": {value: null, matchMode: "contains"},
                        "business.name": {value: null, matchMode: "contains"},
                        "business.phone": {value: null, matchMode: "contains"},
                        "courier.name": {value: null, matchMode: "contains"},
                        "courier.phone": {value: null, matchMode: "contains"},
                        "cancellation_accepted": {value: null, matchMode: "equals"},
                        "cancellation_reason": {value: null, matchMode: "contains"},
                        "cancellation_requested_by": {value: null, matchMode: "equals"},
                        "created_at": {value: null, matchMode: "contains"},
                        "updated_at": {value: null, matchMode: "contains"},
                        "courier_accepted_at": {value: null, matchMode: "contains"},
                        "delivered_at": {value: null, matchMode: "contains"},
                        "canceled_at": {value: null, matchMode: "contains"},
                        "price": {value: null, matchMode: "contains"},
                    }}
                    emptyMessage="Sipariş bulunamadı."
                    currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                >
                    {columns.map((col, index) => {
                        return <Column key={index} {...col} />
                    })}
                </DataTable>
            </div>
        </MainLayout>
    </PageContainer>
}
export default CancellationRequestsPage;

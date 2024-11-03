import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import React, {useEffect, useRef, useState} from 'react';
import {Toast} from "primereact/toast";
import OrderShowPage from "@/components/OrderShow";
import {DataTable} from "primereact/datatable";
import {Column, ColumnProps} from "primereact/column";
import {Message} from "primereact/message";
import {Toolbar} from "primereact/toolbar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Checkbox} from "primereact/checkbox";
import {useLocalStorage} from "primereact/hooks";
import {
    getOrders
} from "@/helpers/Admin/orders";
import {getOrderStatuses} from "@/helpers/globalHelper"
import {Tag} from "primereact/tag";
import {Dropdown} from "primereact/dropdown";
import {TriStateCheckbox} from "primereact/tristatecheckbox";
import {classNames} from "primereact/utils";
import trendyolSvg from "@/icons/trendyol.svg";
import yemeksepetiSvg from "@/icons/yemeksepeti.svg";
import getirSvg from "@/icons/getir.svg";

interface AllCouriersProps {
    auth?: any,
    csrfToken?: string,
    flash?: {
        message?: string,
        type?: string,
        title?: string
    }
}

const AllOrdersPage = ({auth, csrfToken, flash}: AllCouriersProps) => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [selectedColumns, setSelectedColumns] = useLocalStorage(["name", "phone", "created_at", "actions"], "BusinessesOrdersAllTableColumns");
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const businessOp = useRef<OverlayPanel>(null);
    const customerOp = useRef<OverlayPanel>(null);
    const [cacheBusiness, setCacheBusiness] = useState(null);
    const [cacheCustomer, setCacheCustomer] = useState(null);
    const getOrdersAll = () => {
        setLoading(true);
        getOrders(csrfToken).then(data => {
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

        getOrdersAll();
        if (flash?.message) {
            // @ts-ignore
            toast.current?.show({severity: flash?.type ?? "info", summary: flash.title, detail: flash.message ?? ""});
        }
    }, []);

    let columns: ColumnProps[] = [
        {
            expander: true,
            style: {width: '3rem'},
        },
        {
            field: "id",
            header: "Sipariş ID",
            hidden: !selectedColumns.includes("id"),
        },
        {
            field: "customer.name",
            header: "Müşteri",
            hidden: !selectedColumns.includes("customer.name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Ad'a Göre",
            body: (rowData: any) => {
                return <Button label={rowData.customer.name} link size={"small"} severity={"info"} onClick={(event) => {
                    setCacheCustomer(rowData);
                    customerOp.current?.toggle(event)
                }}/>
            }
        },
        {
            field: "business.name",
            header: "İşletme",
            hidden: !selectedColumns.includes("business.name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "İşletmeye'a Göre",
            body: (rowData: any) => {
                return <Button label={rowData.business.name} link size={"small"} severity={"help"} onClick={(event) => {
                    setCacheBusiness(rowData.business);
                    businessOp.current?.toggle(event)
                }}/>
            }
        },
        {
            field: "customer_note",
            header: "Sipariş Notu",
            hidden: !selectedColumns.includes("customer_note"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Sipariş Notu'na Göre",
            body: (rowData: any) => {
                return rowData.customer_note ?
                    <span>{rowData.customer_note}</span> :
                    <span><i className={"pi pi-ban text-red-400"}></i></span>
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
            field: "marketplace",
            header: "Sipariş Kaynağı",
            hidden: !selectedColumns.includes("marketplace"),
            sortable: true,
            body: (rowData: any) => {
                return <span>{rowData.marketplace === "trendyol" ? <img src={trendyolSvg} alt={"Trendyol"}/> :
                    <i className={"pi pi-home"}></i>}</span>
            }
        },
        {
            field: "status",
            header: "Sipariş Durumu",
            hidden: !selectedColumns.includes("status"),
            sortable: true,
            filter: true,
            filterElement: (options: any) => {
                // @ts-ignore
                return <Dropdown options={getOrderStatuses("draft", true)}
                                 value={options.value}
                                 filter
                                 filterBy={"label,value"}
                                 onChange={(e) => options.filterApplyCallback(e.value)}
                                 itemTemplate={(option) => <Tag value={option.label} severity={option.severity}/>}
                                 placeholder="Sipariş Durumu"
                                 className="p-column-filter w-full"
                                 showClear
                />
            },
            body: (rowData: any) => {
                return <Tag
                    // @ts-ignore
                    value={String(getOrderStatuses(rowData.status, false, rowData.cancellation_accepted === 1, rowData.cancellation_rejected === 1).label)}
                    // @ts-ignore
                    severity={String(getOrderStatuses(rowData.status, false, rowData.cancellation_accepted === 1, rowData.cancellation_rejected === 1).severity)}
                />
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
            field: "cancellation_accepted",
            header: "İptal Onayı",
            hidden: !selectedColumns.includes("cancellation_accepted"),
            sortable: true,
            filter: true,
            dataType: "boolean",
            filterElement: (options) => {
                return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)}/>;
            },
            body: (rowData) => {
                return <i className={classNames('pi', {
                    'pi-check-circle text-green-400': rowData.cancellation_accepted && rowData.status === "canceled",
                    'pi-times-circle text-red-400': !rowData.cancellation_accepted && rowData.status === "canceled" && rowData.cancellation_rejected,
                    'pi-hourglass text-yellow-400': rowData.status === "canceled" && !rowData.cancellation_rejected && !rowData.cancellation_accepted,
                })}></i>;
            }
        },
        {
            field: "canceled_at",
            header: "İptal Tarihi",
            hidden: !selectedColumns.includes("canceled_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "İptal Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return rowData.canceled_at ?
                    <span>{new Date(rowData.canceled_at).toLocaleString()}</span> :
                    <span><i className={"pi pi-ban text-red-400"}></i> İptal Edilmedi</span>
            }
        },
        {
            field: "created_at",
            header: "Eklenme Tarihi",
            hidden: !selectedColumns.includes("created_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Eklenme Tarihine Göre",
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
        }
    ];
    const columnsRef = useRef<OverlayPanel>(null);
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
                                getOrdersAll();
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
            <Head title="Siparişler"/>
            <Toast ref={toast}/>
            <OverlayPanel ref={columnsRef} showCloseIcon style={{width: '300px'}}>
                <div className="flex align-items-center justify-content-start mb-3">
                    <span className="text-900 text-lg font-bold">Sütunlar ({selectedColumns.length})</span>
                </div>
                <div className="flex flex-column justify-content-center gap-2">
                    {columns.map((col, index) => {
                        if (col.selectionMode === "multiple" || col?.expander !== undefined) return null;
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
            <OverlayPanel ref={businessOp} showCloseIcon style={{width: 300}}>
                {cacheBusiness !== null && <>
                    <ul className={"m-0 px-3 list-none"}>
                        <li>İşletme Adı: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheBusiness?.name}</span></li>
                        <li>İşletme Telefon No: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheBusiness?.phone}</span></li>
                        <li>İşletme İl: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheBusiness?.details?.city}</span></li>
                        <li>İşletme İlçe: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheBusiness?.details?.state}</span></li>
                        <li>İşletme Adres: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheBusiness?.details?.address}</span>
                        </li>
                    </ul>
                    <Button
                        label={"Google Maps'te Aç"}
                        size={"small"}
                        icon={"pi pi-external-link"}
                        severity={"help"}
                        className={"w-full mt-2"}
                        onClick={() => {
                            // @ts-ignore
                            window.open(`https://www.google.com/maps/search/?api=1&query=${cacheBusiness?.details?.latitude},${cacheBusiness?.details?.longitude}`, "_blank");
                        }}
                    />
                </>}
            </OverlayPanel>
            <OverlayPanel ref={customerOp} showCloseIcon style={{width: 300}}>
                {cacheCustomer !== null && <>
                    <ul className={"m-0 px-3 list-none"}>
                        <li>Müşteri Adı: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheCustomer?.customer?.name}</span></li>
                        <li>Müşteri Telefon No: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheCustomer?.address?.phone}</span></li>
                        <li>Müşteri İl: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheCustomer?.address?.city}</span></li>
                        <li>Müşteri İlçe: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheCustomer?.address?.district}</span></li>
                        <li>Müşteri Adres: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheCustomer?.address?.address}</span></li>
                        <li>Müşteri Adres Notu: <span className={"font-semibold"}>{
                            // @ts-ignore
                            cacheCustomer?.address?.notes}</span></li>
                    </ul>
                </>}
            </OverlayPanel>
            <div className="card">
                <span className="text-900 text-xl font-bold mb-4 block">Siparişler</span>
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
                    expandedRows={expandedRows}
                    // @ts-ignore
                    onRowToggle={(e) => setExpandedRows(e?.data)}
                    rowExpansionTemplate={(data) => {
                        return <OrderShowPage
                            page={false}
                            // @ts-ignore
                            orderId={data.id}
                            csrfToken={csrfToken}
                            auth={auth}
                        />
                    }}
                    filters={{
                        "customer.name": {value: null, matchMode: 'contains'},
                        "customer.phone": {value: null, matchMode: 'contains'},
                        created_at: {value: null, matchMode: 'contains'},
                        updated_at: {value: null, matchMode: 'contains'},
                        status: {value: null, matchMode: 'contains'},
                        courier_accepted_at: {value: null, matchMode: 'contains'},
                        delivered_at: {value: null, matchMode: 'contains'},
                        canceled_at: {value: null, matchMode: 'contains'},
                        cancellation_reason: {value: null, matchMode: 'contains'},
                        price: {value: null, matchMode: 'contains'},
                        customer_note: {value: null, matchMode: 'contains'},
                        cancellation_accepted: {value: null, matchMode: 'equals'},

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
export default AllOrdersPage;

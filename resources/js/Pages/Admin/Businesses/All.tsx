import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import React, {useEffect, useState} from 'react';
import {Toast} from "primereact/toast";
import {
    getBusinesses,
    destroyBusiness as destroyBusinessFunc,
    multipleDestroyBusiness as multipleDestroyBusinessFunc,
    approveBusiness as approveBusinessFunc,
    multipleApproveBusiness as multipleApproveBusinessFunc, exportOrdersReport
} from "@/helpers/Admin/businesses";
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
import {Dialog} from "primereact/dialog";
import {useReactToPrint} from "react-to-print";
import {getCurrentMonthStartAndEnd, getDetailKeysTranslation, getDetailsValueTranslation} from "@/helpers/globalHelper";
import {Calendar} from "primereact/calendar";

interface AllCouriersProps {
    auth?: any,
    csrfToken?: string,
    flash?: {
        message?: string,
        type?: string,
        title?: string
    }
}

const AllBusinessPage = ({auth, csrfToken, flash}: AllCouriersProps) => {
    const [dates, setDates] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusinesses, setSelectedBusinesses] = useState([] as any[]);
    const [selectedColumns, setSelectedColumns] = useLocalStorage(["name", "email", "phone", "created_at", "actions"], "adminBusinessesApprovedColumns");
    const [error, setError] = useState(null);
    const [visiblePrint, setVisiblePrint] = useState(false);
    const [visibleExport, setVisibleExport] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const contentRef = React.useRef(null);
    const reactToPrint = useReactToPrint({
        contentRef
    });
    const getValuesForDetails = (courier: any) => {
        let returnData = [] as {
            label: string,
            value: any
        }[];
        if (courier === null) return returnData;
        Object.entries(courier).forEach(([key, value]) => {
            if (typeof value === "string") {
                // @ts-ignore
                if (key !== "courier" || key !== "status" || key !== "completed" || key !== "approved" || key !== "latitude" || key !== "longitude" || key !== "id" || key !== "courier_id" || key !== "created_at" || key !== "updated_at") {
                    returnData.push({
                        label: getDetailKeysTranslation(String(key)),
                        value: getDetailsValueTranslation(String(key), String(value))
                    });
                }
            }
        });
        return returnData;
    }
    const getBusinessesData = () => {
        setLoading(true);
        getBusinesses("all", csrfToken).then(data => {
            if (data.status) {
                setBusinesses(data.businesses.map((c: any) => {
                    return {
                        ...c,
                        activated: c.activated === 1
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
        getBusinessesData();
        if (flash?.message) {
            // @ts-ignore
            toast.current?.show({severity: flash?.type ?? "info", summary: flash.title, detail: flash.message ?? ""});
        }
        setDates(getCurrentMonthStartAndEnd())
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
    const multipleDestroyCouriers = (event: any, ids: number[]) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Seçilen İşletmeler silinecektir. Silmek istediğinize emin misiniz?",
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
    const approveCourier = (event: any, id: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: "İşletme Hesabı Aktifleştirilecektir. Aktifleştirmek istediğinize emin misiniz?",
            acceptLabel: "Aktifleştir",
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
            message: "Seçilen işletmelerin hesapları aktifleştirilecektir. Aktifleştirmek istediğinize emin misiniz?",
            acceptLabel: "Aktifleştir" + ` (${ids.length} İşletme)`,
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
    let columns: ColumnProps[] = [
        {
            selectionMode: "multiple",
            headerStyle: {width: '3rem'},
            header: ""
        },
        {
            field: "name",
            header: "Adı Soyadı(İşletme Sahibi)",
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
            field: "activated",
            header: "Aktiflik Durumu",
            hidden: !selectedColumns.includes("activated"),
            sortable: true,
            filter: true,
            dataType: "boolean",
            filterElement: (options) => {
                return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)}/>;
            },
            body: (rowData) => {
                return <i className={classNames('pi', {
                    'pi-check-circle text-green-400': rowData.activated,
                    'pi-times-circle text-red-400': !rowData.activated
                })}></i>;
            }
        }, {
            field: "activated_at",
            header: "Aktifleştirme Tarihi",
            hidden: !selectedColumns.includes("activated_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Aktifleştirme Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return <span>{rowData.activated_at === null ?
                    <i className={"pi pi-times-circle text-red-400"}></i> : new Date(rowData.activated_at).toLocaleString()}</span>
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
            field: "actions",
            header: "İşlemler",
            hidden: !selectedColumns.includes("actions"),
            body: (rowData: any) => {
                return <div className={"flex gap-2"}>
                    <Button icon={"pi pi-print"} tooltip={"İşletme Bilgilerini Yazdır"}
                            severity={"help"}
                            size={"small"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={(event) => {
                                setSelectedBusiness(rowData.details);
                                setVisiblePrint(true);
                            }}

                    />
                    <Button size={"small"} icon={"pi pi-file-export"} severity={"info"} tooltip={"Sipariş Çıktısı Al"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                setDates(getCurrentMonthStartAndEnd());
                                setSelectedBusiness(rowData)
                                setVisibleExport(true);
                            }}
                    />
                    <Button visible={!rowData.activated} size={"small"} icon={"pi pi-check-circle"} severity={"success"}
                            tooltip={"Aktifleştir"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={(event) => {
                                approveCourier(event, rowData.id);
                            }}
                    />
                    <Button size={"small"} icon={"pi pi-pencil"} severity={"warning"} tooltip={"Düzenle"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                router.visit(route("admin.businesses.edit", {id: rowData.id}))
                            }}
                    /><Button size={"small"} icon={"pi pi-trash"} severity={"danger"} tooltip={"Sil"}
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
                            tooltip={"Toplu Aktifleştirme Yapmanızı Sağlar"} tooltipOptions={{
                        position: "top"
                    }} visible={selectedBusinesses.map((c) => {
                        if (c.activated) return null;
                        return c.id;
                    }).filter((c) => c !== null).length > 0} label={"Aktifleştir (" + selectedBusinesses.map((c) => {
                        if (c.activated) return null;
                        return c.id;
                    }).filter((c) => c !== null).length + ")"} severity={"success"}
                            onClick={(event) => {
                                multipleApproveCouriers(event, selectedBusinesses.map((c) => {
                                    if (c.activated) return null;
                                    return c.id;
                                }).filter((c) => c !== null));
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
                    <Button size={"small"} icon={"pi pi-sync"} severity={"help"} className={"mr-2"}
                            tooltip={"Verileri Yenile"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                getBusinessesData();
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
            <Head title="Tüm İşletmeler"/>
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
                <span className="text-900 text-xl font-bold mb-4 block">Tüm İşletmeler</span>
                {error !== null &&
                    <Message
                        className="w-full"
                        severity="error"
                        text={error}
                    />
                }
                {!loading && businesses.length === 0 && <Message
                    className={"w-full"}
                    severity="info" text={"İşletme bulunamadı."}
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
                        activated: {value: null, matchMode: 'equals'}
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
            <Dialog
                header={"İşletme Bilgilerini Yazdır"}
                draggable={false}
                footer={<div className={"gap-2"}>
                    <Button size={"small"} icon={"pi pi-times"} label={"Kapat"} severity={"danger"}
                            tooltip={"Kapat"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => setVisiblePrint(false)}
                    />
                    <Button size={"small"} icon={"pi pi-print"} label={"Yazdır"} severity={"success"}
                            tooltip={"Yazdır"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                reactToPrint();
                            }}
                    />
                </div>}
                onHide={() => setVisiblePrint(false)} visible={visiblePrint}
                style={{width: '50vw'}} resizable={false}
                className="mx-3 sm:mx-0 w-full md:w-8 lg:w-6 p-fluid" modal
            >
                <div>
                    <dl ref={contentRef}
                        className="tw-max-w-md tw-text-gray-900 tw-divide-y tw-divide-gray-300 tw-print:tw-text-black tw-print:tw-divide-gray-400">

                        {getValuesForDetails(selectedBusiness).map((item: any, index: any) => (
                            <div key={index}
                                 className="tw-flex tw-flex-col tw-pb-3 tw-mb-1 tw-print:tw-pb-2 tw-print:tw-mb-2 tw-border-b tw-border-gray-300">
                                <dt className="tw-mb-1 tw-text-gray-600 tw-print:tw-text-gray-800 tw-text-sm">
                                    {item.label}
                                </dt>
                                <dd className="tw-font-semibold tw-m-0 tw-text-base tw-print:tw-font-bold">
                                    {item.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Dialog>
            <Dialog
                header={"Sipariş Raporu İndir"}
                draggable={false}
                footer={<div className={"gap-2"}>
                    <Button size={"small"} icon={"pi pi-times"} label={"Kapat"} severity={"danger"}
                            tooltip={"Kapat"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => setVisibleExport(false)}
                    />
                    <Button size={"small"} icon={"pi pi-file-excel"} label={"Excel"} severity={"info"}
                            tooltip={"Excel Çıktı Al"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                if (dates.length > 0) {
                                    if (dates[0] !== null && dates[1] !== null) {
                                        let startDate = new Date(dates[0] ?? new Date()).getTime();
                                        let endDate = new Date(dates[1] ?? new Date()).getTime();
                                        // @ts-ignore
                                        exportOrdersReport(selectedBusiness.id, startDate, endDate, 'xlsx', csrfToken, toast?.current, () => {
                                            setVisibleExport(false);
                                        })
                                    }
                                }
                            }}
                    />
                    <Button size={"small"} icon={"pi pi-file-pdf"} label={"PDF"} severity={"success"}
                            tooltip={"PDF Çıktı Al"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                if (dates.length > 0) {
                                    if (dates[0] !== null && dates[1] !== null) {
                                        let startDate = new Date(dates[0] ?? new Date()).getTime();
                                        let endDate = new Date(dates[1] ?? new Date()).getTime();
                                        // @ts-ignore
                                        exportOrdersReport(selectedBusiness.id, startDate, endDate, 'pdf', csrfToken, toast?.current, () => {
                                            setVisibleExport(false);
                                        })
                                    }
                                }
                            }}
                    />
                </div>}
                onHide={() => setVisibleExport(false)} visible={visibleExport}
                style={{width: '50vw'}} resizable={false}
                className="mx-3 sm:mx-0 w-full md:w-8 lg:w-6 p-fluid" modal
            >
                {selectedBusiness !== null && <>
                    <p>
                        <b
                            // @ts-ignore
                        >{selectedBusiness.name}</b> Adlı İşletmenin Tarih Bazlı Sipariş Çıktısını Almak İçin Tarih
                        Aralığını Seçiniz
                    </p>
                    <hr/>
                    <Calendar
                        value={dates}
                        inline
                        // @ts-ignore
                        onChange={(e) => {
                            setDates(e.value)
                        }}
                        selectionMode="range" readOnlyInput
                    />
                    <hr/>
                    <p>
                        Seçilen Tarihler
                        : <b>{dates !== null && new Date(dates[0] ?? new Date()).toLocaleDateString()} - {dates !== null && new Date(dates[1] ?? new Date()).toLocaleDateString()}</b>
                    </p>
                </>}
            </Dialog>
        </MainLayout>
    </PageContainer>
}
export default AllBusinessPage;

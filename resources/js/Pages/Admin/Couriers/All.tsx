import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import React, {useEffect, useState} from 'react';
import {Toast} from "primereact/toast";
import {
    getCouriers,
    destroyCourier as destroyCourierFunc,
    multipleDestroyCourier as multipleDestroyCourierFunc
} from "@/helpers/Admin/couriers";
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

interface AllCouriersProps {
    auth?: any,
    csrfToken?: string,
    flash?: {
        message?: string,
        type?: string,
        title?: string
    }
}

const AllCouriersPage = ({auth, csrfToken, flash}: AllCouriersProps) => {
    const [loading, setLoading] = useState(true);
    const [couriers, setCouriers] = useState([]);
    const [selectedCouriers, setSelectedCouriers] = useState([] as any[]);
    const [selectedColumns, setSelectedColumns] = useLocalStorage(["name", "email", "phone", "created_at", "actions"], "adminCouriersApprovedColumns");
    const [error, setError] = useState(null);
    useEffect(() => {
        getCouriers("all", csrfToken).then(data => {
            if (data.status) {
                setCouriers(data.couriers.map((c: any) => {
                    return {
                        ...c,
                        verified: c.verified === 1
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
        });
        if (flash?.message) {
            // @ts-ignore
            toast.current?.show({severity: flash?.type ?? "info", summary: flash.title, detail: flash.message ?? ""});
        }
    }, []);
    const deleteCourier = (event: any, id: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Kuryeyi silmek istediğinize emin misiniz?",
            acceptLabel: "Sil",
            acceptClassName: "p-button-danger",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                destroyCourierFunc(id, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setCouriers(couriers.filter((c: any) => c.id !== id));
                            setSelectedCouriers([]);
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
            message: "Seçilen kuryeler silinecektir. Silmek istediğinize emin misiniz?",
            acceptLabel: "Sil" + ` (${ids.length} Kurye)`,
            acceptClassName: "p-button-danger",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                multipleDestroyCourierFunc(ids, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setCouriers(couriers.filter((c: any) => !ids.includes(c.id)));
                            setSelectedCouriers([]);
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
            header: "Adı Soyadı",
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
            field: "verified",
            header: "Onay Durumu",
            hidden: !selectedColumns.includes("verified"),
            sortable: true,
            filter: true,
            dataType: "boolean",
            filterElement: (options) => {
                return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)}/>;
            },
            body: (rowData) => {
                return <i className={classNames('pi', {
                    'pi-check-circle text-green-400': rowData.verified,
                    'pi-times-circle text-red-400': !rowData.verified
                })}></i>;
            }
        }, {
            field: "verified_at",
            header: "Onay Tarihi",
            hidden: !selectedColumns.includes("verified_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Onay Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return <span>{rowData.verified_at === null ?
                    <i className={"pi pi-times-circle text-red-400"}></i> : new Date(rowData.verified_at).toLocaleString()}</span>
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
                    <Button size={"small"} icon={"pi pi-pencil"} severity={"warning"} tooltip={"Düzenle"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={() => {
                                router.visit(route("admin.couriers.edit", {id: rowData.id}))
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
                start={selectedCouriers.length > 0 && <>
                    <Button size={"small"} icon={"pi pi-trash"} className={"mr-2"}
                            tooltip={"Seçilen Kuryeleri Silmenizi Sağlar"} tooltipOptions={{
                        position: "top"
                    }} label={"Sil (" + selectedCouriers.length + ")"} severity={"danger"}
                            onClick={(event) => {
                                multipleDestroyCouriers(event, selectedCouriers.map((c) => c.id));
                            }}
                    />
                    <Button size={"small"} icon={"pi pi-filter-slash"} label={"Seçimi Temizle"} severity={"warning"}
                            onClick={() => setSelectedCouriers([])}/>
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
            <Head title="Tüm Kuryeler"/>
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
                <span className="text-900 text-xl font-bold mb-4 block">Tüm Kuryeler</span>
                {error !== null &&
                    <Message
                        className="w-full"
                        severity="error"
                        text={error}
                    />
                }
                {!loading && couriers.length === 0 && <Message
                    className={"w-full"}
                    severity="info" text={"Kurye bulunamadı."}
                />}
                <DataTable
                    hidden={!loading && couriers.length === 0 || error !== null}
                    loading={loading}
                    value={couriers}
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
                        verified: {value: null, matchMode: 'equals'}
                    }}
                    emptyMessage="Kurye bulunamadı."
                    currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                    selectionMode={"checkbox"}
                    selection={selectedCouriers}
                    onSelectionChange={(e) => setSelectedCouriers(e.value)}
                >
                    {columns.map((col, index) => {
                        return <Column key={index} {...col} />
                    })}
                </DataTable>
            </div>
        </MainLayout>
    </PageContainer>
}
export default AllCouriersPage;

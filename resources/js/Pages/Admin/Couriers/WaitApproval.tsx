import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {ReactNode, useEffect, useState} from 'react';
import * as Yup from "yup";
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {classNames} from "primereact/utils";
import {InputMask} from "primereact/inputmask";
import {InputSwitch} from "primereact/inputswitch";
import {
    getCouriers,
    approveDetails as approveDetailsFunc,
    destroyCourier as destroyCourierFunc,
    multipleApproveCourier as multipleApproveCourierFunc,
    multipleDestroyCourier as multipleDestroyCourierFunc, approveDetails
} from "@/helpers/Admin/couriers";
import {DataTable} from "primereact/datatable";
import {Column, ColumnProps} from "primereact/column";
import {Message} from "primereact/message";
import {Toolbar} from "primereact/toolbar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Checkbox} from "primereact/checkbox";
import {useLocalStorage} from "primereact/hooks";
import {confirmPopup} from "primereact/confirmpopup";
import {getDetailKeysTranslation, getDetailsValueTranslation} from "@/helpers/globalHelper";
import {Dialog} from "primereact/dialog";

const WaitApprovalCouriers = ({auth, csrfToken}: {
    auth?: any,
    csrfToken?: string
}) => {
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [couriers, setCouriers] = useState([]);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [selectedColumns, setSelectedColumns] = useLocalStorage(["name", "email", "phone", "details_button", "created_at", "actions"], "adminCouriersWaitApprovalDetailsColumns");
    const [error, setError] = useState(null);
    useEffect(() => {
        getCouriers("waitApprovals", csrfToken).then(data => {
            if (data.status) {
                setCouriers(data.details);
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
    const approveCourier = (event: any, id: number) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Kurye Bilgileri Onaylanacaktır. Onaylamak istediğinize emin misiniz?",
            acceptLabel: "Onayla",
            acceptClassName: "p-button-success",
            rejectLabel: "Vazgeç",
            accept() {
                setLoading(true)
                approveDetailsFunc(id, csrfToken)
                    .then(({status, message}) => {
                        if (status) {
                            setCouriers(couriers.filter((c: any) => c.courier.id !== id));
                            toast.current?.show({severity: "success", summary: "Başarılı", detail: message});
                        } else {
                            toast.current?.show({severity: "error", summary: "Hata", detail: message});
                        }
                    })
                    .catch(error => {
                        toast.current?.show({severity: "error", summary: "Hata", detail: error.message});
                    })
                    .finally(() => {
                        setLoading(false)
                        setVisible(false)
                    })
            }
        });
    }

    let columns: ColumnProps[] = [

        {
            field: "name",
            header: "Adı Soyadı",
            hidden: !selectedColumns.includes("name"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Ad'a Göre",
        },
        {
            field: "email",
            header: "Email Adresi",
            hidden: !selectedColumns.includes("email"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Email'e Göre",
        },
        {
            field: "phone",
            header: "Telefon Numarası",
            hidden: !selectedColumns.includes("phone"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Telefon Numarası'na Göre",
        },
        {
            field: "details_button",
            header: "Kurye Bilgileri",
            hidden: !selectedColumns.includes("details_button"),
            align: "center",
            body: (rowData: any) => {
                return <>
                    <Button icon={"pi pi-file"} tooltip={"Kurye Bilgileri"}
                            severity={"info"}
                            size={"small"}
                            tooltipOptions={{
                                position: "top"
                            }}
                            onClick={(event) => {
                                setSelectedCourier(rowData);
                                setVisible(true);
                            }}

                    />
                </>
            }
        },
        {
            field: "updated_at",
            header: "Bilgilerin Güncellenme Tarihi",
            hidden: !selectedColumns.includes("updated_at"),
            sortable: true,
            filter: true,
            filterPlaceholder: "Bilgilerin Güncellenme Tarihine Göre",
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
                                approveCourier(event, rowData.courier.id);
                            }}
                    />
                </div>
            }
        }
    ];
    const columnsRef = React.useRef<OverlayPanel>(null);
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
    const renderHeader = () => {
        return <>
            <Toolbar

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
            <Head title="Onay Bekleyen Kuryeler"/>
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
                <span className="text-900 text-xl font-bold mb-4 block">Onay Bekleyen Kuryeler (Kurye Bilgileri Onay Ekranı)</span>
                {error !== null &&
                    <Message
                        className="w-full"
                        severity="error"
                        text={error}
                    />
                }
                {!loading && couriers.length === 0 && <Message
                    className={"w-full"}
                    severity="info" text={"Onay bekleyen kurye bulunamadı."}
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
                    }}
                    emptyMessage="Kurye bulunamadı."
                    currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                >
                    {columns.map((col, index) => {
                        return <Column key={index} {...col} />
                    })}
                </DataTable>
                <Dialog
                    header={"Kurye Bilgileri"}
                    draggable={false}
                    footer={<div className={"gap-2"}>
                        <Button size={"small"} icon={"pi pi-times"} label={"Kapat"} severity={"danger"}
                                tooltip={"Kapat"}
                                tooltipOptions={{
                                    position: "top"
                                }}
                                onClick={() => setVisible(false)}
                        />
                        <Button size={"small"} icon={"pi pi-check-circle"} label={"Bilgileri Onayla"}
                                severity={"success"} tooltip={"Onayla"}
                                tooltipOptions={{
                                    position: "top"
                                }}
                                onClick={(event) => {
                                    // @ts-ignore
                                    approveCourier(event, selectedCourier?.courier?.id);
                                }}
                        />
                    </div>}
                    onHide={() => setVisible(false)} visible={visible}
                    style={{width: '50vw'}} resizable={false}
                    className="mx-3 sm:mx-0 sm:w-full md:w-8 lg:w-6 p-fluid" modal
                >
                    <DataTable value={getValuesForDetails(selectedCourier)}
                               filters={{
                                   label: {value: null, matchMode: 'contains'},
                                   value: {value: null, matchMode: 'contains'}
                               }}
                               filterDisplay={"row"} paginator stripedRows rows={5}>
                        <Column field="label" showFilterMenu={false} filter header="Anahtar"/>
                        <Column field="value" showFilterMenu={false} filter header="Değer"/>
                    </DataTable>
                </Dialog>
            </div>
        </MainLayout>
    </PageContainer>
}
export default WaitApprovalCouriers;

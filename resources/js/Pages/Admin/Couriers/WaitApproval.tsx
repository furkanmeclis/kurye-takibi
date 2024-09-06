import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {useEffect, useState} from 'react';
import * as Yup from "yup";
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {classNames} from "primereact/utils";
import {InputMask} from "primereact/inputmask";
import {InputSwitch} from "primereact/inputswitch";
import {getCouriers} from "@/helpers/couriers";
import {DataTable} from "primereact/datatable";
import {Column, ColumnProps} from "primereact/column";
import {Message} from "primereact/message";

const WaitApprovalCouriers = ({auth, csrfToken}: {
    auth?: any,
    csrfToken?: string
}) => {
    const [loading, setLoading] = useState(true);
    const [couriers, setCouriers] = useState([]);
    const [selectedCouriers, setSelectedCouriers] = useState([] as any[]);
    const [error, setError] = useState(null);
    useEffect(() => {
        getCouriers("unverified", csrfToken).then(data => {
            if (data.status) {
                setCouriers(data.couriers);
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
    let columns: ColumnProps[] = [
        {
            selectionMode: "multiple",
            headerStyle: {width: '3rem'},
        },
        {
            field: "name",
            header: "Adı",
            sortable: true,
            filter: true,
            filterPlaceholder: "Ad'a Göre",
        }, {
            field: "email",
            header: "Email Adresi",
            sortable: true,
            filter: true,
            filterPlaceholder: "Email'e Göre",
        }, {
            field: "phone",
            header: "Telefon Numarası",
            sortable: true,
            filter: true,
            filterPlaceholder: "Telefon Numarası'na Göre",
        },
        {
            field: "created_at",
            header: "Kayıt Tarihi",
            sortable: true,
            filter: true,
            filterPlaceholder: "Kayıt Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return <span>{new Date(rowData.created_at).toLocaleDateString()}</span>
            }
        },
        {
            field: "updated_at",
            header: "Güncelleme Tarihi",
            sortable: true,
            filter: true,
            filterPlaceholder: "Güncellenme Tarihine Göre",
            filterType: "date",
            body: (rowData: any) => {
                return <span>{new Date(rowData.updated_at).toLocaleDateString()}</span>
            }
        }
    ];
    const toast = React.useRef<Toast>(null);
    return <PageContainer auth={auth} csrfToken={csrfToken}>
        <MainLayout>
            <Head title="Onay Bekleyen Kuryeler"/>
            <Toast ref={toast}/>
            <div className="card">
                <span className="text-900 text-xl font-bold mb-4 block">Onay Bekleyen Kuryeler</span>
                {error !== null &&
                    <Message
                        className="w-full"
                        severity="error"
                        text={error}
                    />
                }
                {!loading && couriers.length === 0 && <Message
                    severity="warn" text={"Onay bekleyen kurye bulunamadı."}
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
                    filters={{
                        name: {value: null, matchMode: 'contains'},
                        email: {value: null, matchMode: 'contains'},
                        phone: {value: null, matchMode: 'contains'},
                        created_at: {value: null, matchMode: 'contains'},
                        updated_at: {value: null, matchMode: 'contains'},
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
export default WaitApprovalCouriers;

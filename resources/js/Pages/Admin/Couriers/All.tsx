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
import {Column} from "primereact/column";
import {Message} from "primereact/message";

const AllCouriers = ({auth, csrfToken}: {
    auth?: any,
    csrfToken?: string
}) => {
    const [loading, setLoading] = useState(true);
    const [couriers, setCouriers] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        getCouriers("verified", csrfToken).then(data => {
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
    const toast = React.useRef<Toast>(null);
    return <PageContainer auth={auth} csrfToken={csrfToken}>
        <MainLayout>
            <Head title="Tüm Kuryeler"/>
            <Toast ref={toast}/>
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
                    severity="info" text={"Kurye bulunamadı."} className={"w-full"}
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
                    stripedRows
                    filters={{
                        name: {value: null, matchMode: 'contains'},
                        email: {value: null, matchMode: 'contains'},
                        phone: {value: null, matchMode: 'contains'},
                    }}
                    emptyMessage="Kurye bulunamadı."
                    currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                >
                    <Column field="name" filter showFilterMenu={false} filterPlaceholder={"Ad'a Göre"} header="Adı"/>
                    <Column field="email" filter showFilterMenu={false} filterPlaceholder={"Email'e Göre"}
                            header="Email Adresi"/>
                    <Column field="phone" filter showFilterMenu={false} filterPlaceholder={"Telefon Numarası'na Göre"}
                            header="Telefon Numarası"/>
                </DataTable>
            </div>
        </MainLayout>
    </PageContainer>
}
export default AllCouriers;

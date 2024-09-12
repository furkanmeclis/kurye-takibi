import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {useEffect, useRef, useState} from "react";
import {getOrder, subscribeOrderEvents} from "@/helpers/Business/orders";
import {Toast} from "primereact/toast";

const OrderShowPage = ({
                           page = true,
                           order = {},
                           orderId = 0,
                           csrfToken = "",
                           auth = {},
                       }: {
    page?: boolean,
    order?: any,
    orderId?: any,
    csrfToken?: any,
    auth?: any,
}) => {
    const toast = useRef<Toast>(null);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (page) {
            setLoading(true);
            getOrder(orderId, csrfToken)
                .then((response) => {
                    if (response.status) {
                        setOrderData(response.order);
                    } else {
                        toast.current?.show({severity: "error", summary: "Hata", detail: response.message});
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.current?.show({severity: "error", summary: "Hata", detail: "Bir hata oluştu."});
                })
                .finally(() => setLoading(false));
        } else {
            setOrderData(order);
        }
    }, []);
    useEffect(() => {
        if (orderData && page) {
            subscribeOrderEvents(orderId, (data: any) => {
                if (data?.message !== undefined) {
                    toast.current?.show({severity: data.severity, summary: data.title, detail: data.message});
                }
                if (data?.reload) {
                    getOrder(orderId, csrfToken)
                        .then((response) => {
                            if (response.status) {
                                setOrderData(response.order);
                            } else {
                                toast.current?.show({severity: "error", summary: "Hata", detail: response.message});
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            toast.current?.show({severity: "error", summary: "Hata", detail: "Bir hata oluştu."});
                        });
                }
            });
        }
    }, [orderData]);
    const PageComponent = () => {
        return <>
                <pre>
                    {JSON.stringify(orderData, null, 2)}
                </pre>
        </>
    }
    return <>
        <Toast ref={toast}/>
        {page ? <PageContainer auth={auth} csrfToken={csrfToken}>
            <MainLayout>
                <div className="card">
                    <PageComponent/>
                </div>
            </MainLayout>
        </PageContainer> : <PageComponent/>}
    </>

};
export default OrderShowPage;

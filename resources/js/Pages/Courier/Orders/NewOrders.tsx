import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import React, {useEffect, useRef, useState} from "react";
import {Head, router} from "@inertiajs/react";
import {Toast} from "primereact/toast";
import {getLocation} from "@/helpers/globalHelper";
import {getNearbyNewOrders} from "@/helpers/Courier/orders";
import {BlockUI} from "primereact/blockui";
import {Message} from "primereact/message";
import {DataView} from "primereact/dataview";
import {Button} from "primereact/button";
import {classNames} from "primereact/utils";
import {Dropdown} from "primereact/dropdown";
import {OverlayPanel} from "primereact/overlaypanel";

const NewOrders = ({auth, csrfToken, courierIsTransporting = false}: {
    auth: any,
    csrfToken: any,
    courierIsTransporting?: boolean
}) => {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [locationFetched, setLocationFetched] = useState(false);
    const [orders, setOrders] = useState([] as any);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(1);
    const [sortField, setSortField] = useState("distance");
    const businessOp = useRef<OverlayPanel>(null);
    const customerOp = useRef<OverlayPanel>(null);
    const [cacheBusiness, setCacheBusiness] = useState(null);
    const [cacheCustomer, setCacheCustomer] = useState(null);
    const listOrders = () => {
        if (toast?.current) {
            setLoading(true);
            getLocation(toast?.current).then((location: any) => {
                setLocationFetched(true);
                getNearbyNewOrders(location.latitude, location.longitude, csrfToken, false).then((response) => {
                    if (response.status) {
                        setOrders(response.orders);
                        setError(null)
                    } else {
                        setError(response.message)
                        toast?.current?.show({
                            severity: "error",
                            summary: "Hata",
                            detail: response.message
                        });
                    }
                }).catch((error) => {
                    toast?.current?.show({
                        severity: "error",
                        summary: "Hata",
                        detail: "Siparişler Listelenirken Bir Hata Oluştu"
                    });
                }).finally(() => setLoading(false))
            }).catch((error) => {
                setLoading(false);
                setLocationFetched(false);
            })
        }
    }
    useEffect(() => {
        listOrders();
    }, []);
    const itemTemplate = (order: any) => {
        return (
            <div className="col-12 py-3 px-2">
                <div className="grid grid-nogutter">
                    <div className="col-6">
                        <div className="grid">
                            <div className="col-12">
                                <span className="font-semibold lg:text-lg flex align-items-center gap-1">
                                 <span
                                     onClick={(e) => {
                                         setCacheBusiness(order.business)
                                         businessOp.current?.toggle(e);
                                     }}
                                     className={"cursor-pointer hover:text-primary transition-all transition-duration-200"}>
                                  <i className="pi pi-home"></i> {order.business.name}</span> (<span
                                    className={"text-primary"}><i
                                    className="pi pi-map-marker"></i> {Number(order.distance).toFixed(2)}km</span>)
                                </span>
                            </div>
                            <div className="col-12">
                                <span className="flex align-items-center gap-1 cursor-pointer">
                                  <span
                                      onClick={(e) => {
                                          setCacheCustomer({
                                              // @ts-ignore
                                              customer: order.customer,
                                              address: order.address
                                          })
                                          customerOp.current?.toggle(e);
                                      }}
                                      className={"cursor-pointer hover:text-primary transition-all transition-duration-200"}><i
                                      className="pi pi-user"></i> {order.customer.name}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 flex justify-content-end align-items-center">
                        <span className="font-semibold text-lg flex align-items-center gap-1">
                                  ₺ {order.price}
                                </span>
                    </div>
                    <div className="col-4  flex justify-content-end align-items-center">
                        <Button label={"Siparişi Al"} size={"small"} icon={"pi pi-plus-circle"}
                                onClick={() => {
                                    router.visit(route("courier.orders.reviewOrder", order.id))
                                }}
                                severity={"success"}/>
                    </div>
                </div>
            </div>
        );
    };

    return <PageContainer auth={auth} csrfToken={csrfToken} courierIsTransporting={courierIsTransporting}>
        <Toast ref={toast}/>
        <MainLayout>
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
            <Head title="Yeni Siparişler"/>
            <BlockUI blocked={loading} template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
                <div className="card">
                    <span className="text-900 text-xl font-bold mb-4 block">Yeni Siparişler (Mesafeye Göre)</span>
                    {!locationFetched &&
                        <Message severity={"error"} text={"Konum Bilginiz Alınamadığı İçin Siparişler Listelenemiyor"}
                                 className={"w-full"}/>}
                    {error !== null && <Message severity={"error"} text={error} className={"w-full"}/>}
                    {orders.length === 0 &&
                        <Message severity={"info"} text={"Yeni Sipariş Bulunamadı"} className={"w-full"}/>}
                    {orders.length > 0 &&
                        <DataView
                            value={orders}
                            paginator
                            rows={10}
                            layout={"list"}
                            itemTemplate={(data: any) => {
                                if (!data) {
                                    return;
                                }
                                return itemTemplate(data);
                            }}
                            sortOrder={sortOrder}
                            sortField={sortField}
                            header={<div className={"flex justify-content-end"}>
                                <Dropdown value={sortOrder} options={[{
                                    label: "Mesafeye Göre Artan",
                                    value: 1
                                }, {label: "Mesafeye Göre Azalan", value: -1}]}
                                          onChange={(e) => setSortOrder(e.value)}
                                />
                            </div>}
                        />}
                </div>
            </BlockUI>
        </MainLayout>
    </PageContainer>

}
export default NewOrders;

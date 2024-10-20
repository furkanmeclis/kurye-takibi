import React, {useContext, useRef, useState} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {Skeleton} from "primereact/skeleton";
import {Button} from "primereact/button";
import {Message} from "primereact/message";
import {getNearbyNewOrders, getPastOrdersForWidget} from "@/helpers/Courier/orders";
import {router} from "@inertiajs/react";
import {Toast} from "primereact/toast";
import {getLocation, getOrderStatuses} from "@/helpers/globalHelper";
import {Tag} from "primereact/tag";

const CourierPastOrdersWidget = ({csrfToken}: { csrfToken: any }) => {
    const toast = useRef<Toast>(null);
    const [error, setError] = useState<string | null>(null);
    const listCount = 10;
    const {auth} = useContext(LayoutContext);
    const [notSupported, setNotSupported] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<any[]>(["", "", "", ""]);
    const [location, setLocation] = useState<any>({});
    const getPastOrders = () => {
        setLoading(true)
        getPastOrdersForWidget(listCount, csrfToken).then((response) => {
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
    }
    const onClickLi = (orderId: any) => {
        router.visit(route("courier.orders.show", orderId));
    }
    React.useEffect(() => {
        getPastOrders();
    }, [toast]);
    return <>
        <Toast ref={toast}/>
        <div className="card h-full">
            <h6 className={"flex justify-content-between align-items-center"}>
                <span>Geçmiş Siparişler</span>
                <div className={"flex gap-1"}>
                    <Button
                        icon={'pi pi-refresh'}
                        loading={loading}
                        tooltip={"Verileri Yenile"}
                        tooltipOptions={{position: 'top'}}
                        onClick={getPastOrders}
                        raised
                        size={"small"}
                    />
                </div>
            </h6>
            {error !== null && <Message text={error} className={"w-full mb-3"} severity={"error"}/>}
            <ul className="list-none p-0 m-0 relative">
                {loading && Array.from({length: listCount}).map((_, index) => (
                    <li key={index} className={"mb-2 flex align-items-center"}>
                        <div className="w-full">
                            <Skeleton width="100%" height={"2rem"}/>
                        </div>
                    </li>))}
                {!loading && orders.length > 0 &&
                    <li className={"w-full px-2 mb-2 flex align-items-center justify-content-between font-semibold text-sm"}>
                        <span className={"flex-1 text-left"}>İşletme Adı</span>
                        <span className={"flex-1 text-center"}>Paket Ücreti</span>
                        <span className={"flex-1 text-right"}>Durumu</span>
                    </li>}
                {!loading && orders.map((order, index) => (
                    <li key={index}
                        onClick={() => onClickLi(order.id)}
                        className={"mb-2 flex hover:text-primary-900 align-items-center hover:bg-primary-300 border-1 border-gray-400 cursor-pointer hover:border-primary transition-all transition-duration-400 h-2rem w-full px-2 py-4 border-round"}>
                        <div className="flex align-items-center justify-content-between w-full">
                            <div className={"flex-1 font-semibold"}>
                                {order.business.name}
                            </div>
                            <div
                                className="text-center flex-1">
                                {order.price} ₺
                            </div>
                            <div
                                className="text-right flex-1 ">
                                <Tag
                                    // @ts-ignore
                                    value={getOrderStatuses(order.status)?.label}
                                    // @ts-ignore
                                    severity={getOrderStatuses(order.status)?.severity}/>
                            </div>
                        </div>
                    </li>))}
                {!loading && orders.length === 0 &&
                    <li className={"mb-2 flex hover:text-primary-900 align-items-center bg-primary-300 hover:bg-red-400 hover:text-white border-1 hover:border-gray-400 border-primary transition-all transition-duration-400 h-2rem w-full px-2 py-4 border-round"}>
                        <div className="flex align-items-center justify-content-center w-full">
                            <span>Sipariş Bulunamadı</span>
                        </div>
                    </li>}
                {!loading && orders.length !== listCount && Array.from({length: (listCount - orders.length) - 1}).map((_, index) => (
                    <li key={index} className={"mb-2 flex align-items-center"}>
                        <div className="ml-3 w-full h-2rem"></div>
                    </li>))}

            </ul>
            <Button type="button" loading={loading} className="w-full mt-3" label="Hepsini Görüntüle"
                    onClick={() => router.visit(route("courier.orders.pastOrders"))}
                    icon="pi pi-arrow-right"
                    iconPos="right"></Button>
        </div>
    </>
}
export default CourierPastOrdersWidget;

import React, {useContext, useRef, useState} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {Skeleton} from "primereact/skeleton";
import {Button} from "primereact/button";
import {Message} from "primereact/message";
import {getNearbyNewOrders} from "@/helpers/Courier/orders";
import {router} from "@inertiajs/react";
import {Toast} from "primereact/toast";
import {getLocation} from "@/helpers/globalHelper";
import {Tag} from "primereact/tag";

const CourierOrdersWidget = ({csrfToken}:{csrfToken:any}) => {
    const toast = useRef<Toast>(null);
    const [error, setError] = useState<string | null>(null);
    const listCount = 7;
    const {auth} = useContext(LayoutContext);
    const [notSupported, setNotSupported] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<any[]>(["", "", "", ""]);
    const [location, setLocation] = useState<any>({});
    const getNearOrders = () => {
        if (toast?.current) {
            setLoading(true)
            getLocation(toast?.current).then((location: any) => {
                getNearbyNewOrders(location.latitude, location.longitude, csrfToken).then((response) => {
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
            })
        }
    }
    const onClickLi = () => {
        toast.current?.show({
            severity: "warn",
            summary: "Geliştirme Sürecinde",
            detail: "Bu Özellik En Kısa Süre İçerisinde Eklenecektir"
        })
    }
    React.useEffect(() => {
        getNearOrders();
    }, [toast]);
    return <>
        <Toast ref={toast}/>
        <div className="card h-full">
            <h6 className={"flex justify-content-between align-items-center"}>
                <span>Yakın Siparişler(Konuma Göre) <Tag value={"New"} severity={"warning"}/></span>
                <div className={"flex gap-1"}>
                    <Button
                        icon={'pi pi-refresh'}
                        loading={loading}
                        tooltip={"Verileri Yenile"}
                        tooltipOptions={{position: 'top'}}
                        onClick={getNearOrders}
                        raised
                        size={"small"}
                    />
                </div>
            </h6>
            {error !== null && <Message text={error} className={"w-full mb-3"} severity={"error"}/>}
            {notSupported && <Message text={"Konum Bilgisi Alınamadı"} className={"w-full"} severity={"error"}/>}
            {!notSupported && <ul className="list-none p-0 m-0 relative">
                {loading && Array.from({length: listCount}).map((_, index) => (
                    <li key={index} className={"mb-4 flex align-items-center"}>
                        <div className="w-full">
                            <Skeleton width="100%" height={"2rem"}/>
                        </div>
                    </li>))}
                {!loading && orders.map((order, index) => (
                    <li key={index}
                        onClick={onClickLi}
                        className={"mb-4 flex hover:text-primary-900 align-items-center hover:bg-primary-300 border-1 border-gray-400 cursor-pointer hover:border-primary transition-all transition-duration-400 h-2rem w-full px-2 py-4 border-round"}>
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
                                {order.distance}<span className={"font-semibold"}>km</span>
                            </div>
                        </div>
                    </li>))}
                {!loading && orders.length !== 4 && Array.from({length: listCount - orders.length}).map((_, index) => (
                    <li key={index} className={"mb-4 flex align-items-center"}>
                        <div className="ml-3 w-full h-2rem"></div>
                    </li>))}
            </ul>}
            <Button type="button" loading={loading} className="w-full mt-3" label="Hepsini Görüntüle"
                    onClick={() => router.visit(route("courier.orders.newOrders"))}
                    icon="pi pi-arrow-right"
                    iconPos="right"></Button>
        </div>
    </>
}
export default CourierOrdersWidget;

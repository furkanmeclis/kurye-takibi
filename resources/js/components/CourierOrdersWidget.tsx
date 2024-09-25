import React, {useContext} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {Skeleton} from "primereact/skeleton";
import {Button} from "primereact/button";
import {Message} from "primereact/message";

const CourierOrdersWidget = () => {
    const listCount = 7;
    const {auth, csrfToken} = useContext(LayoutContext);
    const [notSupported, setNotSupported] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    
    const [orders, setOrders] = React.useState<any[]>(["", "", "", ""]);
    const [location, setLocation] = React.useState<any>({});
    const getNearOrders = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOrders(Array.from({length: listCount}));
        }, 1000)
    }
    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setNotSupported(false);
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    resolve(position);
                }, (err) => {
                    reject(err.message);
                    setNotSupported(true);
                });
            } else {
                reject("Geolocation is not supported");
                setNotSupported(true);
            }
        });
    }
    React.useEffect(() => {
        getLocation().then(getNearOrders).catch(() => setLoading(false));
    }, []);
    return <>
        <div className="card h-full">
            <h6 className={"flex justify-content-between align-items-center"}>
                <span>Yakın Siparişler(Konuma Göre)</span>
                <div className={"flex gap-1"}>
                    <Button
                        icon={'pi pi-map-marker'}
                        loading={loading}
                        tooltip={"Konumu Yenile"}
                        severity={"info"}
                        visible={notSupported}
                        tooltipOptions={{position: 'top'}}
                        onClick={getLocation}
                        raised
                        size={"small"}
                    />
                    <Button
                        icon={'pi pi-refresh'}
                        loading={loading}
                        visible={!notSupported}
                        disabled={notSupported}
                        tooltip={"Verileri Yenile"}
                        tooltipOptions={{position: 'top'}}
                        onClick={getNearOrders}
                        raised
                        size={"small"}
                    />
                </div>
            </h6>
            {notSupported && <Message text={"Konum Bilgisi Alınamadı"} className={"w-full"} severity={"error"}/>}
            {!notSupported && <ul className="list-none p-0 m-0 relative">
                {loading && Array.from({length: listCount}).map((_, index) => (
                    <li key={index} className={"mb-4 flex align-items-center"}>
                        <div className="w-full">
                            <Skeleton width="100%" height={"2rem"}/>
                        </div>
                    </li>))}
                {!loading && orders.map((order, index) => (<li key={index} className={"mb-4 flex align-items-center"}>
                    <div className="ml-3 w-full h-2rem">
                        {index}
                    </div>
                </li>))}
                {!loading && orders.length !== 4 && Array.from({length: listCount - orders.length}).map((_, index) => (
                    <li key={index} className={"mb-4 flex align-items-center"}>
                        <div className="ml-3 w-full h-2rem"></div>
                    </li>))}
            </ul>}
            <Button type="button" loading={loading} className="w-full mt-3" label="Hepsini Görüntüle"
                    icon="pi pi-arrow-right"
                    iconPos="right"></Button>
        </div>
    </>
}
export default CourierOrdersWidget;

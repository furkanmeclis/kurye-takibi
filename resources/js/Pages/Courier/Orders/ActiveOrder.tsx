import {useContext, useEffect, useRef, useState} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {getActiveOrder, watchPosition} from "@/helpers/Courier/orders";
import {Toast} from "primereact/toast";
import {getLocation} from "@/helpers/globalHelper";
import {BlockUI} from "primereact/blockui";

const ActiveOrder = ({auth, csrfToken}: {
    auth: any,
    csrfToken: any
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const [order, setOrder] = useState<any>(null);
    const [lastUpdated, setLastUpdated] = useState<any>(null);
    const getOrderDetails = () => {
        setLoading(true);
        getActiveOrder(csrfToken).then((res: any) => {
            if (res.status) {
                setOrder(res.order);
                setLoading(false);
            } else {
                if (res?.getLocation !== undefined && res?.getLocation && toast?.current !== null) {
                    getLocation(toast?.current)
                        .then((location: any) => {
                            getActiveOrder(csrfToken, location).then((res: any) => {
                                if (res.status) {
                                    setLoading(false);
                                    setOrder(res.order);
                                } else {
                                    setLoading(false);
                                    toast?.current?.show({severity: 'error', summary: 'Hata', detail: res.message});
                                }
                            }).catch((err) => {
                                setLoading(false);
                                toast?.current?.show({severity: 'error', summary: 'Hata', detail: "Bir Sorun Oluştu"});
                            });
                        })
                        .catch((err) => {
                            setLoading(false);
                            toast?.current?.show({severity: 'error', summary: 'Hata', detail: "Bir Sorun Oluştu"});
                        });
                } else {
                    setLoading(false);
                    toast?.current?.show({severity: 'error', summary: 'Hata', detail: res.message});
                }
            }
        }).catch((err) => {
            setLoading(false);
            toast?.current?.show({severity: 'error', summary: 'Hata', detail: "Bir Sorun Oluştu"});
        });
    }
    useEffect(() => {
        getOrderDetails();
        let watchId = watchPosition(csrfToken,(status: any) => {
            if (status) {
                setLastUpdated(new Date());
            }
        });
        return () => {
            navigator.geolocation.clearWatch(Number(watchId));
        }
    }, []);
    return <BlockUI blocked={loading} template={<i className={"pi pi-spin pi-spinner"} style={{fontSize: '3rem'}}></i>}>
        <Toast ref={toast}/>
        <pre>
            {JSON.stringify(order, null, 2)}
        </pre>
    </BlockUI>
}
export default ActiveOrder;

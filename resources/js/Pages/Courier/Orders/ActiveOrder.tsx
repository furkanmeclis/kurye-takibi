import {useContext, useEffect, useRef, useState} from "react";
import {deliverOrder, getActiveOrder, watchPosition} from "@/helpers/Courier/orders";
import {Toast} from "primereact/toast";
import {getLocation, getOrderStatuses} from "@/helpers/globalHelper";
import {BlockUI} from "primereact/blockui";
import {Tooltip} from "primereact/tooltip";
import WatchingIcon from "@/components/WatchingIcon";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Button} from "primereact/button";
import {Avatar} from "primereact/avatar";
import {Link, router} from "@inertiajs/react";
import {Tag} from "primereact/tag";
import {Timeline} from "primereact/timeline";
import L from "leaflet";
import startMarkerIcon from "@/icons/startMarker.png";
import finishMarkerIcon from "@/icons/finishMarker.png";
import roadDotIcon from "@/icons/roadDot.png";
import "leaflet/dist/leaflet.css";
import {useSessionStorage} from "primereact/hooks";
import {confirmPopup} from "primereact/confirmpopup";
import {confirmDialog} from "primereact/confirmdialog";
import {Sidebar} from "primereact/sidebar";

const startMarker = new L.Icon({
    iconUrl: startMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const finishMarker = new L.Icon({
    iconUrl: finishMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const roadMarker = new L.Icon({
    iconUrl: roadDotIcon,
    iconSize: [16, 16],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const ActiveOrder = ({auth, csrfToken}: {
    auth: any,
    csrfToken: any
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const [order, setOrder] = useState<any>(null);
    const [lastUpdated, setLastUpdated] = useState<any>(null);
    const [locations, setLocations] = useState<any>([]);
    const [watchingLocation, setWatchingLocation] = useState<boolean>(true);
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
    const getOrderDetails = () => {
        setLoading(true);
        getActiveOrder(csrfToken).then((res: any) => {
            if (res.status) {
                setOrder(res.order);
                setLocations(res.order.locations);
                setLoading(false);
            } else {
                if (res?.getLocation !== undefined && res?.getLocation && toast?.current !== null) {
                    getLocation(toast?.current)
                        .then((location: any) => {
                            getActiveOrder(csrfToken, location).then((res: any) => {
                                if (res.status) {
                                    setLoading(false);
                                    setOrder(res.order);
                                    setLocations(res.order.locations);
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
        let watchId = watchPosition(csrfToken, (status: any) => {
            if (status) {
                setLastUpdated(new Date());
                setWatchingLocation(true);
            } else {
                setWatchingLocation(false);
            }
        });
        return () => {
            navigator.geolocation.clearWatch(Number(watchId));
        }
    }, []);

    const CalculateElapsedTime = (props: { date: string; [key: string]: any }) => {
        const [elapsedTime, setElapsedTime] = useSessionStorage<{ hours: number; minutes: number; seconds: number }>({
            hours: 0,
            minutes: 0,
            seconds: 0,
        }, "elapsedTime");

        useEffect(() => {
            const interval = setInterval(() => {
                const now = Date.now();
                const acceptedTime = new Date(props.date).getTime();

                // Arada 3 saat fark olduğu için bunu hesaba katıyoruz (milisaniye cinsinden 3 saat)
                const adjustedTime = now - (acceptedTime - 3 * 60 * 60 * 1000);

                // Farkı milisaniye cinsinden alıyoruz
                const totalSeconds = Math.floor(adjustedTime / 1000); // Saniye cinsine çevir
                const hours = Math.floor(totalSeconds / 3600); // Toplam saat
                const minutes = Math.floor((totalSeconds % 3600) / 60); // Toplam dakika
                const seconds = totalSeconds % 60; // Geriye kalan saniyeler

                setElapsedTime({hours, minutes, seconds});
            }, 1000);

            return () => clearInterval(interval); // Temizleme işlemi
        }, [props.date]);

        return (
            <span {...props}>
                {elapsedTime.minutes < 10 ? `0${elapsedTime.minutes}` : elapsedTime.minutes}:
                {elapsedTime.seconds < 10 ? `0${elapsedTime.seconds}` : elapsedTime.seconds}
    </span>
        );
    };
    const deliveryOrder = () => {
        confirmDialog({
            header: "Siparişi Teslim Et",
            message: "Siparişi teslim etmek istediğinize emin misiniz?",
            acceptLabel: "Evet",
            rejectLabel: "Hayır",
            draggable: false,
            accept: () => {
                setLoading(true);
                deliverOrder(order.id, csrfToken).then((res: any) => {
                    if(res.status) {
                        toast?.current?.show({severity: 'success', summary: 'Başarılı', detail: res.message});
                        router.reload();
                    }else{
                        toast?.current?.show({severity: 'error', summary: 'Hata', detail: res.message});
                    }
                }).catch(() => {
                    toast?.current?.show({severity: 'error', summary: 'Hata', detail: "Bir Sorun Oluştu"});
                }).finally(() => setLoading(false))
            },
        });
    }
    const prepareTimeLine = (order: any) => {
        let created_at = new Date(order.created_at);
        let courier_accepted_at = order.courier_accepted_at !== null ? new Date(order.courier_accepted_at) : null;
        let delivered_at = order.delivered_at !== null ? new Date(order.delivered_at) : null;
        let canceled_at = order.canceled_at !== null ? new Date(order.canceled_at) : null;
        let timeline = [];


        if (canceled_at !== null) {
            timeline.push({
                "date": canceled_at,
                "status": "Sipariş İptal Edildi",
                "icon": "pi pi-times-circle",
                "bg": "red-500"
            });
        }
        if (delivered_at !== null) {
            timeline.push({
                "date": delivered_at,
                "status": "Sipariş Teslim Edildi",
                "icon": "pi pi-send",
                "bg": "green-500"
            });
        }
        if (courier_accepted_at !== null) {
            timeline.push({
                "date": courier_accepted_at,
                "status": "Kurye Kabul Etti",
                "icon": "pi pi-check-square",
                "bg": "teal-500"
            });
        }
        timeline.push({
            "date": created_at,
            "status": "Sipariş Oluşturuldu",
            "icon": "pi pi-file-import",
            "bg": "yellow-500"

        });
        return timeline;
    }
    const PageComponent = () => {
        return <div className={`grid`}>
            <div
                className={`col-12 lg:col-9 md:col-8`}>
                <div>
                    <Tooltip target={"[data-pr-tooltip]"} position={"bottom"} className={"zoomin"}/>
                    <div className={"grid row-gap-2"}>
                        {order.status === "transporting" && order.courier !== false && order.courier !== null && locations.length > 0 && <>
                            <div className="col-12">
                        <span className={"text-xl font-semibold"}>Konumunuz
                            {order.status === "transporting" &&
                                <WatchingIcon speed={"fast"} connected={watchingLocation}
                                              text={"Kurye Konumu İzleniyor"}/>}
                        </span>
                            </div>
                            <div className="col-12">
                                {order.status === "transporting" && locations.length > 0 &&
                                    <MapContainer
                                        // @ts-ignore
                                        center={[locations[0].latitude, locations[0].longitude]} zoom={15}
                                        zoomControl
                                        attributionControl={false}
                                        style={{height: "350px", borderRadius: "10px"}}
                                        scrollWheelZoom={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
                                        {locations.map((location: any, index: any) => (
                                            <Marker key={index} position={[location.latitude, location.longitude]}
                                                    icon={index === 0 ? startMarker : index === locations.length - 1 ? (order.status === "delivered" ? finishMarker : roadMarker) : roadMarker}
                                            >
                                                <Popup>
                                            <span
                                                className={"font-semibold flex justify-content-center text-lg"}>{index === 0 ? "Başlangıç" : index === locations.length - 1 ? (order.status === "delivered" ? "Bitiş" : "Güzergah-" + index) : "Güzergah-" + index}</span>
                                                    <Button label={"Google Maps'te Aç"}
                                                            size={"small"}
                                                            icon={"pi pi-external-link"}
                                                            severity={"help"}
                                                            className={"w-full mt-2"}
                                                            onClick={() => {
                                                                window.open(`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`, "_blank");
                                                            }}/>
                                                </Popup>
                                            </Marker>
                                        ))}

                                    </MapContainer>}
                            </div>
                        </>}
                        <div className="col-12">
                            <span className={"text-xl font-semibold"}>Sipariş Detayları</span>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Müşteri Adı Soyadı"}>
                            <Avatar
                                icon={"pi pi-user"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <Link className={"font-semibold ml-2 text-color dark: text-decoration-none"}
                                  href={route('business.customers.edit', order.customer.id)}>
                                {order.customer.name}
                            </Link>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                             data-pr-tooltip={"Müşteri Telefon Numarası"}>
                            <Avatar
                                icon={"pi pi-phone"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <a className={"font-semibold ml-2 text-color text-decoration-none"}
                               href={`tel:${order.customer.phone}`}>{order.customer.phone}</a>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                             data-pr-tooltip={"Paket Ücreti"}>
                            <Avatar
                                icon={"pi pi-turkish-lira"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <span
                                className={"font-semibold ml-2"}>{order.price} ₺</span>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Sipariş Durumu"}>
                            <Avatar
                                icon={"pi pi-check"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <Tag
                                className={"ml-2"}
                                // @ts-ignore
                                value={getOrderStatuses(order.status).label}
                                // @ts-ignore
                                severity={getOrderStatuses(order.status).severity}
                            />
                        </div>
                        {order.status === "canceled" && <>
                            <div className="col-12">
                                <span className={"text-xl font-semibold"}>İptal Bilgileri</span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"İptal Edilme Sebebi"}>
                                <Avatar
                                    icon={"pi pi-file"}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span className={"font-semibold ml-2"}>{order.cancellation_reason}</span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"İptal Edilme Sebebi"}>
                                <Avatar
                                    icon={`pi pi-${order.cancellation_accepted === 1 ? "check" : "times"}-circle`}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span
                                    className={"font-semibold ml-2"}>{order.cancellation_accepted === 1 ? "İptal Onaylandı" : "İptal İşlemi Onay Bekliyor"}</span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"İptal Edilme Tarihi"}>
                                <Avatar
                                    icon={`pi pi-clock`}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span
                                    className={"font-semibold ml-2"}>{new Date(String(order.canceled_at)).toLocaleString()}</span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"Onaylayan Yetkili"}>
                                <Avatar
                                    icon={`pi pi-user`}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span
                                    className={"font-semibold ml-2"}>{order.cancellation_accepted_by !== null ? order.cancellation_accepted_by.name : "Onaylanmadı"}</span>
                            </div>
                        </>}
                        <div className="col-12">
                            <span className={"text-xl font-semibold"}>Adres Bilgileri</span>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Adres Başlığı"}>
                            <Avatar
                                icon={"pi pi-tag"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <span className={"font-semibold ml-2"}>{order.address.title}</span>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                             data-pr-tooltip={"Adres Telefon Numarası"}>
                            <Avatar
                                icon={"pi pi-phone"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <a className={"font-semibold ml-2 text-color text-decoration-none"}
                               href={`tel:${order.address.phone}`}>{order.address.phone}</a>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"İl/İlçe"}>
                            <Avatar
                                icon={"pi pi-map"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <span
                                className={"font-semibold ml-2"}>{order.address.city} / {order.address.district}</span>
                        </div>
                        <div className="lg:col-6 md:col-6 col-12 cursor-pointer" data-pr-tooltip={"Adres"}>
                            <Avatar
                                icon={"pi pi-home"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <span
                                data-pr-position={"bottom"}
                                className={"font-semibold ml-2"}>{order.address.address}</span>
                        </div>
                        {order.address.notes !== null &&
                            <div className="lg:col-6 md:col-6 col-12 cursor-pointer" data-pr-tooltip={"Notlar"}>
                                <Avatar
                                    icon={"pi pi-info"}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span
                                    className={"font-semibold ml-2"}>{order.address.notes}</span>
                            </div>}
                    </div>

                </div>
            </div>
            <div className="col-12 lg:col-3 md:col-4">
                <Timeline layout={"vertical"} marker={(item) => <span
                    className={`bg-${item.bg} flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1`}>
                    <i className={item.icon}></i>
                </span>} value={prepareTimeLine(order)} opposite={(item) => item.status} content={(item) => <small
                    className="text-color-secondary">{item.date.toLocaleString()}</small>}/>
            </div>
        </div>
    }
    return <BlockUI blocked={loading} template={<i className={"pi pi-spin pi-spinner"} style={{fontSize: '3rem'}}></i>}>
        <Toast ref={toast}/>
        <div className="card">
            <div className="grid">
                <div className="col-12 flex justify-content-between align-items-center">
                    <span className={"text-xl font-semibold"}>Aktif Sipariş</span>
                    {order !== null && <span>
                        <i className="pi pi-clock"></i> <CalculateElapsedTime date={order.updated_at}
                                                                              className={"font-semibold text-xl"}/>
                    </span>}
                </div>
                <div className="col-12">
                    <Button label={"Yenile"} icon={"pi pi-refresh"} onClick={getOrderDetails}/>
                    <Button label={"Teslim Et"} className={"ml-2"} icon={"pi pi-send"} severity={"success"}
                            onClick={deliveryOrder}/>
                </div>
            </div>
        </div>
        <button
            className="layout-danger-button config-link"
            type="button"
            onClick={() => setSidebarVisible(true)}
        >
            <i className="pi pi-exclamation-triangle"></i>
        </button>
        <Sidebar
            onHide={() => setSidebarVisible(false)}
            visible={sidebarVisible}
            position={"right"}
            header={<span className={"font-bold"}>Acil Durum Bildirimi</span>}
            className="w-full md:w-20rem lg:w-30rem"
        >
            <div className="grid my-3">
                <div className="col-6">
                    <div className="emergency-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e8eaed">
                            <path
                                d="M480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q10 0 19.5.5T520-877v81q-10-2-20-3t-20-1q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186q122-112 181-203.5T720-552q0-2-.5-4t-.5-4h80q0 2 .5 4t.5 4q0 100-79.5 217.5T480-80Zm0-450Zm195-108 84-84 84 84 56-56-84-84 84-84-56-56-84 84-84-84-56 56 84 84-84 84 56 56ZM480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z"/>
                        </svg>
                        <p className="font-semibold">Adres Yanlış</p>
                    </div>
                </div>
                <div className="col-6">
                    <button  className="emergency-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e8eaed">
                            <path
                                d="M560-560q0-33-23.5-56.5T480-640q-10 0-19 2t-17 7l107 107q5-8 7-17t2-19Zm168 213-58-58q25-42 37.5-78.5T720-552q0-109-69.5-178.5T480-800q-44 0-82.5 13.5T328-747l-57-57q43-37 97-56.5T480-880q127 0 223.5 89T800-552q0 48-18 98.5T728-347Zm-157 71L244-603q-2 12-3 25t-1 26q0 71 59 162.5T480-186q26-23 48.5-45.5T571-276ZM819-28 627-220q-32 34-68 69t-79 71Q319-217 239.5-334.5T160-552q0-32 5-61t14-55L27-820l57-57L876-85l-57 57ZM408-439Zm91-137Z"/>
                        </svg>
                        <p>Adreste Yok</p>
                    </button>
                </div>
                <div className="col-6">
                    <div className="emergency-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e8eaed">
                            <path
                                d="M480-320q17 0 29.5-12.5T522-362q0-17-12.5-29.5T480-404q-17 0-29.5 12.5T438-362q0 17 12.5 29.5T480-320Zm-30-124h60q0-19 1.5-30t4.5-18q4-8 11.5-16.5T552-534q21-21 31.5-42t10.5-42q0-47-31-74.5T480-720q-41 0-72 23t-42 61l54 22q7-23 23-35.5t37-12.5q24 0 39 13t15 33q0 17-7.5 29.5T500-558q-17 14-27 25.5T458-510q-5 10-6.5 24.5T450-444Zm30 258q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
                        </svg>
                        <p className="font-semibold">Adres Uyuşmaması</p>
                    </div>
                </div>
                <div className="col-6">
                    <div className="emergency-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e8eaed">
                            <path
                                d="M160-240v-200 200ZM80-440l84-240q6-18 21.5-29t34.5-11h183q-3 20-3 40t3 40H234l-42 120h259q17 24 38 44.5t47 35.5H160v200h560v-163q21-3 41-9t39-15v307q0 17-11.5 28.5T760-80h-40q-17 0-28.5-11.5T680-120v-40H200v40q0 17-11.5 28.5T160-80h-40q-17 0-28.5-11.5T80-120v-320Zm540 160q25 0 42.5-17.5T680-340q0-25-17.5-42.5T620-400q-25 0-42.5 17.5T560-340q0 25 17.5 42.5T620-280Zm-360 0q25 0 42.5-17.5T320-340q0-25-17.5-42.5T260-400q-25 0-42.5 17.5T200-340q0 25 17.5 42.5T260-280Zm420-200q-83 0-141.5-58.5T480-680q0-82 58-141t142-59q83 0 141.5 58.5T880-680q0 83-58.5 141.5T680-480Zm-20-160h40v-160h-40v160Zm20 80q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6Z"/>
                        </svg>
                        <p className="font-semibold">Kaza</p>
                    </div>
                </div>
                <div className="col-6">
                    <div className="emergency-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e8eaed">
                            <path
                                d="M480-240q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-180q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-180q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM280-360v-46q-51-14-85.5-56T160-560h120v-46q-51-14-85.5-56T160-760h120q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760h120q0 56-34.5 98T680-606v46h120q0 56-34.5 98T680-406v46h120q0 56-34.5 98T680-206v6q0 33-23.5 56.5T600-120H360q-33 0-56.5-23.5T280-200v-6q-51-14-85.5-56T160-360h120Zm80 160h240v-560H360v560Zm0 0v-560 560Z"/>
                        </svg>
                        <p className="font-semibold">Yoğun Trafik</p>
                    </div>
                </div>
                <div className="col-6">
                    <div className="emergency-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e8eaed">
                            <path
                                d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"/>
                        </svg>
                        <p className="font-semibold">Ürün Hasar Aldı</p>
                    </div>
                </div>
                <div className="col-6">
                    <div className="emergency-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#e8eaed">
                            <path
                                d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm34-80h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z"/>
                        </svg>
                        <p className="font-semibold">Lastik Patladı</p>
                    </div>
                </div>
            </div>
        </Sidebar>
        <div className="card">
            {order !== null && <PageComponent/>}
        </div>
    </BlockUI>
}
export default ActiveOrder;

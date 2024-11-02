import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {getOrderStatuses, listenOrderEvents, getOrderDetails, getOrderLocations} from "@/helpers/globalHelper"
import {Toast} from "primereact/toast";
import {Avatar} from "primereact/avatar";
import {Tooltip} from "primereact/tooltip";
import {Tag} from "primereact/tag";
import {Link} from "@inertiajs/react";
import bicycle from "@/icons/bicycle.svg";
import motorcycle from "@/icons/motorcycle.svg";
import car from "@/icons/car.svg";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import WatchingIcon from "@/components/WatchingIcon";
import L from "leaflet";
import finishMarkerIcon from "@/icons/finishMarker.png";
import startMarkerIcon from "@/icons/startMarker.png";
import roadDotIcon from "@/icons/roadDot.png";
import {Button} from "primereact/button";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {Timeline} from "primereact/timeline";
import UserCard from "@/demo/components/apps/chat/UserCard";
import trendyolSvg from "@/icons/trendyol.svg";
import webSvg from "@/icons/web.svg";

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
const bicycleMarker = new L.Icon({
    iconUrl: bicycle,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const motorcycleMarker = new L.Icon({
    iconUrl: motorcycle,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const carMarker = new L.Icon({
    iconUrl: car,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const OrderShow = ({
                       page = true,
                       orderId = 0,
                       csrfToken = "",
                       auth = {},
                   }: {
    page?: boolean,
    orderId?: any,
    csrfToken?: any,
    auth?: any,
}) => {
    const toast = useRef<Toast>(null);
    const [orderData, setOrderData] = useState<any>(null);
    const [locations, setLocations] = useState<any>([]);
    const [watchingLocation, setWatchingLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const {setBreadcrumbs} = useContext(LayoutContext);
    const marketPlaceSvg = useMemo(() => {
        if (orderData !== null) {
            if (orderData.marketplace === "trendyol") {
                return trendyolSvg;
            }
            if (orderData.marketplace === "web") {
                return webSvg;
            }
        }
    }, [orderData])
    useEffect(() => {
        if (page) {
            setBreadcrumbs(prevState => {
                return [...prevState, {
                    labels: ["Siparişler", "Siparişi Görüntüle"],
                    to: window.location.href
                }]
            });
        }
    }, []);
    useEffect(() => {
        setLoading(true);
        getOrderDetails(orderId, csrfToken)
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

    }, []);
    useEffect(() => {
        if (orderData !== null) {
            if (orderData.id !== 0 && page) {
                let disconnect = listenOrderEvents((data: any) => {
                    console.log(data);
                    if (data.orderId === orderData.id) {
                        if (data?.reload) {
                            getOrderDetails(orderId, csrfToken)
                                .then((response) => {
                                    if (response.status) {
                                        setOrderData(response.order);
                                    } else {
                                        toast.current?.show({
                                            severity: "error",
                                            summary: "Hata",
                                            detail: response.message
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    toast.current?.show({
                                        severity: "error",
                                        summary: "Hata",
                                        detail: "Bir hata oluştu."
                                    });
                                });
                        }
                    }
                });

                return () => disconnect();
            }
        }
    }, [orderData]);
    useEffect(() => {
        if (orderData !== null) {
            if (orderData.courier !== false && orderData.courier !== null) {

                getOrderLocations(orderId, csrfToken).then((response) => {
                    if (response.status) {
                        setLocations(response.locations.map((location: any) => ({
                            latitude: location.latitude,
                            longitude: location.longitude
                        })));
                    } else {
                        toast.current?.show({severity: "error", summary: "Hata", detail: response.message});
                    }
                })
                    .catch((err) => {
                        console.log(err);
                        toast.current?.show({severity: "error", summary: "Hata", detail: "Bir hata oluştu."});
                    });
                if (orderData.status === "transporting") {
                    setWatchingLocation(true);
                    let disconnect = listenOrderEvents((data: any) => {
                        if (data.orderId === orderData.id) {
                            if (data?.onlyLocation) {
                                getOrderDetails(orderId, csrfToken)
                                    .then((response) => {
                                        if (response.status) {
                                            setOrderData(response.order);
                                        } else {
                                            toast.current?.show({
                                                severity: "error",
                                                summary: "Hata",
                                                detail: response.message
                                            });
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        toast.current?.show({
                                            severity: "error",
                                            summary: "Hata",
                                            detail: "Bir hata oluştu."
                                        });
                                    });
                            }
                        }
                    })
                    return () => {
                        disconnect();
                    }
                }
            }
        }
    }, [orderData]);
    const prepareTimeLine = useMemo(() => {
        if (orderData === null) return [];
        let order = orderData;
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
    }, [orderData]);
    const orderNumberForMarketplace = useMemo(() => {
        if (orderData !== null) {
            if (orderData.marketplace === "trendyol") {
                return orderData?.marketplace_order_details.orderNumber + " - " + orderData?.marketplace_order_details.orderCode;
            }
            if (orderData.marketplace === "web") {
                return orderData?.id;
            }
        }
    }, [orderData]);
    const orderProducts = useMemo(() => {
        if (orderData !== null) {
            if (auth.user.role === "courier") return false;
            if (orderData.marketplace === "trendyol") {
                return orderData?.marketplace_order_details.lines.map((line: any) => {
                    return {
                        name: line.name,
                        price: line.price,
                    }
                });
            }
            if (orderData.marketplace === "web") {
                return false;
            }
        }
    }, [orderData]);
    const courierVehicleSvg = useMemo(() => {
        if (orderData !== null) {
            if (orderData.courier !== false && orderData.courier !== null) {
                if (orderData.courier.details.vehicle_type === "bicycle") {
                    return bicycle;
                }
                if (orderData.courier.details.vehicle_type === "motorcycle") {
                    return motorcycle;
                }
                if (orderData.courier.details.vehicle_type === "car") {
                    return car;
                }
            }
        }
    }, [orderData]);
    const customerLocation = useMemo(() => {
        if (orderData !== null) {
            if (orderData.marketplace === "trendyol") {
                return {
                    latitude: orderData?.marketplace_order_details.address.latitude,
                    longitude: orderData?.marketplace_order_details.address.longitude
                };
            }
            if (orderData.marketplace === "web") {
                return false;
            }
        }
    }, [orderData]);
    const couierVehicleMarker = useMemo(() => {
        if (orderData !== null) {
            if (orderData.courier !== false && orderData.courier !== null) {
                if (orderData.courier.details.vehicle_type === "bicycle") {
                    return bicycleMarker;
                }
                if (orderData.courier.details.vehicle_type === "motorcycle") {
                    return motorcycleMarker;
                }
                if (orderData.courier.details.vehicle_type === "car") {
                    return carMarker;
                }
            }
        }
    }, [orderData]);
    const orderStatusTag = useMemo(() => {
        if (orderData !== null) {
            return getOrderStatuses(orderData?.status, false, orderData?.cancellation_accepted === 1, orderData?.cancellation_rejected === 1);
        }
    },[orderData])
    return <div>
        {orderData !== null && <div className="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-3 tw-mb-3">
            {orderData.status === "transporting" && orderData.courier !== false && orderData.courier !== null && locations.length > 0 &&
                <div className={"md:tw-col-span-2 grid"}>
                    <div className="col-12">
                        <span className={"text-xl font-semibold"}>Kurye Konumu
                            {orderData.status === "transporting" &&
                                <WatchingIcon speed={"fast"} connected={watchingLocation}
                                              text={"Kurye Konumu İzleniyor"}/>}
                        </span>
                    </div>
                    <div className="col-12">
                        {orderData.status === "transporting" && locations.length > 0 &&
                            <MapContainer
                                // @ts-ignore
                                center={[locations[0].latitude, locations[0].longitude]} zoom={17}
                                zoomControl
                                attributionControl={false}
                                style={{height: "350px", borderRadius: "10px"}}
                                scrollWheelZoom={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
                                {locations.map((location: any, index: any) => (
                                    <Marker key={index} position={[location.latitude, location.longitude]}
                                        // @ts-ignore
                                            icon={index === 0 ? startMarker : index === locations.length - 1 ? couierVehicleMarker : roadMarker}
                                    >
                                        <Popup>
                                            <span
                                                className={"font-semibold flex justify-content-center text-lg"}>{index === 0 ? "Başlangıç" : index === locations.length - 1 ? (orderData.status === "delivered" ? "Bitiş" : "Güzergah-" + index) : "Güzergah-" + index}</span>
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

                </div>}
            <div className={"tw-rounded tw-shadow bg-primary-50 tw-px-3 tw-py-4"}>
                {/* Sipariş Detayları*/}
                <div className={"tw-flex tw-items-center tw-justify-center tw-mb-3 "}>
                    <Avatar icon={"pi pi-file"} shape={"circle"} className={"bg-primary-300 tw-text-primary-800"}/>
                    <span className={"tw-font-semibold tw-ml-2"}>Sipariş Detayları</span>
                </div>
                <hr/>
                <div className={"tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4"}>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Sipariş Numarası
                        </div>
                        <div>
                            {orderNumberForMarketplace}
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Sipariş Durumu
                        </div>
                        <div>
                            <Tag
                                // @ts-ignore
                                value={orderStatusTag.label}
                                // @ts-ignore
                                severity={orderStatusTag.severity}
                            />
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Paket Ücreti
                        </div>
                        <div>
                            {orderData?.price} ₺
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Sipariş Kaynağı
                        </div>
                        <div>
                            <Avatar image={marketPlaceSvg} size={"normal"}
                                    className={"bg-primary-300 text-primary-800"}/>
                        </div>
                    </div>
                    {orderData?.status === "delivered" && <div>
                        <div className={"tw-font-semibold"}>
                            Teslim Tarihi
                        </div>
                        <div>
                            {new Date(orderData?.delivered_at).toLocaleString()}
                        </div>
                    </div>}
                    <div>
                        <div className={"tw-font-semibold"}>
                            Son Değişiklik
                        </div>
                        <div>
                            {new Date(orderData?.updated_at).toLocaleString()}
                        </div>
                    </div>

                </div>
            </div>
            {orderData?.status === "canceled" && <div className={"tw-rounded tw-shadow bg-primary-50 tw-px-3 tw-py-4"}>
                {/* İptal Bilgileri */}
                <div className={"tw-flex tw-items-center tw-justify-center tw-mb-3 "}>
                    <Avatar icon={"pi pi-times-circle"} shape={"circle"}
                            className={"bg-primary-300 tw-text-primary-800"}/>
                    <span className={"tw-font-semibold tw-ml-2"}>İptal Bilgileri</span>
                </div>
                <hr/>
                <div className={"tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4"}>
                    <div>
                        <div className={"tw-font-semibold"}>
                            İptal Onayı
                        </div>
                        <div>
                            {orderData?.cancellation_accepted === 1 ? "Onaylandı" : orderData?.cancellation_accepted === 0 ? "Onay Bekliyor" : "Reddedildi"}
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            İptal Talep Eden
                        </div>
                        <div>
                            {orderData?.cancellation_requested_by === "business" ? "İşletme" : "Kurye"}
                        </div>
                    </div>
                    {orderData?.cancellation_accepted === 1 && <div>
                        <div className={"tw-font-semibold"}>
                            Onaylayan Yetkili
                        </div>
                        <div>
                            {orderData?.cancellation_accepted_by.name}
                        </div>
                    </div>}
                    <div className={"md:tw-col-span-2 lg:tw-col-span-3"}>
                        <div className={"tw-font-semibold "}>
                            İptal Edilme Sebebi
                        </div>
                        <div>
                            {orderData?.cancellation_reason}
                        </div>
                    </div>

                    <div className={"md:tw-col-span-2 lg:tw-col-span-3"}>
                        <div className={"tw-font-semibold "}>
                            İptal Edilme Tarihi
                        </div>
                        <div>
                            {new Date(orderData?.canceled_at).toLocaleString()}
                        </div>
                    </div>

                </div>
            </div>}
            <div className={"tw-rounded tw-shadow bg-primary-50 tw-px-3 tw-py-4"}>
                {/* Müşteri Bilgileri */}
                <div className={"tw-flex tw-items-center tw-justify-center tw-mb-3 "}>
                    <Avatar icon={"pi pi-user"} shape={"circle"} className={"bg-primary-300 tw-text-primary-800"}/>
                    <span className={"tw-font-semibold tw-ml-2"}>Müşteri Bilgileri</span>
                </div>
                <hr/>
                <div className={"tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4"}>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Adı Soyadı
                        </div>
                        <div>
                            {orderData?.customer.name}
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Telefon Numarası
                        </div>
                        <div>
                            {orderData?.address.phone}
                        </div>
                    </div>

                    {orderData?.customer.marketplace_id !== null && <div>
                        <div className={"tw-font-semibold"}>
                            Müşteri Pazaryeri ID
                        </div>
                        <div>
                            {orderData?.customer.marketplace_id}
                        </div>
                    </div>}
                    {customerLocation && <div>
                        <div className={"tw-font-semibold"}>
                            Müşteri Konumu
                        </div>
                        <Button label={"Google Haritalarda Aç"}
                                onClick={() => {
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${customerLocation.latitude},${customerLocation.longitude}`, "_blank");
                                }}
                                severity={"info"} size={"small"} className={"tw-mt-1"} icon={"pi pi-external-link"}/>
                    </div>}
                    <div className={"md:tw-col-span-2 lg:tw-col-span-3"}>
                        <div className={"tw-font-semibold"}>
                            Müşteri Sipariş Notu
                        </div>
                        <div>
                            {orderData?.customer_note}
                        </div>
                    </div>

                </div>
            </div>
            <div className={"tw-rounded tw-shadow bg-primary-50 tw-px-3 tw-py-4"}>
                {/* Adres Bilgileri */}
                <div className={"tw-flex tw-items-center tw-justify-center tw-mb-3 "}>
                    <Avatar icon={"pi pi-map-marker"} shape={"circle"}
                            className={"bg-primary-300 tw-text-primary-800"}/>
                    <span className={"tw-font-semibold tw-ml-2"}>Adres Bilgileri</span>
                </div>
                <hr/>
                <div className={"tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4"}>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Adres Başlığı
                        </div>
                        <div>
                            {orderData?.address.title}
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Telefon Numarası
                        </div>
                        <div>
                            {orderData?.address.phone}
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            İl/İlçe
                        </div>
                        <div>
                            {orderData?.address.city} / {orderData?.address.district}
                        </div>
                    </div>
                    <div className={"md:tw-col-span-2 lg:tw-col-span-3"}>
                        <div className={"tw-font-semibold"}>
                            Adres
                        </div>
                        <div>
                            {orderData?.address.address}
                        </div>
                    </div>
                    <div className={"md:tw-col-span-2 lg:tw-col-span-3"}>
                        <div className={"tw-font-semibold"}>
                            Adres Notu
                        </div>
                        <div>
                            {orderData?.address.notes}
                        </div>
                    </div>

                </div>
            </div>
            {orderProducts && <div className={"tw-rounded tw-shadow bg-primary-50 tw-px-3 tw-py-4"}>
                {/* Ürün Bilgileri */}
                <div className={"tw-flex tw-items-center tw-justify-center tw-mb-3 "}>
                    <Avatar icon={"pi pi-folder-open"} shape={"circle"}
                            className={"bg-primary-300 tw-text-primary-800"}/>
                    <span className={"tw-font-semibold tw-ml-2"}>Ürün Bilgileri</span>
                </div>
                <hr/>
                <ul className={"tw-p-0"}>
                    {orderProducts && orderProducts.map((product: any, index: number) => (
                        <li key={index} className={"tw-flex tw-items-center tw-justify-between tw-mb-2"}>
                            <div className={"tw-flex tw-items-center"}>
                                <Avatar icon={"pi pi-shopping-cart"} shape={"circle"}
                                        className={"bg-primary-300 tw-text-primary-800"}/>
                                <span className={"tw-font-semibold tw-ml-2"}>
                                    {product.name}
                                </span>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>}
            {orderData?.courier_id !== null && auth.user.role !== "courier" &&
                <div className={"tw-rounded tw-shadow bg-primary-50 tw-px-3 tw-py-4"}>
                    {/* Kurye Bilgileri */}
                    <div className={"tw-flex tw-items-center tw-justify-center tw-mb-3 "}>
                        <Avatar icon={"pi pi-map-marker"} shape={"circle"}
                                className={"bg-primary-300 tw-text-primary-800"}/>
                        <span className={"tw-font-semibold tw-ml-2"}>Kurye Bilgileri</span>
                    </div>
                    <hr/>
                    <div className={"tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4"}>
                        <div>
                            <div className={"tw-font-semibold"}>
                                Kurye Adı Soyadı
                            </div>
                            <div>
                                {orderData?.courier.name}
                            </div>
                        </div>
                        <div>
                            <div className={"tw-font-semibold"}>
                                Telefon Numarası
                            </div>
                            <div>
                                {orderData?.courier.phone}
                            </div>
                        </div>
                        <div>
                            <div className={"tw-font-semibold"}>
                                Araç Tipi
                            </div>
                            <div>
                                <Avatar image={courierVehicleSvg} size={"normal"}
                                        className={"bg-primary-300 text-primary-800"}/>
                            </div>
                        </div>
                        <div className={"md:tw-col-span-2 lg:tw-col-span-3"}>
                            <div className={"tw-font-semibold"}>
                                Sipariş Teslim Alınma Tarihi
                            </div>
                            <div>
                                {new Date(orderData?.courier_accepted_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>}
            {orderData?.business_id !== null && <div className={"tw-rounded tw-shadow bg-primary-50 tw-px-3 tw-py-4"}>
                {/* Kurye Bilgileri */}
                <div className={"tw-flex tw-items-center tw-justify-center tw-mb-3 "}>
                    <Avatar icon={"pi pi-shop"} shape={"circle"}
                            className={"bg-primary-300 tw-text-primary-800"}/>
                    <span className={"tw-font-semibold tw-ml-2"}>İşletme Bilgileri</span>
                </div>
                <hr/>
                <div className={"tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4"}>
                    <div>
                        <div className={"tw-font-semibold"}>
                            İşletme Adı
                        </div>
                        <div>
                            {orderData?.business.name}
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            Telefon Numarası
                        </div>
                        <div>
                            {orderData?.business.phone}
                        </div>
                    </div>
                    <div>
                        <div className={"tw-font-semibold"}>
                            İl/İlçe
                        </div>
                        <div>
                            {orderData?.business.details.city} / {orderData?.business.details.state}
                        </div>
                    </div>
                    <div className={"md:tw-col-span-2 lg:tw-col-span-3"}>
                        <div className={"tw-font-semibold"}>
                            İşletme Adresi
                        </div>
                        <p>
                            {orderData?.business.details.address}
                        </p>
                    </div>
                    <div className={"md:tw-col-span-2 lg:tw-col-span-3"}>
                        <div className={"tw-font-semibold"}>
                            İşletme Konumu
                        </div>
                        <Button label={"Google Haritalarda Aç"}
                                onClick={() => {
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${orderData?.business.details.latitude},${orderData?.business.details.longitude}`, "_blank");
                                }}
                                severity={"info"} size={"small"} className={"tw-mt-1"} icon={"pi pi-external-link"}/>
                    </div>
                </div>
            </div>}
            {!watchingLocation && locations.length > 0 && <div className={"grid"}>
                <div className="col-12">
                    <MapContainer
                        // @ts-ignore
                        center={[locations[0].latitude, locations[0].longitude]} zoom={15}
                        zoomControl
                        attributionControl={false}
                        style={{height: "400px", borderRadius: "10px"}}
                        scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
                        {locations.map((location: any, index: any) => (
                            <Marker key={index} position={[location.latitude, location.longitude]}
                                    icon={index === 0 ? startMarker : index === locations.length - 1 ? (orderData.status === "delivered" ? finishMarker : roadMarker) : roadMarker}
                            >
                                <Popup>
                                            <span
                                                className={"font-semibold flex justify-content-center text-lg"}>{index === 0 ? "Başlangıç" : index === locations.length - 1 ? (orderData.status === "delivered" ? "Bitiş" : "Güzergah-" + index) : "Güzergah-" + index}</span>
                                    <Button label={"Google Maps'te Aç"}
                                            size={"small"}
                                            icon={"pi pi-external-link"}
                                            severity={"help"}
                                            className={"w-full mt-2 zoomindown"}
                                            onClick={() => {
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`, "_blank");
                                            }}/>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>}
            <div className={"tw-rounded tw-shadow bg-primary-50 tw-px-3 tw-py-4"}>
                {/* Tarihçe Bilgileri */}
                <div className={"tw-flex tw-items-center tw-justify-center tw-mb-3 "}>
                    <Avatar icon={"pi pi-user"} shape={"circle"} className={"bg-primary-300 tw-text-primary-800"}/>
                    <span className={"tw-font-semibold tw-ml-2"}>Tarihçe</span>
                </div>
                <hr/>
                <Timeline layout={"vertical"} marker={(item) => <span
                    className={`bg-${item.bg} flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1`}>
                <i className={item.icon}></i>
            </span>} value={prepareTimeLine} opposite={(item) => item.status} content={(item) => <small
                    className="text-color-secondary">{item.date.toLocaleString()}</small>}/>
            </div>
        </div>}
        <Toast ref={toast}/>
    </div>

};
export default OrderShow;

import React, {useContext, useEffect, useRef, useState} from "react";
import {acceptOrderFromCourier, getReviewOrderDetails} from "@/helpers/Courier/orders";
import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Toast} from "primereact/toast";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {getLocation, getOrderStatuses} from "@/helpers/globalHelper"
import {Tooltip} from "primereact/tooltip";
import WatchingIcon from "@/components/WatchingIcon";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Button} from "primereact/button";
import {Avatar} from "primereact/avatar";
import {Head, Link} from "@inertiajs/react";
import {Tag} from "primereact/tag";
import bicycle from "@/icons/bicycle.svg";
import motorcycle from "@/icons/motorcycle.svg";
import car from "@/icons/car.svg";
import {Timeline} from "primereact/timeline";
import L from "leaflet";
import startMarkerIcon from "@/icons/startMarker.png";
import finishMarkerIcon from "@/icons/finishMarker.png";
import roadDotIcon from "@/icons/roadDot.png";
import "leaflet/dist/leaflet.css";
import {confirmDialog} from "primereact/confirmdialog";

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
const ReviewOrder = ({auth, csrfToken, orderId, courierIsTransporting = false}: {
    auth: any,
    csrfToken: any,
    orderId: any,
    courierIsTransporting?: boolean
}) => {
    const [orderData, setOrderData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);
    const getOrder = () => {
        setLoading(true)
        getReviewOrderDetails(orderId, csrfToken)
            .then((response) => {
                if (response.status) {
                    setOrderData(response.order)
                } else {
                    toast.current?.show({
                        summary: "Hata",
                        detail: response.message,
                        severity: "error"
                    })
                }
            })
            .catch((err) => {
                console.error(err);
                toast.current?.show({
                    summary: "Hata",
                    detail: "Bir Hata Oluştu",
                    severity: "error"
                })
            })
            .finally(() => setLoading(false))
    }
    useEffect(() => {
        getOrder()
    }, []);

    const [locations, setLocations] = useState([] as any[]);
    const [watchingLocation, setWatchingLocation] = useState(false);
    const {setBreadcrumbs} = useContext(LayoutContext);
    useEffect(() => {
        setBreadcrumbs(prevState => {
            return [...prevState, {
                labels: ["Yeni Siparişler", "Siparişi Görüntüle"],
                to: window.location.href
            }]
        });
    }, [])
    // const unSubscribeChannel = () => {
    //     unsubscribeOrderEvents(orderId);
    //     setWatchingLocation(false)
    // }
    // useEffect(() => {
    //     subscribeOrderEvents(orderId, (data: any) => {
    //         if (data?.message !== undefined) {
    //             toast.current?.show({severity: data.severity, summary: data.title, detail: data.message});
    //         }
    //         if (data?.reload) {
    //             getOrder();
    //         }
    //     });
    //     return () => unSubscribeChannel();
    // }, [orderData]);
    // useEffect(() => {
    //     if (orderData?.courier !== false && orderData?.courier !== null) {
    //         getLocations(orderId, csrfToken).then((response) => {
    //             if (response.status) {
    //                 setLocations(response.locations.map((location: any) => ({
    //                     latitude: location.latitude,
    //                     longitude: location.longitude
    //                 })));
    //             } else {
    //                 toast.current?.show({severity: "error", summary: "Hata", detail: response.message});
    //             }
    //         })
    //             .catch((err) => {
    //                 console.log(err);
    //                 toast.current?.show({severity: "error", summary: "Hata", detail: "Bir hata oluştu."});
    //             });
    //         if (orderData?.status === "transporting") {
    //             setWatchingLocation(true);
    //             subscribeOrderLocationChange(orderId, (data: any) => {
    //                 setLocations((prevState) => ([...prevState, {
    //                     latitude: data.latitude,
    //                     longitude: data.longitude
    //                 }]));
    //             }, true);
    //             return () => unSubscribeChannel();
    //         }
    //     }
    // }, [orderData]);
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
            {orderData !== null && <div
                className={`col-12 lg:col-9 md:col-8`}>
                <div>
                    <Tooltip target={"[data-pr-tooltip]"} position={"bottom"} className={"zoomin"}/>
                    <div className={"grid row-gap-2"}>
                        <div className="col-12">
                            <span className={"text-xl font-semibold"}>Sipariş Bilgileri</span>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Müşteri Adı Soyadı"}>
                            <Avatar
                                icon={"pi pi-user"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <Link className={"font-semibold ml-2 text-color dark: text-decoration-none"}
                                  href={route('business.customers.edit', orderData?.customer.id)}>
                                {orderData?.customer.name}
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
                               href={`tel:${orderData?.customer.phone}`}>{orderData?.customer.phone}</a>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                             data-pr-tooltip={"Paket Ücreti"}>
                            <Avatar
                                icon={"pi pi-dollar"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <span
                                className={"font-semibold ml-2"}>{orderData?.price} ₺</span>
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
                                value={getOrderStatuses(orderData?.status).label}
                                // @ts-ignore
                                severity={getOrderStatuses(orderData?.status).severity}
                            />
                        </div>
                        {orderData?.status === "canceled" && <>
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
                                <span className={"font-semibold ml-2"}>{orderData?.cancellation_reason}</span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"İptal Edilme Sebebi"}>
                                <Avatar
                                    icon={`pi pi-${orderData?.cancellation_accepted === 1 ? "check" : "times"}-circle`}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span
                                    className={"font-semibold ml-2"}>{orderData?.cancellation_accepted === 1 ? "İptal Onaylandı" : "İptal İşlemi Onay Bekliyor"}</span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"İptal Edilme Tarihi"}>
                                <Avatar
                                    icon={`pi pi-clock`}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span
                                    className={"font-semibold ml-2"}>{new Date(String(orderData?.canceled_at)).toLocaleString()}</span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"Onaylayan Yetkili"}>
                                <Avatar
                                    icon={`pi pi-user`}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span
                                    className={"font-semibold ml-2"}>{orderData?.cancellation_accepted_by !== null ? orderData?.cancellation_accepted_by.name : "Onaylanmadı"}</span>
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
                            <span className={"font-semibold ml-2"}>{orderData?.address.title}</span>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                             data-pr-tooltip={"Adres Telefon Numarası"}>
                            <Avatar
                                icon={"pi pi-phone"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <a className={"font-semibold ml-2 text-color text-decoration-none"}
                               href={`tel:${orderData?.address.phone}`}>{orderData?.address.phone}</a>
                        </div>
                        <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"İl/İlçe"}>
                            <Avatar
                                icon={"pi pi-map"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <span
                                className={"font-semibold ml-2"}>{orderData?.address.city} / {orderData?.address.district}</span>
                        </div>
                        <div className="lg:col-6 md:col-6 col-12 cursor-pointer" data-pr-tooltip={"Adres"}>
                            <Avatar
                                icon={"pi pi-home"}
                                shape={"circle"}
                                className={"bg-primary-300 font-semibold text-primary-800"}
                            />
                            <span
                                data-pr-position={"bottom"}
                                className={"font-semibold ml-2"}>{orderData?.address.address}</span>
                        </div>
                        {orderData?.address.notes !== null &&
                            <div className="lg:col-6 md:col-6 col-12 cursor-pointer" data-pr-tooltip={"Notlar"}>
                                <Avatar
                                    icon={"pi pi-info"}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span
                                    className={"font-semibold ml-2"}>{orderData?.address.notes}</span>
                            </div>}
                        {orderData?.courier !== false && orderData?.courier !== null && <>
                            <div className="col-12">
                                <span className={"text-xl font-semibold"}>Kurye Bilgileri</span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"Kurye Adı Soyadı"}>
                                <Avatar
                                    icon={"pi pi-user"}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span className={"font-semibold ml-2"}>
                            {orderData?.courier.name}
                        </span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"Kurye Telefon Numarası"}>
                                <Avatar
                                    icon={"pi pi-phone"}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <a className={"font-semibold ml-2 text-color text-decoration-none"}
                                   href={`tel:${orderData?.courier.phone}`}>{orderData?.courier.phone}</a>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"Kurye Email Adresi"}>
                                <Avatar
                                    icon={"pi pi-envelope"}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <a className={"font-semibold ml-2 text-color text-decoration-none"}
                                   href={`mailto:${orderData?.courier.email}`}>{orderData?.courier.email}</a>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer flex align-items-center"
                                 data-pr-tooltip={"Teslimat Tipi"}>
                                <Avatar
                                    image={orderData?.courier.details.vehicle_type === "bicycle" ? bicycle : orderData?.courier.details.vehicle_type === "motorcycle" ? motorcycle : car}
                                    className={"bg-primary-300 font-semibold text-primary-800 p-1"}
                                />
                                <span className="ml-2 font-semibold">
                            {orderData?.courier.details.vehicle_type === "bicycle" ? "Bisiklet" : orderData?.courier.details.vehicle_type === "motorcycle" ? "Motosiklet" : "Araba"}
                        </span>
                            </div>
                            <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                 data-pr-tooltip={"Siparişi Teslim Alma Tarihi"}>
                                <Avatar
                                    icon={"pi pi-clock"}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span className={"font-semibold ml-2"}>
                            {orderData?.courier_accepted_at !== null ? new Date(orderData?.courier_accepted_at).toLocaleString() : "-"}
                        </span>
                            </div>
                            {orderData?.delivered_at !== null && <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                                                      data-pr-tooltip={"Siparişi Teslim Etme Tarihi"}>
                                <Avatar
                                    icon={"pi pi-stop-circle"}
                                    shape={"circle"}
                                    className={"bg-primary-300 font-semibold text-primary-800"}
                                />
                                <span className={"font-semibold ml-2"}>
                            {new Date(orderData?.delivered_at).toLocaleString()}
                        </span>
                            </div>}

                            {!watchingLocation && locations.length > 0 &&
                                <div className="col-12">
                                    <MapContainer
                                        // @ts-ignore
                                        center={[locations[0].latitude, locations[0].longitude]} zoom={15}
                                        zoomControl
                                        attributionControl={false}
                                        style={{height: "400px", borderRadius: "10px"}}
                                        scrollWheelZoom={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
                                        {locations.map((location, index) => (
                                            <Marker key={index} position={[location.latitude, location.longitude]}
                                                    icon={index === 0 ? startMarker : index === locations.length - 1 ? (orderData?.status === "delivered" ? finishMarker : roadMarker) : roadMarker}
                                            >
                                                <Popup>
                                            <span
                                                className={"font-semibold flex justify-content-center text-lg"}>{index === 0 ? "Başlangıç" : index === locations.length - 1 ? (orderData?.status === "delivered" ? "Bitiş" : "Güzergah-" + index) : "Güzergah-" + index}</span>
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
                                </div>}
                        </>}
                    </div>

                </div>
            </div>}
            <div className="col-12 lg:col-3 md:col-4">
                <Timeline layout={"vertical"} marker={(item) => <span
                    className={`bg-${item.bg} flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1`}>
                <i className={item.icon}></i>
            </span>} value={prepareTimeLine(orderData)} opposite={(item) => item.status} content={(item) => <small
                    className="text-color-secondary">{item.date.toLocaleString()}</small>}/>
            </div>
        </div>
    }
    return <PageContainer auth={auth} csrfToken={csrfToken} courierIsTransporting={courierIsTransporting}>
        <MainLayout>
            <Toast ref={toast}/>
            <Head title={"Siparişi İncele"}/>
            <div className="card">
                <span className="text-900 text-xl font-bold mb-2 block">Siparişi Al</span>
                <Button label={"Kabul Et"} severity={"success"}
                        onClick={(event) => {
                            confirmDialog({
                                header: 'Bu Siparişi Almak İstediğinize Emin misiniz ?',
                                message: 'Onayladıktan Sonra Konumunuz İzlenmeye Başlayacaktır',
                                icon: 'pi pi-info-circle',
                                acceptClassName: 'p-button-success',
                                draggable: false,
                                rejectLabel: "Vazgeç",
                                accept() {
                                    setLoading(true);
                                    // @ts-ignore
                                    getLocation(toast.current).then((location: any) => {
                                        acceptOrderFromCourier(orderId, location.latitude, location.longitude, csrfToken)
                                            .then((response) => {
                                                if (response.status) {
                                                    // TODO: Gerekli işlemleri yapmayı unutma
                                                    toast.current?.show({
                                                        severity: "success",
                                                        summary: "Başarılı",
                                                        detail: response.message
                                                    });
                                                    console.log(response)
                                                } else {
                                                    toast.current?.show({
                                                        severity: "error",
                                                        summary: "Hata",
                                                        detail: response.message
                                                    });
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                                setLoading(false)
                                                toast.current?.show({
                                                    severity: "error",
                                                    summary: "Hata",
                                                    detail: "Bir Hata Oluştu"
                                                });
                                            })
                                            .finally(() => setLoading(false))
                                    })
                                        .catch((err) => {
                                            console.log(err)
                                            setLoading(false)
                                            toast.current?.show({
                                                severity: "error",
                                                summary: "Hata",
                                                detail: "Konum Bilginiz Alınamadı"
                                            });
                                        })
                                }
                            });
                        }}
                />
            </div>
            {orderData !== null && <div className="card">
                <div className="grid">
                    <div className="col-12">
                        <span className={"text-xl font-semibold"}>İşletme Konumu</span>
                    </div>
                    <div className="col-12">
                        <MapContainer
                            // @ts-ignore
                            center={[orderData.business.details.latitude, orderData.business.details.longitude]}
                            zoom={15}
                            zoomControl
                            attributionControl={false}
                            style={{height: "350px", borderRadius: "10px"}}
                            scrollWheelZoom={false}>
                            <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
                            <Marker
                                position={[orderData.business.details.latitude, orderData.business.details.longitude]}
                                icon={startMarker}
                            >
                                <Popup>
                                            <span
                                                className={"font-semibold flex justify-content-center text-lg"}>
                                                İşletme Konumu
                                            </span>
                                    <Button label={"Google Maps'te Aç"}
                                            size={"small"}
                                            icon={"pi pi-external-link"}
                                            severity={"help"}
                                            className={"w-full mt-2"}
                                            onClick={() => {
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${orderData.business.details.latitude},${orderData.business.details.longitude}`, "_blank");
                                            }}/>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>}
            <div className="card">
                {orderData !== null && <PageComponent/>}
            </div>

        </MainLayout>
    </PageContainer>
}
export default ReviewOrder

import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {useEffect, useRef, useState} from "react";
import {
    getLocations,
    getOrder,
    getOrderStatuses,
    subscribeOrderEvents, subscribeOrderLocationChange,
    unsubscribeOrderEvents
} from "@/helpers/Business/orders";
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

interface Location {
    latitude: number;
    longitude: number;
}

interface CourierDetails {
    id: number;
    courier_id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    status: string | null;
    billing: string;
    identity: string;
    birth_date: string;
    tax_name: string | null;
    tax_number: string | null;
    tax_address: string | null;
    tax_office: string | null;
    vehicle_type: string;
    completed: number;
    approved: number;
    created_at: string;
    updated_at: string;
}

interface Courier {
    id: number;
    activated: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    profile_photo_path: string | null;
    email_verified_at: string;
    activated_at: string;
    created_at: string;
    updated_at: string;
    details: CourierDetails;
}

interface Customer {
    id: number;
    business_id: number;
    name: string;
    phone: string;
    note: string | null;
    created_at: string;
    updated_at: string;
}

interface Address {
    id: number;
    customer_id: number;
    phone: string;
    title: string;
    city: string;
    district: string;
    address: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

interface Order {
    id: number;
    business_id: number;
    customer_id: number;
    courier_id: number | null;
    address_id: number;
    customer_note: string;
    status: "draft" | "opened" | "transporting" | "delivered" | "canceled" | "deleted";
    start_location: Location;
    end_location: Location;
    cancellation_accepted: number;
    cancellation_accepted_by: number | null;
    cancellation_reason: string | null;
    marketplace: string;
    marketplace_order_id: string | null;
    marketplace_order_details: string | null;
    marketplace_transactions: string | null;
    marketplace_customer: string | null;
    delivered_at: string | null;
    canceled_at: string | null;
    courier_accepted_at: string | null;
    created_at: string;
    updated_at: string;
    customer: Customer;
    address: Address;
    courier: Courier | null | false;
}

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
    const [orderData, setOrderData] = useState<Order>(
        {
            "id": 0,
            "business_id": 0,
            "customer_id": 0,
            "courier_id": null,
            "address_id": 0,
            "customer_note": "",
            "status": "opened",
            "courier": false,
            "start_location": {
                "latitude": 0,
                "longitude": 0
            },
            "end_location": {
                "latitude": 0,
                "longitude": 0
            },
            "cancellation_accepted": 0,
            "cancellation_accepted_by": null,
            "cancellation_reason": null,
            "marketplace": "web",
            "marketplace_order_id": null,
            "marketplace_order_details": null,
            "marketplace_transactions": null,
            "marketplace_customer": null,
            "delivered_at": null,
            "canceled_at": null,
            "courier_accepted_at": null,
            "created_at": "1970-01-01T00:00:00.000Z",
            "updated_at": "1970-01-01T00:00:00.000Z",
            "customer": {
                "id": 0,
                "business_id": 0,
                "name": "",
                "phone": "",
                "note": null,
                "created_at": "1970-01-01T00:00:00.000Z",
                "updated_at": "1970-01-01T00:00:00.000Z"
            },
            "address": {
                "id": 0,
                "customer_id": 0,
                "phone": "",
                "title": "",
                "city": "",
                "district": "",
                "address": "",
                "notes": "",
                "created_at": "1970-01-01T00:00:00.000Z",
                "updated_at": "1970-01-01T00:00:00.000Z"
            }
        }
    );
    const [locations, setLocations] = useState<Location[]>([]);
    const [watchingLocation, setWatchingLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const unSubscribeChannel = () => {
        unsubscribeOrderEvents(orderId);
        setWatchingLocation(false)
    }
    useEffect(() => {
        if (page) {
            setLoading(true);
            getOrder(orderId, csrfToken)
                .then((response) => {
                    if (response.status) {
                        let order = response.order as Order;
                        setOrderData(order);
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
        if (orderData.id !== 0 && page) {
            subscribeOrderEvents(orderId, (data: any) => {
                if (data?.message !== undefined) {
                    toast.current?.show({severity: data.severity, summary: data.title, detail: data.message});
                }
                if (data?.reload) {
                    getOrder(orderId, csrfToken)
                        .then((response) => {
                            if (response.status) {
                                setOrderData(response.order as Order);
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
            return () => unSubscribeChannel();
        }
    }, [orderData]);
    useEffect(() => {
        if (orderData.courier !== false && orderData.courier !== null) {

            getLocations(orderId, csrfToken).then((response) => {
                if (response.status) {
                    setLocations(response.locations.map((location: any) => ({
                        latitude: location.latitude,
                        longitude: location.longitude
                    } as Location)) as Location[]);
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
                subscribeOrderLocationChange(orderId, (data: any) => {
                    setLocations((prevState) => ([...prevState, {
                        latitude: data.latitude,
                        longitude: data.longitude
                    } as Location]));
                });
                return () => unSubscribeChannel();
            }
        }
    }, [orderData]);
    const PageComponent = () => {
        return <div className={`${!page && 'bg-primary-50 py-2 px-3'}`}>
            <Tooltip target={"[data-pr-tooltip]"} position={"left"}/>   
            <div className={"grid row-gap-2"}>
                {orderData.status === "transporting" && orderData.courier !== false && orderData.courier !== null && locations.length > 0 && <>
                    <div className="col-12">
                        <span className={"text-xl font-semibold"}>Kurye Konumu
                            {orderData.status === "transporting" &&
                                <WatchingIcon speed={"fast"} connected={watchingLocation}
                                              text={"Kurye Konumu İzleniyor"}/>}
                        </span>
                    </div>
                    <div className="col-6">
                        {orderData.status === "transporting" && locations.length > 0 &&
                            <MapContainer
                                // @ts-ignore
                                center={[locations[0].latitude, locations[0].longitude]} zoom={13}
                                style={{height: "300px"}}
                                scrollWheelZoom={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                {locations.map((location, index) => (
                                    <Marker key={index} position={[location.latitude, location.longitude]}>
                                        <Popup>
                                            {index === 0 ? "Başlangıç" : index === locations.length - 1 ? "Bitiş" : index}
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
                    <Link className={"font-semibold ml-2 text-blue-800 text-decoration-none"}
                          href={route('business.customers.edit', orderData.customer.id)}>
                        {orderData.customer.name}
                    </Link>
                </div>
                <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Müşteri Telefon Numarası"}>
                    <Avatar
                        icon={"pi pi-phone"}
                        shape={"circle"}
                        className={"bg-primary-300 font-semibold text-primary-800"}
                    />
                    <a className={"font-semibold ml-2 text-blue-800 text-decoration-none"}
                       href={`tel:${orderData.customer.phone}`}>{orderData.customer.phone}</a>
                </div>
                <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Son Değişiklik Tarihi"}>
                    <Avatar
                        icon={"pi pi-clock"}
                        shape={"circle"}
                        className={"bg-primary-300 font-semibold text-primary-800"}
                    />
                    <span className={"font-semibold ml-2"}>{new Date(orderData.updated_at).toLocaleString()}</span>
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
                        value={getOrderStatuses(orderData.status).label}
                        // @ts-ignore
                        severity={getOrderStatuses(orderData.status).severity}
                    />
                </div>
                <div className="col-12">
                    <span className={"text-xl font-semibold"}>Adres Bilgileri</span>
                </div>
                <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Adres Başlığı"}>
                    <Avatar
                        icon={"pi pi-tag"}
                        shape={"circle"}
                        className={"bg-primary-300 font-semibold text-primary-800"}
                    />
                    <span className={"font-semibold ml-2"}>{orderData.address.title}</span>
                </div>
                <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Adres Telefon Numarası"}>
                    <Avatar
                        icon={"pi pi-phone"}
                        shape={"circle"}
                        className={"bg-primary-300 font-semibold text-primary-800"}
                    />
                    <a className={"font-semibold ml-2 text-blue-800 text-decoration-none"}
                       href={`tel:${orderData.address.phone}`}>{orderData.address.phone}</a>
                </div>
                <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"İl/İlçe"}>
                    <Avatar
                        icon={"pi pi-map"}
                        shape={"circle"}
                        className={"bg-primary-300 font-semibold text-primary-800"}
                    />
                    <span
                        className={"font-semibold ml-2"}>{orderData.address.city} / {orderData.address.district}</span>
                </div>
                <div className="lg:col-6 md:col-6 col-12 cursor-pointer" data-pr-tooltip={"Adres"}>
                    <Avatar
                        icon={"pi pi-home"}
                        shape={"circle"}
                        className={"bg-primary-300 font-semibold text-primary-800"}
                    />
                    <span
                        data-pr-position={"bottom"}
                        className={"font-semibold ml-2"}>{orderData.address.address}</span>
                </div>
                {orderData.address.notes !== null &&
                    <div className="lg:col-6 md:col-6 col-12 cursor-pointer" data-pr-tooltip={"Notlar"}>
                        <Avatar
                            icon={"pi pi-info"}
                            shape={"circle"}
                            className={"bg-primary-300 font-semibold text-primary-800"}
                        />
                        <span
                            className={"font-semibold ml-2"}>{orderData.address.notes}</span>
                    </div>}
                {orderData.courier !== false && orderData.courier !== null && <>
                    <div className="col-12">
                        <span className={"text-xl font-semibold"}>Kurye Bilgileri</span>
                    </div>
                    <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Kurye Adı Soyadı"}>
                        <Avatar
                            icon={"pi pi-user"}
                            shape={"circle"}
                            className={"bg-primary-300 font-semibold text-primary-800"}
                        />
                        <span className={"font-semibold ml-2"}>
                            {orderData.courier.name}
                        </span>
                    </div>
                    <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Kurye Telefon Numarası"}>
                        <Avatar
                            icon={"pi pi-phone"}
                            shape={"circle"}
                            className={"bg-primary-300 font-semibold text-primary-800"}
                        />
                        <a className={"font-semibold ml-2 text-blue-800 text-decoration-none"}
                           href={`tel:${orderData.courier.phone}`}>{orderData.courier.phone}</a>
                    </div>
                    <div className="lg:col-3 md:col-4 col-6 cursor-pointer" data-pr-tooltip={"Kurye Email Adresi"}>
                        <Avatar
                            icon={"pi pi-envelope"}
                            shape={"circle"}
                            className={"bg-primary-300 font-semibold text-primary-800"}
                        />
                        <a className={"font-semibold ml-2 text-blue-800 text-decoration-none"}
                           href={`mailto:${orderData.courier.email}`}>{orderData.courier.email}</a>
                    </div>
                    <div className="lg:col-3 md:col-4 col-6 cursor-pointer flex align-items-center"
                         data-pr-tooltip={"Teslimat Tipi"}>
                        <Avatar
                            image={orderData.courier.details.vehicle_type === "bicycle" ? bicycle : orderData.courier.details.vehicle_type === "motorcycle" ? motorcycle : car}
                            className={"bg-primary-300 font-semibold text-primary-800 p-1"}
                        />
                        <span className="ml-2 font-semibold">
                            {orderData.courier.details.vehicle_type === "bicycle" ? "Bisiklet" : orderData.courier.details.vehicle_type === "motorcycle" ? "Motosiklet" : "Araba"}
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
                            {orderData.courier_accepted_at !== null ? new Date(orderData.courier_accepted_at).toLocaleString() : "-"}
                        </span>
                    </div>
                    {orderData.delivered_at !== null && <div className="lg:col-3 md:col-4 col-6 cursor-pointer"
                                                             data-pr-tooltip={"Siparişi Teslim Etme Tarihi"}>
                        <Avatar
                            icon={"pi pi-stop-circle"}
                            shape={"circle"}
                            className={"bg-primary-300 font-semibold text-primary-800"}
                        />
                        <span className={"font-semibold ml-2"}>
                            {new Date(orderData.delivered_at).toLocaleString()}
                        </span>
                    </div>}
                </>}
            </div>

        </div>
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

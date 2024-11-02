import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import React, {useContext, useEffect, useRef} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {Head} from "@inertiajs/react";
import {Toast} from "primereact/toast";
import {Accordion, AccordionTab} from "primereact/accordion";
import trendyolSvg from "@/icons/trendyol.svg"
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {getIntegrations, getTrendyolRestaurantInfo, saveTrendyolSettings} from "@/helpers/Business/integrations";
import {Formik} from "formik";
import * as Yup from 'yup';
import {Badge} from "primereact/badge";
import {InputSwitch} from "primereact/inputswitch";
import {BlockUI} from "primereact/blockui";
import {Card} from "primereact/card";
import {Tag} from "primereact/tag";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Fieldset} from "primereact/fieldset";
import L from "leaflet";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import finishMarkerIcon from "@/icons/finishMarker.png";
import {InputNumber} from "primereact/inputnumber";

const finishMarker = new L.Icon({
    iconUrl: finishMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const Integrations = ({auth, csrfToken, errors}: {
    auth?: any,
    csrfToken?: string,
    errors?: any
}) => {
    const toast = useRef<Toast>(null);
    const {setBreadcrumbs} = useContext(LayoutContext);
    const [loading, setLoading] = React.useState(false);
    const [trendyolSettings, setTrendyolSettings] = React.useState<any>(false);
    const [trendyolRestaurantInfo, setTrendyolRestaurantInfo] = React.useState<any>(false);
    const [getirSettings, setGetirSettings] = React.useState(false);
    const [yemeksepetiSettings, setYemeksepetiSettings] = React.useState(false);
    const fetchIntegrations = () => {
        setLoading(true);
        getIntegrations(csrfToken).then((response) => {
            if (response.status) {
                setTrendyolSettings(response.data.trendyol);
                setGetirSettings(response.data.getir);
                setYemeksepetiSettings(response.data.yemeksepeti);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: response.message
                });
            }
        }).finally(() => setLoading(false));
    }
    useEffect(() => {
        setBreadcrumbs(prevState => {
            return [...prevState, {
                labels: ["Entegrasyonlar"],
                to: window.location.href
            }]
        });
        fetchIntegrations();
    }, []);
    return <PageContainer auth={auth} csrfToken={csrfToken} errors={errors}>
        <MainLayout>
            <Head title={"Entegrasyonlar"}/>
            <Toast ref={toast}/>
            <Accordion>
                {!loading && <AccordionTab header={<span className="flex align-items-center gap-2 w-full">
                    <img src={trendyolSvg} className={"w-4"} alt=""/>
                    <span className="font-bold white-space-nowrap">Trendyol Yemek</span>
                    </span>}>
                    <Formik
                        initialValues={{
                            supplierId: trendyolSettings?.supplierId || '',
                            apiKey: trendyolSettings?.apiKey || '',
                            apiSecret: trendyolSettings?.apiSecret || '',
                            restaurantId: trendyolSettings?.restaurantId || '',
                            autoApprove: trendyolSettings?.autoApprove || false,
                            loading: false,
                            preparationTime: trendyolSettings?.preparationTime || 0,
                            defaultPackagePrice: trendyolSettings?.defaultPackagePrice || 0
                        }}
                        validationSchema={Yup.object({
                            supplierId: Yup.string().required('Zorunlu Alan'),
                            apiKey: Yup.string().required('Zorunlu Alan'),
                            apiSecret: Yup.string().required('Zorunlu Alan'),
                            restaurantId: Yup.string().required('Zorunlu Alan'),
                            preparationTime: Yup.string().when('autoApprove', {
                                is: true,
                                then: () => Yup.string()
                                    .required('Zorunlu Alan')
                                    .matches(/^[0-9]+$/, 'Geçerli bir süre giriniz'),
                                otherwise: () => Yup.string().notRequired(),
                            }),
                            defaultPackagePrice: Yup.number().required('Zorunlu Alan').min(0, 'Paket ücreti 0 dan küçük olamaz')
                        })}
                        onSubmit={(values, {setSubmitting}) => {
                            let postData = {
                                supplierId: values.supplierId,
                                apiKey: values.apiKey,
                                apiSecret: values.apiSecret,
                                restaurantId: values.restaurantId,
                                autoApprove: values.autoApprove,
                                preparationTime: values.preparationTime,
                                defaultPackagePrice: values.defaultPackagePrice
                            };
                            saveTrendyolSettings(postData, csrfToken).then((response) => {
                                if (response.status) {
                                    toast.current?.show({
                                        severity: 'success',
                                        summary: 'Başarılı',
                                        detail: response.message
                                    });
                                    setTrendyolSettings(false);
                                    fetchIntegrations();
                                } else {
                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Hata',
                                        detail: response.message
                                    });
                                }
                            }).catch((err: any) => {
                                console.log(err);
                                toast.current?.show({
                                    severity: 'error',
                                    summary: 'Hata',
                                    detail: 'Bir hata oluştu'
                                });
                            }).finally(() => setSubmitting(false));
                        }}
                    >
                        {(props) => <BlockUI blocked={props.values.loading}>
                            <form onSubmit={props.handleSubmit} className="grid formgrid p-fluid">


                                <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                    <label htmlFor="supplierId" className={classNames("font-medium text-900")}>
                                        Satıcı Id
                                    </label>
                                    <InputText id="supplierId"
                                               type="text"
                                               autoComplete={"off"}
                                               name={"supplierId"}
                                               onChange={props.handleChange}
                                               value={props.values.supplierId}
                                        // @ts-ignore
                                               tooltip={props.errors?.supplierId}
                                               tooltipOptions={{
                                                   position: 'top',
                                               }}
                                               onBlur={props.handleBlur}
                                               className={classNames('w-full', {
                                                   'p-invalid': !!props.errors.supplierId,
                                               })}
                                    />
                                </div>
                                <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                    <label htmlFor="restaurantId" className={classNames("font-medium text-900")}>
                                        Restoran Id
                                    </label>
                                    <InputText id="restaurantId"
                                               type="text"
                                               autoComplete={"off"}
                                               name={"restaurantId"}
                                               onChange={props.handleChange}
                                               value={props.values.restaurantId}
                                        // @ts-ignore
                                               tooltip={props.errors?.restaurantId}
                                               tooltipOptions={{
                                                   position: 'top',
                                               }}
                                               onBlur={props.handleBlur}
                                               className={classNames('w-full', {
                                                   'p-invalid': !!props.errors.restaurantId,
                                               })}
                                    />
                                </div>
                                <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                    <label htmlFor="apiKey" className={classNames("font-medium text-900")}>
                                        API Key
                                    </label>
                                    <Password id="apiKey"
                                              feedback={false}
                                              toggleMask
                                              autoComplete={"off"}
                                              name={"apiKey"}
                                        // @ts-ignore
                                              tooltip={props.errors?.apiKey}
                                              tooltipOptions={{
                                                  position: 'top',
                                              }}
                                              onChange={props.handleChange}
                                              value={props.values.apiKey}
                                              onBlur={props.handleBlur}
                                              className={classNames('w-full', {
                                                  'p-invalid': !!props.errors.apiKey,
                                              })}
                                    />
                                </div>
                                <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                    <label htmlFor="apiSecret" className={classNames("font-medium text-900")}>
                                        API Secret
                                    </label>
                                    <Password id="apiSecret"
                                              feedback={false}
                                              toggleMask
                                              autoComplete={"off"}
                                              name={"apiSecret"}
                                        // @ts-ignore
                                              tooltip={props.errors?.apiSecret}
                                              tooltipOptions={{
                                                  position: 'top',
                                              }}
                                              onChange={props.handleChange}
                                              value={props.values.apiSecret}
                                              onBlur={props.handleBlur}
                                              className={classNames('w-full', {
                                                  'p-invalid': !!props.errors.apiSecret,
                                              })}
                                    />
                                </div>
                                <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                    <label htmlFor="apiSecret" className={classNames("font-medium text-900")}>
                                        API Secret
                                    </label>
                                    <Password id="apiSecret"
                                              feedback={false}
                                              toggleMask
                                              autoComplete={"off"}
                                              name={"apiSecret"}
                                        // @ts-ignore
                                              tooltip={props.errors?.apiSecret}
                                              tooltipOptions={{
                                                  position: 'top',
                                              }}
                                              onChange={props.handleChange}
                                              value={props.values.apiSecret}
                                              onBlur={props.handleBlur}
                                              className={classNames('w-full', {
                                                  'p-invalid': !!props.errors.apiSecret,
                                              })}
                                    />
                                </div>
                                <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                    <label htmlFor="defaultPackagePrice" className={classNames("font-medium text-900")}>
                                        Varsayılan Paket Ücreti
                                    </label>
                                    <InputNumber
                                        id="defaultPackagePrice"
                                        type="text"
                                        name={"defaultPackagePrice"}
                                        onValueChange={(e) => props.setFieldValue('defaultPackagePrice', e.value)}
                                        value={props.values.defaultPackagePrice}
                                        suffix={" ₺"}
                                        showButtons
                                        // @ts-ignore
                                        tooltip={(props.errors?.defaultPackagePrice)}
                                        buttonLayout="horizontal"
                                        min={0}
                                        step={5}
                                        incrementButtonIcon="pi pi-plus"
                                        decrementButtonIcon="pi pi-minus"
                                        tooltipOptions={{
                                            position: 'top',
                                        }}
                                        onBlur={props.handleBlur}
                                        className={classNames('w-full', {
                                            'p-invalid': !!props.errors.defaultPackagePrice,
                                        })}
                                    />
                                </div>
                                <div className="col-12 md:col-4">
                                    <div className="flex align-items-center h-full gap-2">

                                        <InputSwitch id="autoApprove"
                                                     name={"autoApprove"}
                                                     checked={props.values.autoApprove}
                                                     onChange={props.handleChange}
                                        />
                                        <label htmlFor="autoApprove"
                                               onClick={() => props.setFieldValue('autoApprove', !props.values.autoApprove)}
                                               className="font-medium text-900">
                                            Otomatik Sipariş Onayı
                                        </label>
                                    </div>
                                </div>
                                {props.values.autoApprove &&
                                    <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                        <label htmlFor="preparationTime" className={classNames("font-medium text-900")}>
                                            Sipariş Hazırlama Süresi
                                        </label>
                                        <InputNumber
                                            id="preparationTime"
                                            type="text"
                                            name={"preparationTime"}
                                            onValueChange={(e) => props.setFieldValue('preparationTime', e.value)}
                                            value={props.values.preparationTime}
                                            suffix={" Dakika"}
                                            showButtons
                                            // @ts-ignore
                                            tooltip={(props.errors?.preparationTime)}
                                            buttonLayout="horizontal"
                                            min={0}
                                            step={5}
                                            incrementButtonIcon="pi pi-plus"
                                            decrementButtonIcon="pi pi-minus"
                                            tooltipOptions={{
                                                position: 'top',
                                            }}
                                            onBlur={props.handleBlur}
                                            className={classNames('w-full', {
                                                'p-invalid': !!props.errors.preparationTime,
                                            })}
                                        />
                                    </div>}
                                <div className="col-12 mb-4">
                                    <Button label="Kaydet"
                                            size={"small"}
                                            severity={"success"}
                                            type={"submit"}
                                            disabled={!props.dirty || !props.isValid}
                                            loading={props.isSubmitting}
                                            className="w-auto mt-3 mr-2"/>
                                    <Button label="Test Et"
                                            size={"small"}
                                            severity={"warning"}
                                            onClick={() => {
                                                props.setFieldValue('loading', true)
                                                getTrendyolRestaurantInfo(csrfToken).then((response) => {
                                                    if (response.status) {
                                                        setTrendyolRestaurantInfo(response.data);
                                                        toast.current?.show({
                                                            severity: 'success',
                                                            summary: 'Başarılı',
                                                            detail: "Bağlantı başarılı"
                                                        });
                                                    } else {
                                                        toast.current?.show({
                                                            severity: 'error',
                                                            summary: 'Hata',
                                                            detail: response.message
                                                        });
                                                    }
                                                }).catch((err: any) => {
                                                    console.log(err);
                                                    toast.current?.show({
                                                        severity: 'error',
                                                        summary: 'Hata',
                                                        detail: 'Bir hata oluştu'
                                                    });
                                                }).finally(() => props.setFieldValue('loading', false));
                                            }}
                                            type={"button"}
                                            className="w-auto mt-3"/>
                                </div>
                                {trendyolRestaurantInfo !== false && <>
                                    <div className="col-12">
                                        <Card
                                            className={"bg-primary-50"}
                                            title={<>{trendyolRestaurantInfo.name} <Tag
                                                value={"Restoran Durumu : " + (trendyolRestaurantInfo.workingStatus === "CLOSED" ? "Kapalı" : "Açık")}
                                                className={"mr-2"}
                                                severity={trendyolRestaurantInfo.workingStatus === "CLOSED" ? "danger" : "success"}/>
                                                <Tag
                                                    value={"Kurye : " + (trendyolRestaurantInfo.deliveryType === "STORE" ? "Restoran Kuryesi" : "Trendyol Go Kuryesi")}
                                                    severity={trendyolRestaurantInfo.deliveryType === "STORE" ? "info" : "warning"}/>
                                            </>}
                                            subTitle={<>
                                                <Button
                                                    icon="pi pi-phone"
                                                    size={"small"}
                                                    severity={"help"}
                                                    className={"w-auto"}
                                                    label={trendyolRestaurantInfo.phoneNumber}
                                                    onClick={() => {
                                                        window.open(`tel:${trendyolRestaurantInfo.phoneNumber}`)
                                                    }}
                                                    type={"button"}
                                                />
                                                <Button
                                                    icon="pi pi-envelope"
                                                    size={"small"}
                                                    className={"w-auto ml-2"}
                                                    label={trendyolRestaurantInfo.email}
                                                    onClick={() => {
                                                        window.open(`mailto:${trendyolRestaurantInfo.email}`)
                                                    }}
                                                    type={"button"}
                                                />


                                            </>}
                                        >

                                            <Fieldset legend={"Adres"} toggleable>
                                                {trendyolRestaurantInfo.address}
                                            </Fieldset>
                                            <Fieldset legend={"Çalışma Saatleri"} className={"mt-2"} toggleable
                                                      collapsed>
                                                <DataTable value={trendyolRestaurantInfo.workingHours}
                                                           responsiveLayout="scroll">
                                                    <Column field="dayOfWeek"
                                                            body={(rowData: any) => {
                                                                // @ts-ignore
                                                                return {
                                                                    MONDAY: "Pazartesi",
                                                                    TUESDAY: "Salı",
                                                                    WEDNESDAY: "Çarşamba",
                                                                    THURSDAY: "Perşembe",
                                                                    FRIDAY: "Cuma",
                                                                    SATURDAY: "Cumartesi",
                                                                    SUNDAY: "Pazar"
                                                                }[rowData.dayOfWeek] || ""
                                                            }}
                                                            header="Gün"/>
                                                    <Column field="openingTime" header="Açılış Saati"/>
                                                    <Column field="closingTime" header="Kapanış Saati"/>
                                                </DataTable>
                                            </Fieldset>
                                            <Fieldset legend={"İşletme Konumu"} className={"mt-2"} toggleable collapsed>
                                                <MapContainer
                                                    // @ts-ignore
                                                    center={[trendyolRestaurantInfo.location.latitude, trendyolRestaurantInfo.location.longitude]}
                                                    zoom={15}
                                                    zoomControl
                                                    attributionControl={false}
                                                    style={{height: "350px", borderRadius: "10px"}}
                                                    scrollWheelZoom={false}>
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
                                                    <Marker
                                                        position={[trendyolRestaurantInfo.location.latitude, trendyolRestaurantInfo.location.longitude]}
                                                        // @ts-ignore
                                                        icon={finishMarker}
                                                    >
                                                        <Popup>
                                            <span
                                                className={"font-semibold flex justify-content-center text-lg"}>
                                                {trendyolRestaurantInfo.name}
                                            </span>
                                                            <Button label={"Google Maps'te Aç"}
                                                                    size={"small"}
                                                                    icon={"pi pi-external-link"}
                                                                    severity={"help"}
                                                                    className={"w-full mt-2"}
                                                                    onClick={() => {
                                                                        window.open(`https://www.google.com/maps/search/?api=1&query=${trendyolRestaurantInfo.location.latitude},${trendyolRestaurantInfo.location.longitude}`, "_blank");
                                                                    }}/>
                                                        </Popup>
                                                    </Marker>

                                                </MapContainer>
                                            </Fieldset>
                                        </Card>
                                    </div>
                                </>}
                            </form>
                        </BlockUI>}
                    </Formik>

                </AccordionTab>}
            </Accordion>
        </MainLayout>
    </PageContainer>
}
export default Integrations;

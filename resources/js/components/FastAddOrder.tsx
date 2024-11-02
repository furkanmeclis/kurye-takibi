import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head} from "@inertiajs/react";
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {useEffect, useState} from 'react';
import * as Yup from "yup";
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {classNames} from "primereact/utils";
import {InputMask} from "primereact/inputmask";
import {getAdresses, getCustomers, storeCustomer} from "@/helpers/Business/customer";
import {InputTextarea} from "primereact/inputtextarea";
import cities from "@/helpers/cityState.json";
import {Dropdown} from "primereact/dropdown";
import CreateCustomerPage from "@/Pages/Business/Customers/Create";
import {Dialog} from "primereact/dialog";
import {storeOrder} from "@/helpers/Business/orders";

interface Address {
    id: number;
    customer_id: number;
    phone: string;
    title: string;
    city: string;
    district: string;
    address: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

interface AddressesResponse {
    addresses: Address[];
}

const CreateOrderPage = ({auth, csrfToken, visible, setVisible}: {
    auth?: any,
    csrfToken?: string, visible: any, setVisible: any
}) => {

    const toast = React.useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [visibleAddCustomer, setVisibleAddCustomer] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [validationType, setValidationType] = useState(false);
    const orderCreateSchema = Yup.object().shape({
        customer_id: Yup.number().required('Müşteri Seçimi Zorunludur'),
        address_id: Yup.number().required('Adres Seçimi Zorunludur'),
        customer_note: Yup.string().nullable().min(3, 'Müşteri Notu En Az 3 Karakter Olmalıdır').max(255, 'Müşteri Notu En Fazla 255 Karakter Olmalıdır'),
        price: Yup.number().required().min(1, "Paket Ücreti En Az 1 TL Olmalıdır")
    });
    const fetchCustomers = () => {
        setLoading(true);
        getCustomers(csrfToken)
            .then((response) => {
                if (response.status) {
                    // @ts-ignore
                    setCustomers(response.customers.map((customer) => ({
                        ...customer,
                        namePhone: `${customer.name} - ${customer.phone}`
                    })));
                }
            })
            .catch((err) => {
                console.error(err);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Bir hata oluştu lütfen tekrar deneyiniz.'
                });
            })
            .finally(() => setLoading(false))
    }
    const fetchAddresses = (customerId: number) => {
        setLoading(true);
        getAdresses(customerId, csrfToken)
            .then((response) => {
                if (response.status) {
                    // @ts-ignore
                    setAddresses(response.addresses.map((address) => ({
                        ...address,
                        titleCityDistrict: `${address.title} - ${address.city} - ${address.district}`
                    })) as Address[]);
                }
            })
            .catch((err) => {
                console.error(err);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Bir hata oluştu lütfen tekrar deneyiniz.'
                });
            })
            .finally(() => setLoading(false))
    }

    const {
        values,
        setFieldValue,
        resetForm,
        submitCount,
        setErrors,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        dirty
    } = useFormik({
        initialValues: {
            customer_note: '',
            selectedCustomer: null,
            customer_id: null,
            selectedAddress: null,
            address_id: null,
            location: null,
            price: 0
        },
        validationSchema: orderCreateSchema,
        validateOnBlur: validationType,
        validateOnChange: validationType,
        onSubmit: (values) => {
            setLoading(true);
            storeOrder({
                customer_id: values.customer_id,
                address_id: values.address_id,
                customer_note: values.customer_note,
                location: values.location !== null ? values.location : null,
                price: values.price
            }, csrfToken)
                .then((response) => {
                    if (response.status) {
                        toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
                        resetForm();
                    } else {
                        toast.current?.show({severity: 'error', summary: 'Hata', detail: response.message});
                    }
                })
                .catch(() => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: 'Bir hata oluştu lütfen tekrar deneyiniz.'
                    });
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    });
    const [geoLoading, setGeoLoading] = useState(false);
    const locationUse = () => {
        setGeoLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                setGeoLoading(false);
                resetForm({
                    values: {
                        ...values,
                        // @ts-ignore
                        location: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }
                    }
                });
            }, (error) => {
                console.error(error);
                setGeoLoading(false);
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        } else {
            setGeoLoading(false);
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Tarayıcınız konum servislerini desteklemiyor.'
            })
        }

    }
    useEffect(() => {
        fetchCustomers();
    }, []);
    useEffect(() => {
        if (submitCount > 0) {
            setValidationType(true);
        }
    }, [submitCount]);
    const getShortAddress = (address: Address) => {
        return `${address.city} - ${address.district} - ${address.phone} - ${address.address}`;
    }
    return <Dialog className={"mx-3 w-full sm:mx-0 md:w-8 lg:w-8"}
                   draggable={false} modal
                   header={"Hızlı Sipariş Oluştur"}
                   visible={visible} onHide={() => setVisible(false)}>
        <Toast ref={toast}/>
        <div className="grid">
            <div className="col-12 lg:col-2">
                <div className="text-900 font-medium text-xl mb-3">Sipariş Bilgileri</div>
                <p className="m-0 p-0 text-600 line-height-3 mr-3">
                    Konumunuza en yakın kuryeyi bulmak için lütfen sipariş bilgilerini eksiksiz doldurunuz.
                    <div className={"flex gap-2"}>
                        <Button icon={"pi pi-map-marker"} size={"small"}
                                severity={values.location !== null ? "success" : "info"}
                                tooltipOptions={{
                                    position: "top"
                                }}
                                onClick={locationUse} loading={geoLoading} disabled={values.location !== null}
                                tooltip={values.location !== null ? "Konum Kullanılıyor" : "Konumumu Kullan"}
                                className={"mt-3"}/>
                        <Button icon={"pi pi-user-plus"} size={"small"} onClick={() => setVisibleAddCustomer(true)}
                                tooltipOptions={{
                                    position: "top"
                                }}
                                tooltip={"Yeni Müşteri Ekle"} className={"mt-3"}/>
                    </div>
                    {errors && Object.keys(errors).length > 0 && <>
                        <ul className="mt-3">
                            {Object.keys(errors).map((error, index) => {
                                // @ts-ignore
                                return <li key={index} className="text-red-500 text-sm">{errors[error]}</li>
                            })}
                        </ul>
                    </>}
                </p>

            </div>
            <div className="col-12 lg:col-10">
                <form onSubmit={handleSubmit} className="grid formgrid p-fluid">
                    <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                        <label htmlFor="customer_id" className={classNames("font-medium text-900", {
                            'text-red-500': !!errors.customer_id,
                            'text-green-500': !errors.customer_id && submitCount > 0,
                        })}>
                            <i className={classNames("pi", {
                                'pi-times-circle text-red-500 text-sm': !!errors.customer_id,
                                'pi-check-circle text-green-500 text-sm': !errors.customer_id && submitCount > 0,
                            })}></i> Müşteri Seçimi
                        </label>
                        <Dropdown
                            value={values.selectedCustomer}
                            onChange={(e) => {
                                if (e.value === undefined) {
                                    setFieldValue("selectedCustomer", null);
                                    setFieldValue("customer_id", null);
                                    setFieldValue("selectedAddress", null);
                                    setFieldValue("address_id", null);
                                    setAddresses([]);
                                } else {
                                    setFieldValue("selectedCustomer", e.value);
                                    setFieldValue("customer_id", e.value.id);
                                    setFieldValue("selectedAddress", null);
                                    setFieldValue("address_id", null);
                                    fetchAddresses(e.value.id);
                                }
                            }}
                            options={customers}
                            optionLabel="namePhone"
                            inputId={"customer_id"}
                            placeholder="Müşteri Seçiniz"
                            className={classNames('w-full', {
                                'p-invalid': !!errors.customer_id,
                            })}
                            filter
                            virtualScrollerOptions={{itemSize: 38}}
                            emptyMessage={"Müşteri Bulunamadı"}
                            emptyFilterMessage={"Müşteri Bulunamadı"}
                            filterBy={"namePhone"}
                        />
                    </div>
                    <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                        <label htmlFor="address_id" className={classNames("font-medium text-900", {
                            'text-red-500': !!errors.address_id,
                            'text-green-500': !errors.address_id && submitCount > 0,
                        })}>
                            <i className={classNames("pi", {
                                'pi-times-circle text-red-500 text-sm': !!errors.address_id,
                                'pi-check-circle text-green-500 text-sm': !errors.address_id && submitCount > 0,
                            })}></i> Adres Seçimi {values.selectedCustomer !== null && addresses.length === 0 &&
                            <span className={"text-red-400"}>
                                    (Müşteriye ait adres bulunamadı)
                                </span>}
                        </label>
                        <Dropdown
                            value={values.selectedAddress}
                            onChange={(e) => {
                                if (e.value === undefined) {
                                    setFieldValue("selectedAddress", null);
                                    setFieldValue("address_id", null);
                                } else {
                                    setFieldValue("selectedAddress", e.value as Address);
                                    setFieldValue("address_id", e.value.id);
                                }
                            }}
                            disabled={values.selectedCustomer === null || addresses.length === 0}
                            options={addresses}
                            optionLabel="titleCityDistrict"
                            inputId={"address_id"}
                            placeholder="Adres Seçiniz"
                            className={classNames('w-full', {
                                'p-invalid': !!errors.address_id,
                            })}
                            filter
                            virtualScrollerOptions={{itemSize: 38}}
                            emptyMessage={"Adres Bulunamadı"}
                            emptyFilterMessage={"Adres Bulunamadı"}
                            filterBy={"titleCityDistrict"}
                        />
                    </div>
                    {values.selectedAddress !== null && <div className="field mb-4 col-12 p-input-icon-right">
                        <label htmlFor="address" className={classNames("font-medium text-900")}>
                            Seçilen Adres
                        </label>
                        <InputTextarea
                            disabled
                            readOnly
                            value={values.address_id !== null ? getShortAddress(values.selectedAddress) : ""}
                        />
                    </div>}
                    <div className="field mb-4 col-12 p-input-icon-right">
                        <label htmlFor="price" className={classNames("font-medium text-900", {
                            'text-red-500': !!errors.price,
                            'text-green-500': !errors.price && submitCount > 0,
                        })}>
                            <i className={classNames("pi", {
                                'pi-times-circle text-red-500 text-sm': !!errors.price,
                                'pi-check-circle text-green-500 text-sm': !errors.price && submitCount > 0,
                            })}></i> Paket Ücreti(Kuryeye Ödenecek Miktar)
                        </label>
                        <InputText
                            autoComplete={"off"}
                            type={"number"}
                            name={"price"}
                            id={"price"}
                            min={0}
                            tooltip={errors?.price}
                            tooltipOptions={{
                                position: 'top',
                            }}
                            disabled={loading}
                            onChange={(e) => {
                                setFieldValue('price', Number(e.target.value))
                            }}
                            value={String(values.price)}
                            className={classNames('w-full', {
                                'p-invalid': !!errors.price,
                            })}
                        />
                    </div>
                    <div className="field mb-4 col-12 p-input-icon-right">
                        <label htmlFor="customer_note" className={classNames("font-medium text-900", {
                            'text-red-500': !!errors.customer_note,
                            'text-green-500': !errors.customer_note && submitCount > 0,
                        })}>
                            <i className={classNames("pi", {
                                'pi-times-circle text-red-500 text-sm': !!errors.customer_note,
                                'pi-check-circle text-green-500 text-sm': !errors.customer_note && submitCount > 0,
                            })}></i> Sipariş Notu
                        </label>
                        <InputTextarea
                            autoComplete={"off"}
                            name={"customer_note"}
                            id={"customer_note"}
                            tooltip={errors?.customer_note}
                            tooltipOptions={{
                                position: 'top',
                            }}
                            disabled={loading}
                            onChange={handleChange}
                            value={values.customer_note}
                            className={classNames('w-full', {
                                'p-invalid': !!errors.customer_note,
                            })}
                        />
                    </div>

                    <div className="col-12">
                        <Button label="Sipariş Oluştur"
                                disabled={!isValid}
                                loading={loading}
                                type={"submit"}
                                size={"small"}
                                className="w-auto mt-3"/>
                    </div>
                </form>
            </div>
        </div>
        <Dialog onHide={() => setVisibleAddCustomer(false)} visible={visibleAddCustomer}
                header="Yeni Müşteri Ekle"
                style={{width: '60vw'}}
                draggable={false} resizable={false}
                className="mx-3 w-full sm:mx-0 md:w-8 lg:w-6 p-fluid" modal>
            <CreateCustomerPage auth={auth} csrfToken={csrfToken} page={false} onComplete={() => {
                setVisibleAddCustomer(false);
                fetchCustomers();
            }}/>
        </Dialog>
    </Dialog>
}
export default CreateOrderPage;

import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head} from "@inertiajs/react";
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {useContext, useEffect, useState} from 'react';
import * as Yup from "yup";
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {classNames} from "primereact/utils";
import {InputMask} from "primereact/inputmask";
import {
    destroyAddress,
    getAdresses,
    getCustomer, storeAdress,
    storeCustomer,
    updateAdress,
    updateCustomer
} from "@/helpers/Business/customer";
import {InputTextarea} from "primereact/inputtextarea";
import cities from "@/helpers/cityState.json";
import {Dropdown} from "primereact/dropdown";
import {Accordion, AccordionTab} from "primereact/accordion";
import {BlockUI} from "primereact/blockui";
import {confirmPopup} from "primereact/confirmpopup";
import {Dialog} from "primereact/dialog";
import {LayoutContext} from "@/layout/context/layoutcontext";

interface State {
    plaka_kodu: string;
    ilce_kodu: string;
    il_adi: string;
    ilce_adi: string;
    nufus: string;
    erkek_nufus: string;
    kadin_nufus: string;
}

interface City {
    il_adi: string;
    plaka_kodu: string;
    alan_kodu: string;
    nufus: string;
    bolge: string;
    yuzolcumu: string;
    nufus_artisi: string;
    erkek_nufus_yuzde: string;
    erkek_nufus: string;
    kadin_nufus_yuzde: string;
    kadin_nufus: string;
    nufus_yuzdesi_genel: string;
    ilceler: State[];
    kisa_bilgi: string;
}

const EditCustomerPage = ({auth, csrfToken, customerId}: {
    auth?: any,
    csrfToken?: string,
    customerId?: any
}) => {
    const {setBreadcrumbs} = useContext(LayoutContext)
    const toast = React.useRef<Toast>(null);
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<any>({});
    const [addresses, setAddresses] = useState([]);
    const [validationType, setValidationType] = useState(false);
    const signUpSchema = Yup.object().shape({
        name: Yup.string().required('Ad soyad giriniz').min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
        phone: Yup.string().required('Telefon numarası giriniz').matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Geçerli bir telefon numarası giriniz'),
        note: Yup.string().nullable().min(3, 'Müşteri notu en az 3 karakter olmalıdır'),
    });
    const {
        values,
        resetForm,
        submitCount,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        dirty
    } = useFormik({
        initialValues: {
            name: '',
            phone: '',
            note: '',
        },
        validationSchema: signUpSchema,
        validateOnChange: validationType,
        validateOnBlur: validationType,
        onSubmit: (values) => {
            setLoading(true);
            updateCustomer(customerId, values, csrfToken)
                .then((response) => {
                    if (response.status) {
                        toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
                        let resetData = {
                            values: {
                                name: values.name,
                                phone: values.phone,
                                note: values.note ?? '',
                            }
                        }
                        resetForm(resetData);
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
    useEffect(() => {
        if (submitCount > 0) {
            setValidationType(true);
        }
    }, [submitCount]);
    useEffect(() => {
        getCustomer(customerId, csrfToken)
            .then((response: any) => {
                if (response.status) {
                    let resetData = {
                        name: response.customer.name,
                        phone: response.customer.phone,
                        note: response.customer.note ?? '',
                    }
                    setCustomer(response.customer)
                    resetForm({
                        values: resetData
                    });
                    getAdresses(customerId, csrfToken)
                        .then((response) => {
                            if (response.status) {
                                setAddresses(response.addresses);
                            }
                        })
                        .catch((err) => {
                            console.error(err)
                            toast.current?.show({
                                severity: 'error',
                                summary: 'Hata',
                                detail: 'Adresler alınamadı'
                            });
                        })
                        .finally(() => {
                            setLoading(false);
                        })
                } else {
                    setLoading(false);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: response.message
                    });
                }
            })
            .catch((err) => {
                console.error(err)
                setLoading(false);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'İşletme bilgileri alınamadı'
                });
            });
    }, [customerId]);
    useEffect(() => {
        setBreadcrumbs(prevState => {
            return [...prevState, {
                labels: ["Müşteriler", "Müşteriyi Düzenle"],
                to: window.location.href
            }]
        });

    }, [customer])
    const refreshAddresses = () => {
        setLoading(true);
        getAdresses(customerId, csrfToken)
            .then((response) => {
                if (response.status) {
                    setAddresses(response.addresses);
                }
            })
            .catch((err) => {
                console.error(err)
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Adresler alınamadı'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }
    const [visible, setVisible] = useState(false);
    const AddressComponent = ({addressProp, newAddress = false, deleteBlocked = false}: {
        addressProp: any,
        newAddress?: boolean,
        deleteBlocked?: boolean
    }) =>
    {
        const [address, setAddress] = useState(addressProp);
        const [componentLoading, setComponentLoading] = useState(false);
        const [validationType2, setValidationType2] = useState(false);
        const [selectedCity, setSelectedCity] = useState<City>(cities.find((city) => String(city.il_adi).toLowerCase() === String(address.city).toLowerCase()) as City);
        let initialValues = newAddress ? {
                title: '',
                city: cities[0].il_adi,
                district: cities[0].ilceler[0].ilce_adi,
                address: '',
                phone: '',
                notes: '',
                selectedCity: cities[0] as City,
                selectedDistrict: cities[0].ilceler[0] as State,
            } :
            {
                title: address.title,
                city: address.city,
                district: address.district,
                address: address.address,
                phone: address.phone,
                notes: address.notes ?? '',
                selectedCity: selectedCity,
                selectedDistrict: selectedCity.ilceler.find((district) => String(district.ilce_adi).toLocaleLowerCase() === String(address.district).toLocaleLowerCase()) as State,
            }
        let formik2 = useFormik({
            initialValues: initialValues,
            validationSchema: Yup.object().shape({
                title: Yup.string().required('Adres başlığı giriniz').min(2, 'Adres başlığı en az 2 karakter olmalıdır'),
                phone: Yup.string().required('Adres telefon numarası giriniz').matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Geçerli bir adres telefon numarası giriniz'),
                city: Yup.string().required('Şehir seçiniz'),
                district: Yup.string().required('İlçe seçiniz'),
                address: Yup.string().required('Adres giriniz').min(5, 'Adres en az 5 karakter olmalıdır'),
                notes: Yup.string().nullable().min(3, 'Adres notu en az 3 karakter olmalıdır'),
            }),
            validateOnChange: validationType2,
            validateOnBlur: validationType2,
            onSubmit: (values2) => {
                setComponentLoading(true);
                let transaction = newAddress ? storeAdress(customerId, values2, csrfToken) : updateAdress(address.id, values2, csrfToken);
                transaction
                    .then((response) => {
                        if (response.status) {
                            refreshAddresses();
                            toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
                        } else {
                            toast.current?.show({severity: 'error', summary: 'Hata', detail: response.message});
                        }
                    })
                    .catch((err) => {
                        console.error("Adresler", address.id, err);
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Hata',
                            detail: 'Bir hata oluştu lütfen tekrar deneyiniz.'
                        });
                    })
                    .finally(() => {
                        setComponentLoading(false)
                        setVisible(false);
                    });
            }
        });
        useEffect(() => {
            if (formik2.submitCount > 0) {
                setValidationType2(true);
            }
        }, [formik2.submitCount]);
        return <BlockUI blocked={componentLoading}
                        template={<div
                            className={"flex align-items-center  flex-column text-white font-semibold justify-center"}>
                            <i className="pi pi-spin pi-spinner text-white mb-3" style={{fontSize: '3rem'}}></i>
                            Adres Bilgileri Kaydediliyor...
                        </div>}
        >
            <form onSubmit={formik2.handleSubmit} className="grid formgrid p-fluid">
                <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                    <label htmlFor={"addresss_title" + address.id} className={classNames("font-medium text-900", {
                        'text-red-500': !!formik2.errors.title,
                        'text-green-500': !formik2.errors.title && formik2.submitCount > 0,
                    })}>
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500 text-sm': !!formik2.errors.title,
                            'pi-check-circle text-green-500 text-sm': !formik2.errors.title && formik2.submitCount > 0,
                        })}></i> Adres Başlığı
                    </label>
                    <InputText id={"addresss_title" + address.id}
                               type="text"
                               autoComplete={"off"}
                               name={"title"}
                               tooltip={formik2.errors?.title ? String(formik2.errors.title) : undefined}
                               tooltipOptions={{
                                   position: 'top',
                               }}
                               disabled={componentLoading}
                               onChange={formik2.handleChange} value={formik2.values.title}
                               className={classNames('w-full', {
                                   'p-invalid': !!formik2.errors.title,
                               })}
                    />
                </div>
                <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                    <label htmlFor="address_phone"
                           className={classNames("font-medium text-900", {
                               'text-red-500': !!formik2.errors.phone,
                               'text-green-500': !formik2.errors.phone && formik2.submitCount > 0,
                           })}>
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500 text-sm': !!formik2.errors.phone,
                            'pi-check-circle text-green-500 text-sm': !formik2.errors.phone && formik2.submitCount > 0,
                        })}></i> Adres Telefon Numarası
                    </label>
                    <InputMask
                        autoComplete={"off"}
                        name={"phone"}
                        tooltip={formik2.errors?.phone ? String(formik2.errors.phone) : undefined}
                        tooltipOptions={{
                            position: 'top',
                            event: 'focus',
                            className: 'text-red-500'
                        }}
                        disabled={componentLoading}
                        onChange={formik2.handleChange} value={formik2.values.phone}
                        mask={"(999)-999-9999"}
                        className={classNames('w-full', {
                            'p-invalid': !!formik2.errors.phone,
                        })}
                    />
                </div>
                <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                    <label htmlFor={"address_city" + address.id} className={classNames("font-medium text-900", {
                        'text-red-500': !!formik2.errors.city,
                        'text-green-500': !formik2.errors.city && submitCount > 0,
                    })}>
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500 text-sm': !!formik2.errors.city,
                            'pi-check-circle text-green-500 text-sm': !formik2.errors.city && formik2.submitCount > 0,
                        })}></i> İl
                    </label>
                    <Dropdown
                        value={formik2.values.selectedCity}
                        onChange={(e) => {
                            formik2.setFieldValue("city", e.value.il_adi);
                            formik2.setFieldValue("selectedCity", e.value);
                            formik2.setFieldValue("district", e.value.ilceler[0].ilce_adi);
                            formik2.setFieldValue("selectedDistrict", e.value.ilceler[0]);
                        }}
                        options={cities}
                        optionLabel="il_adi"
                        inputId={"address_city" + address.id}
                        placeholder="Şehir Seçiniz"
                        className={classNames('w-full', {
                            'p-invalid': !!formik2.errors.city,
                        })}
                        filter
                        disabled={componentLoading}
                        virtualScrollerOptions={{itemSize: 38}}
                        emptyMessage={"Şehir Bulunamadı"}
                        emptyFilterMessage={"Şehir Bulunamadı"}
                        filterBy={"il_adi"}/>
                </div>
                <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                    <label htmlFor={"address_district" + address.id} className={classNames("font-medium text-900", {
                        'text-red-500': !!formik2.errors.district,
                        'text-green-500': !formik2.errors.district && formik2.submitCount > 0,
                    })}>
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500 text-sm': !!formik2.errors.district,
                            'pi-check-circle text-green-500 text-sm': !formik2.errors.district && formik2.submitCount > 0,
                        })}></i> İlçe
                    </label>
                    <Dropdown value={formik2.values.selectedDistrict}
                              inputId={"address_district" + address.id}
                              disabled={formik2.values.selectedCity === null || componentLoading}
                              onChange={(e) => {
                                  formik2.setFieldValue("district", e.value.ilce_adi);
                                  formik2.setFieldValue("selectedDistrict", e.value);
                              }}
                              options={formik2.values.selectedCity?.ilceler}
                              optionLabel="ilce_adi"
                              placeholder="İlçe Seçiniz"
                              className={classNames('w-full', {
                                  'p-invalid': !!formik2.errors.district,
                              })}
                              filter
                              virtualScrollerOptions={{itemSize: 38}}
                              emptyMessage={"İlçe Bulunamadı"}
                              emptyFilterMessage={"İlçe Bulunamadı"}
                              filterBy={"ilce_adi"}/>
                </div>
                <div className="field mb-4 col-12 p-input-icon-right">
                    <label htmlFor={"address" + address.id} className={classNames("font-medium text-900", {
                        'text-red-500': !!formik2.errors.address,
                        'text-green-500': !formik2.errors.address && formik2.submitCount > 0,
                    })}>
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500 text-sm': !!formik2.errors.address,
                            'pi-check-circle text-green-500 text-sm': !formik2.errors.address && formik2.submitCount > 0,
                        })}></i> Adres
                    </label>
                    <InputTextarea
                        autoComplete={"off"}
                        name={"address"}
                        id={"address" + address.id}
                        tooltip={formik2.errors?.address ? String(formik2.errors.address) : undefined}
                        tooltipOptions={{
                            position: 'top',
                            event: 'focus',
                        }}
                        placeholder={"Müşteri adresi"}
                        disabled={componentLoading}
                        onChange={formik2.handleChange}
                        value={formik2.values.address}
                        className={classNames('w-full', {
                            'p-invalid': !!formik2.errors.address,
                        })}
                    />
                </div>
                <div className="field mb-4 col-12 p-input-icon-right">
                    <label htmlFor={"address_notes" + address.id} className={classNames("font-medium text-900", {
                        'text-red-500': !!formik2.errors.notes,
                        'text-green-500': !formik2.errors.notes && formik2.submitCount > 0,
                    })}>
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500 text-sm': !!formik2.errors.notes,
                            'pi-check-circle text-green-500 text-sm': !formik2.errors.notes && formik2.submitCount > 0,
                        })}></i> Adres Notu
                    </label>
                    <InputTextarea
                        autoComplete={"off"}
                        name={"notes"}
                        id={"address_notes" + address.id}
                        tooltip={formik2.errors?.notes ? String(formik2.errors.notes) : undefined}
                        tooltipOptions={{
                            position: 'top',
                            event: 'focus',
                        }}
                        placeholder={"Adres Notu (Zorunlu Değil)"}
                        disabled={componentLoading}
                        onChange={formik2.handleChange}
                        value={formik2.values.notes}
                        className={classNames('w-full', {
                            'p-invalid': !!formik2.errors.notes,
                        })}
                    />
                </div>
                <div className="col-12 flex justify-content-between">
                    <Button label={newAddress ? "Ekle" : "Güncelle"}
                            disabled={!formik2.isValid || !formik2.dirty}
                            loading={componentLoading}
                            type={"submit"}
                            size={"small"}
                            className="w-auto mt-3"/>
                    {!newAddress &&
                        <Button label="Sil"
                                severity={"danger"}
                                icon={"pi pi-trash"}
                                visible={!deleteBlocked}
                                loading={componentLoading}
                                type={"button"}
                                size={"small"}
                                onClick={(event) => {
                                    confirmPopup({
                                        target: event.currentTarget,
                                        message: "Adresi silmek istediğinize emin misiniz?",
                                        icon: "pi pi-exclamation-triangle",
                                        acceptClassName: "p-button-danger",
                                        acceptLabel: "Sil",
                                        rejectLabel: "Vazgeç",
                                        accept() {
                                            destroyAddress(address.id, csrfToken).then((response) => {
                                                if (response.status) {
                                                    toast.current?.show({
                                                        severity: 'success',
                                                        summary: 'Başarılı',
                                                        detail: response.message
                                                    });
                                                    setAddresses(prevState => prevState.filter((item: any) => item.id !== address.id));
                                                } else {
                                                    toast.current?.show({
                                                        severity: 'error',
                                                        summary: 'Hata',
                                                        detail: response.message
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }}
                                className="w-auto mt-3"/>}
                </div>
            </form>
        </BlockUI>
    }
    return <PageContainer auth={auth} csrfToken={csrfToken}>

        <MainLayout>
            <BlockUI blocked={loading} baseZIndex={1000} template={<div
                className={"flex align-items-center  flex-column text-white font-semibold justify-center"}>
                <i className="pi pi-spin pi-spinner text-white mb-3" style={{fontSize: '3rem'}}></i>Müşteri Bilgileri
                Yükleniyor</div>}>
                <Head title={customer?.name !== "" ? "'" + customer?.name + "' Adlı Müşteriyi Düzenle" : ""}/>
                <Toast ref={toast}/>
                <div className="card">
                <span
                    className="text-900 text-xl font-bold mb-4 block">{customer?.name !== "" ? "'" + customer?.name + "' Adlı Müşteriyi Düzenle" : ""} </span>
                    <div className="grid">
                        <div className="col-12 lg:col-2">
                            <div className="text-900 font-medium text-xl mb-3">Müşteri Bilgileri</div>
                            <p className="m-0 p-0 text-600 line-height-3 mr-3">
                                Güncellemek İstediğiniz Müşteri Bilgilerini Aşağıdaki Formu Doldurarak
                                Güncelleyebilirsiniz.
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
                                    <label htmlFor="name" className={classNames("font-medium text-900", {
                                        'text-red-500': !!errors.name,
                                        'text-green-500': !errors.name && submitCount > 0,
                                    })}>
                                        <i className={classNames("pi", {
                                            'pi-times-circle text-red-500 text-sm': !!errors.name,
                                            'pi-check-circle text-green-500 text-sm': !errors.name && submitCount > 0,
                                        })}></i> Müşteri Ad Soyad
                                    </label>
                                    <InputText id="name"
                                               type="text"
                                               autoComplete={"off"}
                                               name={"name"}
                                               tooltip={errors?.name}
                                               tooltipOptions={{
                                                   position: 'top',
                                               }}
                                               disabled={loading}
                                               onChange={handleChange} value={values.name}
                                               className={classNames('w-full', {
                                                   'p-invalid': !!errors.name,
                                               })}
                                    />
                                </div>
                                <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                    <label htmlFor="phone" className={classNames("font-medium text-900", {
                                        'text-red-500': !!errors.phone,
                                        'text-green-500': !errors.phone && submitCount > 0,
                                    })}>
                                        <i className={classNames("pi", {
                                            'pi-times-circle text-red-500 text-sm': !!errors.phone,
                                            'pi-check-circle text-green-500 text-sm': !errors.phone && submitCount > 0,
                                        })}></i> Telefon Numarası
                                    </label>
                                    <InputMask
                                        autoComplete={"off"}
                                        name={"phone"}
                                        tooltip={errors?.phone}
                                        tooltipOptions={{
                                            position: 'top',
                                            event: 'focus',
                                            className: 'text-red-500'
                                        }}
                                        disabled={loading}
                                        onChange={handleChange} value={values.phone}
                                        mask={"(999)-999-9999"}
                                        className={classNames('w-full', {
                                            'p-invalid': !!errors.phone,
                                        })}
                                    />
                                </div>
                                <div className="field mb-4 col-12 p-input-icon-right">
                                    <label htmlFor="note" className={classNames("font-medium text-900", {
                                        'text-red-500': !!errors.note,
                                        'text-green-500': !errors.note && submitCount > 0,
                                    })}>
                                        <i className={classNames("pi", {
                                            'pi-times-circle text-red-500 text-sm': !!errors.note,
                                            'pi-check-circle text-green-500 text-sm': !errors.note && submitCount > 0,
                                        })}></i> Müşteri Notu
                                    </label>
                                    <InputTextarea
                                        autoComplete={"off"}
                                        name={"note"}
                                        id={"note"}
                                        tooltip={errors?.note}
                                        tooltipOptions={{
                                            position: 'top',
                                        }}
                                        placeholder={"Bu alanı sadece işletme sahibi olarak siz görebilirsiniz.Zorunlu değildir."}
                                        disabled={loading}
                                        onChange={handleChange}
                                        value={values.note}
                                        className={classNames('w-full', {
                                            'p-invalid': !!errors.note,
                                        })}
                                    />
                                </div>
                                <div className="col-12">
                                    <Button label="Kaydet"
                                            disabled={!isValid || !dirty}
                                            loading={loading}
                                            type={"submit"}
                                            size={"small"}
                                            className="w-auto mt-3"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="grid">
                        <div className="col-12 lg:col-2">
                            <div className="text-900 font-medium text-xl mb-3">Müşteri Adresleri</div>
                            <p className="m-0 p-0 text-600 line-height-3 mr-3 mb-3">
                                Müşteriye ait adresleri aşağıdaki listeden görebilir ve düzenleyebilirsiniz.
                            </p>
                            <div>
                                <Button label="Yeni Adres Ekle" size={"small"} icon="pi pi-plus" onClick={() => {
                                    setVisible(true);
                                }}/>
                            </div>
                        </div>
                        <div className="col-12 lg:col-10">
                            <Accordion>
                                {addresses?.map((address: any, index: number) => <AccordionTab key={index}
                                                                                               header={`Adres Başlığı : ${address.title}`}>
                                    <AddressComponent addressProp={address} deleteBlocked={addresses.length === 1}/>
                                </AccordionTab>)}
                            </Accordion>
                            <Dialog onHide={() => setVisible(false)} visible={visible} header="Yeni Adres Ekle"
                                    style={{width: '50vw'}}
                                    draggable={false} resizable={false}
                                    className="mx-3 sm:mx-0 sm:w-full md:w-8 lg:w-6 p-fluid" modal>
                                <AddressComponent addressProp={{}} newAddress={true}/>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </BlockUI>
        </MainLayout>
    </PageContainer>
}
export default EditCustomerPage;

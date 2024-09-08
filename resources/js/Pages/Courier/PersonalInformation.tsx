import {useFormik} from "formik";
import * as Yup from 'yup';
import React, {useContext, useEffect, useState} from "react";
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {InputMask} from "primereact/inputmask";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {SelectButton} from "primereact/selectbutton";
import {Dropdown} from "primereact/dropdown";
import cities from "@/helpers/cityState.json";
import taxOfficies from "@/helpers/taxOfficies.json";
import {Calendar} from "primereact/calendar";
import {InputTextarea} from "primereact/inputtextarea";
import {Divider} from "primereact/divider";
import bicycle from "@/icons/bicycle.svg";
import motorcycle from "@/icons/motorcycle.svg";
import car from "@/icons/car.svg";
import {getPersonalInformation, savePersonalInformation} from "@/helpers/Courier/account";
import {Steps} from "primereact/steps";
import {Message} from "primereact/message";
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

interface VergiDairesi {
    id: number;
    il_id: any;
    ilce: string;
    say_kodu: number;
    vergi_dairesi: string;
}

interface CourierDetails {
    name?: string,
    phone?: string,
    email?: string,
    address?: string,
    city?: string,
    selectedCity?: any,
    state?: string,
    selectedState?: any,
    zip?: string,
    country?: string,
    billing?: string,
    identity?: string,
    birth_date?: any,
    tax_name?: string,
    tax_number?: string,
    tax_address?: string,
    tax_office?: string,
    selectedTaxOffice?: any,
    vehicle_type?: string,
}

const PersonalInformation = ({page = false, profileCompleted = false}: {
    page: boolean,
    profileCompleted?: boolean
}) => {

    const {setBreadcrumbs, setLayoutConfig} = useContext(LayoutContext);
    const [completed, setCompleted] = useState(false);
    const [activeState, setActiveState] = useState(0);
    const toast = React.useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [validationType, setValidationType] = useState(false);
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Ad soyad giriniz')
            .min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
        email: Yup.string()
            .email('Geçerli bir email adresi giriniz')
            .required('Email adresinizi giriniz'),

        phone: Yup.string()
            .required('Telefon numarası giriniz')
            .matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Geçerli bir telefon numarası giriniz'),
        address: Yup.string().required('Adresinizi giriniz').min(10, 'Adres en az 10 karakter olmalıdır'),
        city: Yup.string().required('Şehir bilgisini seçiniz'),
        state: Yup.string().required('İlçe bilgisini seçiniz'),
        zip: Yup.string().required('Posta kodu giriniz').matches(/^\d{5}$/, 'Geçerli bir posta kodu giriniz'),
        country: Yup.string().required('Ülke bilgisini seçiniz'),
        status: Yup.string().nullable(),
        billing: Yup.mixed().oneOf(['individual', 'company']).required('Fatura türünü seçiniz'),
        identity: Yup.string().when('billing', {
            is: 'individual',
            then: () => Yup.string().required('Kimlik numarası zorunludur').max(11, 'Kimlik numarası 11 karakter olmalıdır').min(11, 'Kimlik numarası 11 karakter olmalıdır'),
            otherwise: () => Yup.string().nullable(),
        }),
        birth_date: Yup.string().when('billing', {
            is: 'individual',
            then: () => Yup.string().required('Doğum tarihi zorunludur'),
            otherwise: () => Yup.string().nullable(),
        }),
        tax_name: Yup.string().when('billing', {
            is: 'company',
            then: () => Yup.string().required('Vergi mükellefi adı zorunludur'),
            otherwise: () => Yup.string().nullable(),
        }),
        tax_number: Yup.string().when('billing', {
            is: 'company',
            then: () => Yup.string().required('Vergi numarası zorunludur').max(10, 'Vergi numarası 10 karakter olmalıdır').min(10, 'Vergi numarası 10 karakter olmalıdır'),
            otherwise: () => Yup.string().nullable(),
        }),
        tax_address: Yup.string().when('billing', {
            is: 'company',
            then: () => Yup.string().required('Vergi adresi zorunludur').min(10, 'Adres en az 10 karakter olmalıdır'),
            otherwise: () => Yup.string().nullable(),
        }),
        tax_office: Yup.string().when('billing', {
            is: 'company',
            then: () => Yup.string().required('Vergi dairesi zorunludur'),
            otherwise: () => Yup.string().nullable(),
        }),
        vehicle_type: Yup.mixed().oneOf(['car', 'motorcycle', 'bicycle']).required('Araç türü zorunludur'),
    });
    let cityNames = cities.map((city) => city.il_adi);
    let selectedCity: City = cities[0];
    let selectedState: State = selectedCity.ilceler[0];
    let selectedTaxOffice: VergiDairesi = taxOfficies[0];
    let {
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
            name: '',
            phone: '',
            email: '',
            address: '',
            city: selectedCity.il_adi,
            selectedCity,
            state: selectedState.ilce_adi,
            selectedState: selectedState,
            zip: '',
            country: 'turkey',
            billing: 'individual',
            identity: '',
            birth_date: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
            tax_name: '',
            tax_number: '',
            tax_address: '',
            tax_office: selectedTaxOffice.vergi_dairesi,
            selectedTaxOffice,
            vehicle_type: 'motorcycle',
        },
        validationSchema,
        validateOnChange: validationType,
        validateOnBlur: validationType,
        onSubmit: (values) => {
            let formData: CourierDetails = {};
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'birth_date') {
                    let dateValue = value as Date;
                    // @ts-ignore
                    formData[key] = `${String(dateValue.getDate()).padStart(2, '0')}.${String(dateValue.getMonth() + 1).padStart(2, "0")}.${dateValue.getFullYear()}`;
                } else if (key !== 'selectedCity' && key !== 'selectedState' && key !== 'selectedTaxOffice') {
                    // @ts-ignore
                    formData[key] = String(value);
                }
            });
            if (values.billing === 'company') {
                delete formData?.identity;
                delete formData?.birth_date;

            } else if (values.billing === 'individual') {
                delete formData?.tax_name;
                delete formData?.tax_number;
                delete formData?.tax_address;
                delete formData?.tax_office;
            }
            setLoading(true);
            savePersonalInformation(formData).then((response) => {
                if (response.status) {
                    let newData = response.details;
                    let resetData = {
                        name: newData.name,
                        phone: newData.phone,
                        email: newData.email,
                        address: newData.address,
                        city: newData.city,
                        selectedCity: {} as City,
                        state: newData.state,
                        selectedState: {} as State,
                        zip: newData.zip,
                        country: newData.country,
                        billing: newData.billing,
                        identity: newData.identity || '',
                        birth_date: new Date(),
                        tax_name: newData.tax_name || '',
                        tax_number: newData.tax_number || '',
                        tax_address: newData.tax_address || '',
                        tax_office: newData.tax_office || '',
                        selectedTaxOffice: {} as VergiDairesi,
                        vehicle_type: newData.vehicle_type,
                    };
                    resetData.selectedCity = cities.find((city) => city.il_adi === newData.city) as City;
                    resetData.selectedState = resetData.selectedCity.ilceler.find((state) => state.ilce_adi === newData.state) as State;
                    if (resetData.billing === 'individual') {
                        let dateParts = newData.birth_date.split(".");
                        resetData.birth_date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));

                    } else if (resetData.billing === 'company') {
                        resetData.selectedTaxOffice = taxOfficies.find((office) => office.vergi_dairesi === newData.tax_office) as VergiDairesi;
                    }
                    resetForm({values: resetData});
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Başarılı',
                        detail: response.message
                    });
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: response.message
                    });
                }
            }).catch((err) => {
                console.log(err)
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
        if (!profileCompleted) {
            setLoading(true);
            getPersonalInformation().then(({status, details, courier}) => {
                if (status) {
                    let resetData = {
                        name: details.name,
                        phone: details.phone,
                        email: details.email,
                        address: details.address,
                        city: details.city,
                        selectedCity: {} as City,
                        state: details.state,
                        selectedState: {} as State,
                        zip: details.zip,
                        country: details.country,
                        billing: details.billing,
                        identity: details.identity || '',
                        birth_date: new Date(),
                        tax_name: details.tax_name || '',
                        tax_number: details.tax_number || '',
                        tax_address: details.tax_address || '',
                        tax_office: details.tax_office || '',
                        selectedTaxOffice: {} as VergiDairesi,
                        vehicle_type: details.vehicle_type,
                    };
                    if (resetData?.city !== null) {
                        resetData.selectedCity = cities.find((city) => city.il_adi === details.city) as City;
                        resetData.selectedState = resetData.selectedCity.ilceler.find((state) => state.ilce_adi === details.state) as State;
                    } else {
                        resetData.selectedCity = cities[0];
                        resetData.selectedState = cities[0].ilceler[0];
                    }

                    if (resetData.billing === 'individual') {
                        if (resetData?.birth_date !== null) {
                            let dateParts = details.birth_date.split(".");
                            resetData.birth_date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
                        } else {
                            resetData.birth_date = new Date();
                        }
                    } else if (resetData.billing === 'company') {
                        if (resetData?.tax_office !== null) {
                            resetData.selectedTaxOffice = taxOfficies.find((office) => office.vergi_dairesi === details.tax_office) as VergiDairesi;
                        } else {
                            resetData.selectedTaxOffice = taxOfficies[0];
                        }
                    }
                    setCompleted(details?.completed === 1);
                    resetForm({values: resetData});
                }
            }).catch((err) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Bir hata oluştu lütfen tekrar deneyiniz.'
                });
            }).finally(() => {
                setLoading(false);
            });
        }
        setBreadcrumbs([]);
        setLayoutConfig(prevState => ({...prevState, menuMode: "overlay"}));

    }, []);

    return (
        <div className={"card"}>
            <Toast ref={toast}/>
            <span
                className="text-900 text-xl font-bold mb-4 block">Profilinizi Tamamlayın</span>
            <div className="grid">
                <div className="col-12 lg:col-2">
                    <div className="text-900 font-medium text-xl mb-3">Kişisek Bilgileriniz</div>
                    <p className="m-0 p-0 text-600 line-height-3 mr-3">
                        Sistemdeki bilgilerinizin güncel olması gerekmektedir. Lütfen aşağıdaki alanları doldurunuz.
                        Onay
                        sürecinden sonra üyeliğiniz aktif edilecektir.
                    </p>
                    {activeState === 1 && <><Divider/>
                        <div className="field mb-4 w-full">
                            <label htmlFor="billing" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.billing,
                                'text-green-500': !errors.billing && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.billing,
                                    'pi-check-circle text-green-500 text-sm': !errors.billing && submitCount > 0,
                                })}></i> Faturalandırma Türü
                            </label>
                            <SelectButton
                                options={
                                    [
                                        {
                                            name: 'Bireysel',
                                            value: 'individual',
                                            icon: 'pi pi-user'
                                        },
                                        {
                                            name: 'Kurumsal',
                                            value: 'company',
                                            icon: 'pi pi-briefcase'
                                        }
                                    ]
                                }
                                optionLabel={"name"}
                                tooltip={"Bireysel / Kurumsal"}
                                tooltipOptions={{
                                    position: 'top',
                                }}
                                className={"w-full"}
                                itemTemplate={(option: any) => {
                                    return (
                                        <div className="flex align-items-center" title={option.name}>
                                            <i className={option.icon + " text-xl"}></i>
                                        </div>
                                    );
                                }}
                                allowEmpty={false} optionValue={"value"} value={values.billing} onChange={(e) => {
                                if (e.value !== null) setFieldValue('billing', e.value);
                            }}/>
                        </div>
                    </>}

                </div>
                <div className="col-12 lg:col-10">
                    <Steps model={[
                        {
                            label: 'Giriş'
                        },
                        {
                            label: 'Detaylar'
                        }
                    ]} readOnly={false} onSelect={(e) => setActiveState(e.index)} activeIndex={activeState}

                           className={"mb-4"}
                    />
                    {activeState === 0 && <>
                        <div>
                            {!completed ? <Message
                                className={"w-full"}
                                severity={"success"}
                                text={"Profil Bilgilerinizi Kaydettiniz Ancak *Yönetici Onayı* Beklemektedir. Değiştirmek istediğiniz bilgileri sonraki ekrandan yönetebilirsiniz."}/> : <>
                                <Message
                                    className={"w-full"}
                                    severity={"warn"}
                                    text={"Profil Bilgilerinizi Sonraki Formdan Ekleyiniz. Onay sürecinden sonra üyeliğiniz aktif edilecektir."}/>

                            </>}
                        </div>
                        <div className="grid">
                            <div className="col-12 flex justify-content-end mt-4">
                                <Button label={"İlerle"} size={"small"} severity={"success"} icon={"pi pi-arrow-right"}
                                        onClick={() => {
                                            setActiveState(1);
                                        }}/>
                            </div>
                        </div>
                    </>}
                    {activeState === 1 && <form onSubmit={handleSubmit} className="grid formgrid p-fluid">
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="name" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.name,
                                'text-green-500': !errors.name && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.name,
                                    'pi-check-circle text-green-500 text-sm': !errors.name && submitCount > 0,
                                })}></i> Ad Soyad
                            </label>
                            <InputText id="name"
                                       type="text"
                                       autoComplete={"off"}
                                       name={"name"}

                                       tooltip={errors.name}
                                       tooltipOptions={{
                                           position: 'top',
                                       }}
                                       readOnly
                                       disabled={true}
                                       onChange={handleChange} value={values.name}
                                       className={classNames('w-full', {
                                           'p-invalid': !!errors.name,
                                       })}
                            />
                        </div>
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="email" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.email,
                                'text-green-500': !errors.email && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.email,
                                    'pi-check-circle text-green-500 text-sm': !errors.email && submitCount > 0,
                                })}></i> Email Adresi
                            </label>
                            <InputText id="email"
                                       type="email"
                                       autoComplete={"off"}
                                       name={"email"}
                                       readOnly
                                       tooltip={errors?.email}
                                       tooltipOptions={{
                                           position: 'top',
                                       }}
                                       disabled={true}
                                       onChange={handleChange} value={values.email}
                                       className={classNames('w-full', {
                                           'p-invalid': !!errors.email,
                                       })}
                            />
                        </div>
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
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
                                readOnly
                                tooltip={errors?.phone}
                                tooltipOptions={{
                                    position: 'top',
                                    event: 'focus',
                                    className: 'text-red-500'
                                }}
                                disabled={true}
                                onChange={handleChange} value={values.phone}
                                mask={"(999)-999-9999"}
                                className={classNames('w-full', {
                                    'p-invalid': !!errors.phone,
                                })}
                            />
                        </div>
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="city" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.city,
                                'text-green-500': !errors.city && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.city,
                                    'pi-check-circle text-green-500 text-sm': !errors.city && submitCount > 0,
                                })}></i> İl
                            </label>
                            <Dropdown value={values.selectedCity} onChange={(e) => {
                                setFieldValue("city", e.value.il_adi);
                                setFieldValue("selectedCity", e.value);
                                setFieldValue("state", e.value.ilceler[0].ilce_adi);
                                setFieldValue("selectedState", e.value.ilceler[0]);
                            }} options={cities}
                                      optionLabel="il_adi"
                                      inputId={"city"}
                                      placeholder="Şehir Seçiniz" className={classNames('w-full', {
                                'p-invalid': !!errors.city,
                            })}
                                      filter virtualScrollerOptions={{itemSize: 38}}
                                      emptyMessage={"Şehir Bulunamadı"} emptyFilterMessage={"Şehir Bulunamadı"}
                                      filterBy={"il_adi"}/>
                        </div>
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="state" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.state,
                                'text-green-500': !errors.state && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.state,
                                    'pi-check-circle text-green-500 text-sm': !errors.state && submitCount > 0,
                                })}></i> İlçe
                            </label>
                            <Dropdown value={values.selectedState} inputId={"state"} disabled={values.city === null}
                                      onChange={(e) => {
                                          setFieldValue("state", e.value.ilce_adi);
                                          setFieldValue("selectedState", e.value);
                                      }}
                                      options={values.selectedCity?.ilceler}
                                      optionLabel="ilce_adi"
                                      placeholder="İlçe Seçiniz" className={classNames('w-full', {
                                'p-invalid': !!errors.state,
                            })} filter
                                      virtualScrollerOptions={{itemSize: 38}}
                                      emptyMessage={"İlçe Bulunamadı"} emptyFilterMessage={"İlçe Bulunamadı"}
                                      filterBy={"ilce_adi"}/>
                        </div>
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="country" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.country,
                                'text-green-500': !errors.country && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.country,
                                    'pi-check-circle text-green-500 text-sm': !errors.country && submitCount > 0,
                                })}></i> Ülke
                            </label>
                            <Dropdown value={"turkey"}
                                      inputId={"country"}
                                      options={[{
                                          label: 'Türkiye',
                                          value: 'turkey'
                                      }]}
                                      optionLabel="label"
                                      placeholder="Ülke Seçiniz" className={classNames('w-full', {
                                'p-invalid': !!errors.country,
                            })}/>
                        </div>
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="name" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.zip,
                                'text-green-500': !errors.zip && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.zip,
                                    'pi-check-circle text-green-500 text-sm': !errors.zip && submitCount > 0,
                                })}></i> Posta Kodu
                            </label>
                            <InputText id="name"
                                       type="text"
                                       autoComplete={"off"}
                                       name={"zip"}
                                       tooltip={errors.zip}
                                       tooltipOptions={{
                                           position: 'top',
                                       }}
                                       disabled={loading}
                                       onChange={handleChange} value={values.zip}
                                       className={classNames('w-full', {
                                           'p-invalid': !!errors.zip,
                                       })}
                            />
                        </div>
                        <div className="field mb-4 col-12 md:col-8  p-input-icon-right">
                            <label htmlFor="address" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.address,
                                'text-green-500': !errors.address && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.address,
                                    'pi-check-circle text-green-500 text-sm': !errors.address && submitCount > 0,
                                })}></i> Adres
                            </label>
                            <InputTextarea id="name"
                                           autoComplete={"off"}
                                           name={"address"}
                                           tooltip={errors.address}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           disabled={loading}
                                           onChange={handleChange} value={values.address}
                                           className={classNames('w-full', {
                                               'p-invalid': !!errors.address,
                                           })}
                            />
                        </div>
                        {values.billing === 'individual' && <>
                            <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                <label htmlFor="identity" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.identity,
                                    'text-green-500': !errors.identity && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.identity,
                                        'pi-check-circle text-green-500 text-sm': !errors.identity && submitCount > 0,
                                    })}></i> Kimlik Numarası
                                </label>
                                <InputText id="identity"
                                           autoComplete={"off"}
                                           name={"identity"}
                                           tooltip={errors.identity}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           disabled={loading}
                                           onChange={handleChange} value={values.identity}
                                           className={classNames('w-full', {
                                               'p-invalid': !!errors.identity,
                                           })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                <label htmlFor="birth_date" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.birth_date,
                                    'text-green-500': !errors.birth_date && submitCount > 0,
                                })}
                                >
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.birth_date,
                                        'pi-check-circle text-green-500 text-sm': !errors.birth_date && submitCount > 0,
                                    })}></i> Doğum Tarihi (gg.aa.yyyy)
                                </label>
                                <Calendar inputId="birth_date"
                                          name={"birth_date"}
                                          disabled={loading}
                                          tooltip={errors?.birth_date && String(errors?.birth_date)}
                                          tooltipOptions={{
                                              position: 'top',
                                          }}
                                          maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                                          onChange={(e) => {
                                              setFieldValue('birth_date', e.value)
                                          }} value={values.birth_date}
                                          className={classNames('w-full', {
                                              'p-invalid': !!errors.birth_date,
                                          })}
                                />
                            </div>
                        </>}
                        {values.billing === 'company' && <>
                            <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                <label htmlFor="tax_name" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.tax_name,
                                    'text-green-500': !errors.tax_name && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.tax_name,
                                        'pi-check-circle text-green-500 text-sm': !errors.tax_name && submitCount > 0,
                                    })}></i> Vergi Mükellefi Adı
                                </label>
                                <InputText id="tax_name"
                                           autoComplete={"off"}
                                           name={"tax_name"}
                                           tooltip={errors.tax_name}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           disabled={loading}
                                           onChange={handleChange} value={values.tax_name}
                                           className={classNames('w-full', {
                                               'p-invalid': !!errors.tax_name,
                                           })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                <label htmlFor="tax_number" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.tax_number,
                                    'text-green-500': !errors.tax_number && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.tax_number,
                                        'pi-check-circle text-green-500 text-sm': !errors.tax_number && submitCount > 0,
                                    })}></i> Vergi Numarası
                                </label>
                                <InputText id="tax_number"
                                           autoComplete={"off"}
                                           name={"tax_number"}
                                           type={"number"}
                                           tooltip={errors.tax_number}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           disabled={loading}
                                           onChange={handleChange} value={values.tax_number}
                                           className={classNames('w-full', {
                                               'p-invalid': !!errors.tax_number,
                                           })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                <label htmlFor="tax_office" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.tax_office,
                                    'text-green-500': !errors.tax_office && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.tax_office,
                                        'pi-check-circle text-green-500 text-sm': !errors.tax_office && submitCount > 0,
                                    })}></i> Vergi Dairesi
                                </label>
                                <Dropdown value={values.selectedTaxOffice} onChange={(e) => {
                                    setFieldValue("selectedTaxOffice", e.value);
                                    setFieldValue("tax_office", e.value.vergi_dairesi);
                                }} options={taxOfficies}
                                          optionLabel="vergi_dairesi"
                                          inputId={"tax_office"}
                                          placeholder="Vergi Dairenizi Seçiniz"
                                          className={classNames('w-full', {
                                              'p-invalid': !!errors.city,
                                          })}
                                          filter
                                          virtualScrollerOptions={{itemSize: 38}}
                                          emptyMessage={"Vergi Dairesi Bulunamadı"}
                                          emptyFilterMessage={"Vergi Dairesi Bulunamadı"}
                                          filterBy={"vergi_dairesi"}
                                          valueTemplate={(option: VergiDairesi) => {
                                              return (
                                                  <span>{cityNames[option.il_id - 1]} - {option.vergi_dairesi} - {option.say_kodu}</span>
                                              );
                                          }}
                                          itemTemplate={(option: VergiDairesi) => {
                                              return (
                                                  <span>{cityNames[option.il_id - 1]} - {option.vergi_dairesi} - {option.say_kodu}</span>
                                              );
                                          }}
                                />
                            </div>
                            <div className="field mb-4 col-12 p-input-icon-right">
                                <label htmlFor="tax_address" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.tax_address,
                                    'text-green-500': !errors.tax_address && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.tax_address,
                                        'pi-check-circle text-green-500 text-sm': !errors.tax_address && submitCount > 0,
                                    })}></i> Vergi Adresi
                                </label>
                                <InputTextarea id="tax_address"
                                               autoComplete={"off"}
                                               name={"tax_address"}
                                               tooltip={errors.tax_address}
                                               tooltipOptions={{
                                                   position: 'top',
                                               }}
                                               disabled={loading}
                                               onChange={handleChange} value={values.tax_address}
                                               className={classNames('w-full', {
                                                   'p-invalid': !!errors.tax_address,
                                               })}
                                />
                            </div>
                        </>}
                        <div className="field mb-4 col-12">
                            <label htmlFor="vehicle" className={classNames("font-medium text-900", {
                                'text-red-500': !!errors.billing,
                                'text-green-500': !errors.billing && submitCount > 0,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': !!errors.billing,
                                    'pi-check-circle text-green-500 text-sm': !errors.billing && submitCount > 0,
                                })}></i> Teslimat Türü
                            </label>
                            <SelectButton options={[{
                                name: 'Bisiklet',
                                value: 'bicycle',
                                icon: bicycle
                            }, {
                                name: 'Motorsiklet',
                                value: 'motorcycle',
                                icon: motorcycle
                            }, {
                                name: 'Araba',
                                value: 'car',
                                icon: car
                            }]} optionLabel={"name"} optionValue={"value"} value={values.vehicle_type}
                                          itemTemplate={(option: any) => {
                                              return (
                                                  <div className="flex align-items-center">
                                                      <img src={option.icon} alt={option.name}
                                                           className="w-2rem h-2rem mr-2"/>
                                                      <p className={"font-semibold"}>{option.name}</p>
                                                  </div>
                                              );
                                          }}
                                          onChange={(e) => {
                                              if (e.value !== null) setFieldValue('vehicle_type', e.value);
                                          }}/>
                        </div>

                        <div className="col-12">
                            <Button label="Bilgilerimi Kaydet"
                                    disabled={!isValid || !dirty}
                                    loading={loading}
                                    size={"small"}
                                    type={"submit"}
                                    className="w-auto mt-3"/>
                        </div>
                    </form>}

                </div>
            </div>

        </div>
    );
}
export default PersonalInformation;

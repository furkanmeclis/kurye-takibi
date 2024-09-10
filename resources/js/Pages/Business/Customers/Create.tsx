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
import {storeCustomer} from "@/helpers/Business/customer";
import {InputTextarea} from "primereact/inputtextarea";
import cities from "@/helpers/cityState.json";
import {Dropdown} from "primereact/dropdown";

const CreateCustomerPage = ({auth, csrfToken}: {
    auth?: any,
    csrfToken?: string
}) => {
    const toast = React.useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [validationType, setValidationType] = useState(false);
    const signUpSchema = Yup.object().shape({
        name: Yup.string().required('Ad soyad giriniz').min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
        phone: Yup.string().required('Telefon numarası giriniz').matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Geçerli bir telefon numarası giriniz'),
        note: Yup.string().nullable().min(3, 'Müşteri notu en az 3 karakter olmalıdır'),
        address_title: Yup.string().required('Adres başlığı giriniz').min(2, 'Adres başlığı en az 2 karakter olmalıdır'),
        address_phone: Yup.string().required('Adres telefon numarası giriniz').matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Geçerli bir adres telefon numarası giriniz'),
        address_city: Yup.string().required('Şehir seçiniz'),
        address_district: Yup.string().required('İlçe seçiniz'),
        address: Yup.string().required('Adres giriniz').min(5, 'Adres en az 5 karakter olmalıdır'),
        address_notes: Yup.string().nullable().min(3, 'Adres notu en az 3 karakter olmalıdır'),
    });
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
            name: '',
            phone: '',
            note: '',
            address_title: '',
            address_city: cities[0].il_adi,
            selectedCity: cities[0],
            address_district: cities[0].ilceler[0].ilce_adi,
            selectedDistrict: cities[0].ilceler[0],
            address_phone: '',
            address: '',
            address_notes: '',
        },
        validationSchema: signUpSchema,
        validateOnChange: validationType,
        validateOnBlur: validationType,
        onSubmit: (values) => {
            setLoading(true);
            storeCustomer(values, csrfToken)
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
    useEffect(() => {
        if (submitCount > 0) {
            setValidationType(true);
        }
    }, [submitCount]);
    return <PageContainer auth={auth} csrfToken={csrfToken}>
        <MainLayout>
            <Head title="Yeni İşletme Ekle"/>
            <Toast ref={toast}/>
            <div className="card">
                <span className="text-900 text-xl font-bold mb-4 block">Yeni Müşteri Ekle</span>
                <div className="grid">
                    <div className="col-12 lg:col-2">
                        <div className="text-900 font-medium text-xl mb-3">Müşteri Bilgileri</div>
                        <p className="m-0 p-0 text-600 line-height-3 mr-3">
                            Adres Eklemek Zorunludur. Eklenecek Adres Daha Sonra Düzenlenebilir.
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
                            <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                <label htmlFor="addresss_title" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.address_title,
                                    'text-green-500': !errors.address_title && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.address_title,
                                        'pi-check-circle text-green-500 text-sm': !errors.address_title && submitCount > 0,
                                    })}></i> Adres Başlığı
                                </label>
                                <InputText id="addresss_title"
                                           type="text"
                                           autoComplete={"off"}
                                           name={"address_title"}
                                           tooltip={errors?.address_title}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           disabled={loading}
                                           onChange={handleChange} value={values.address_title}
                                           className={classNames('w-full', {
                                               'p-invalid': !!errors.address_title,
                                           })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                <label htmlFor="address_phone"
                                       className={classNames("font-medium text-900 flex align-items-center gap-1", {
                                           'text-red-500': !!errors.address_phone,
                                           'text-green-500': !errors.address_phone && submitCount > 0,
                                       })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.address_phone,
                                        'pi-check-circle text-green-500 text-sm': !errors.address_phone && submitCount > 0,
                                    })}></i> Adres Telefon Numarası
                                    <div>
                                        <Button
                                            type={"button"}
                                            label={"Müşteri Telefonunu Kullan"} severity={"success"}
                                                className={"p-0 px-2"} size={"small"} onClick={() => {
                                            setFieldValue("address_phone", values.phone);
                                        }}/>
                                    </div>
                                </label>
                                <InputMask
                                    autoComplete={"off"}
                                    name={"address_phone"}
                                    tooltip={errors?.address_phone}
                                    tooltipOptions={{
                                        position: 'top',
                                        event: 'focus',
                                        className: 'text-red-500'
                                    }}
                                    disabled={loading}
                                    onChange={handleChange} value={values.address_phone}
                                    mask={"(999)-999-9999"}
                                    className={classNames('w-full', {
                                        'p-invalid': !!errors.address_phone,
                                    })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                <label htmlFor="address_city" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.address_city,
                                    'text-green-500': !errors.address_city && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.address_city,
                                        'pi-check-circle text-green-500 text-sm': !errors.address_city && submitCount > 0,
                                    })}></i> İl
                                </label>
                                <Dropdown
                                    value={values.selectedCity}
                                    onChange={(e) => {
                                        setFieldValue("address_city", e.value.il_adi);
                                        setFieldValue("selectedCity", e.value);
                                        setFieldValue("district", e.value.ilceler[0].ilce_adi);
                                        setFieldValue("selectedDistrict", e.value.ilceler[0]);
                                    }}
                                    options={cities}
                                    optionLabel="il_adi"
                                    inputId={"address_city"}
                                    placeholder="Şehir Seçiniz"
                                    className={classNames('w-full', {
                                        'p-invalid': !!errors.address_city,
                                    })}
                                    filter
                                    virtualScrollerOptions={{itemSize: 38}}
                                    emptyMessage={"Şehir Bulunamadı"}
                                    emptyFilterMessage={"Şehir Bulunamadı"}
                                    filterBy={"il_adi"}/>
                            </div>
                            <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                <label htmlFor="address_district" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.address_district,
                                    'text-green-500': !errors.address_district && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.address_district,
                                        'pi-check-circle text-green-500 text-sm': !errors.address_district && submitCount > 0,
                                    })}></i> İlçe
                                </label>
                                <Dropdown value={values.selectedDistrict}
                                          inputId={"address_district"}
                                          disabled={values.selectedCity === null}
                                          onChange={(e) => {
                                              setFieldValue("address_district", e.value.ilce_adi);
                                              setFieldValue("selectedDistrict", e.value);
                                          }}
                                          options={values.selectedCity?.ilceler}
                                          optionLabel="ilce_adi"
                                          placeholder="İlçe Seçiniz"
                                          className={classNames('w-full', {
                                              'p-invalid': !!errors.address_district,
                                          })}
                                          filter
                                          virtualScrollerOptions={{itemSize: 38}}
                                          emptyMessage={"İlçe Bulunamadı"}
                                          emptyFilterMessage={"İlçe Bulunamadı"}
                                          filterBy={"ilce_adi"}/>
                            </div>
                            <div className="field mb-4 col-12 p-input-icon-right">
                                <label htmlFor="address" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.address,
                                    'text-green-500': !errors.address && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.address,
                                        'pi-check-circle text-green-500 text-sm': !errors.address && submitCount > 0,
                                    })}></i> Adres
                                </label>
                                <InputTextarea
                                    autoComplete={"off"}
                                    name={"address"}
                                    id={"address"}
                                    tooltip={errors?.address}
                                    tooltipOptions={{
                                        position: 'top',
                                        event: 'focus',
                                    }}
                                    placeholder={"Müşteri adresi"}
                                    disabled={loading}
                                    onChange={handleChange}
                                    value={values.address}
                                    className={classNames('w-full', {
                                        'p-invalid': !!errors.address,
                                    })}
                                />
                            </div>
                            <div className="field mb-4 col-12 p-input-icon-right">
                                <label htmlFor="address_notes" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.address_notes,
                                    'text-green-500': !errors.address_notes && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.address_notes,
                                        'pi-check-circle text-green-500 text-sm': !errors.address_notes && submitCount > 0,
                                    })}></i> Adres Notu
                                </label>
                                <InputTextarea
                                    autoComplete={"off"}
                                    name={"address_notes"}
                                    id={"address_notes"}
                                    tooltip={errors?.address_notes}
                                    tooltipOptions={{
                                        position: 'top',
                                        event: 'focus',
                                    }}
                                    placeholder={"Adres Notu (Zorunlu Değil)"}
                                    disabled={loading}
                                    onChange={handleChange}
                                    value={values.address_notes}
                                    className={classNames('w-full', {
                                        'p-invalid': !!errors.address_notes,
                                    })}
                                />
                            </div>
                            <div className="col-12">
                                <Button label="Müşteriyi Ekle"
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
        </MainLayout>
    </PageContainer>
}
export default CreateCustomerPage;

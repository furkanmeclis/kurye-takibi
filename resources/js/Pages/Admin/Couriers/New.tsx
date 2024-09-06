import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import {Head, router} from "@inertiajs/react";
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {useEffect, useState} from 'react';
import * as Yup from "yup";
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {classNames} from "primereact/utils";
import {InputMask} from "primereact/inputmask";
import {InputSwitch} from "primereact/inputswitch";

const NewCourier = ({auth, csrfToken}: {
    auth?: any,
    csrfToken?: string
}) => {
    const toast = React.useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [validationType, setValidationType] = useState(false);
    const signUpSchema = Yup.object().shape({
        email: Yup.string().email('Geçerli bir email adresi giriniz').required('Email adresinizi giriniz'),
        name: Yup.string().required('Ad soyad giriniz').min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
        password: Yup.string().required('Şifre giriniz').min(6, 'Şifre en az 6 karakter olmalıdır').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, 'Şifreniz en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
        password_confirmation: Yup.string().required('Şifreyi tekrar giriniz').oneOf([Yup.ref('password'), ""], 'Şifreler uyuşmuyor'),
        phone: Yup.string().required('Telefon numarası giriniz').matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Geçerli bir telefon numarası giriniz')
    });
    const {values, setFieldValue,resetForm, submitCount, setErrors, handleChange, handleSubmit, errors, isValid} = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            account_verification: true
        },
        validationSchema: signUpSchema,
        validateOnChange: validationType,
        validateOnBlur: validationType,
        onSubmit: (values) => {
            setLoading(true);
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('X-CSRF-TOKEN', csrfToken || '');
            fetch(route("admin.couriers.store"), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({...values, account_verification: values.account_verification ? 1 : 0})
            })
                .then(response => response.json())
                .then((response) => {
                    if (response.status) {
                        toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
                        resetForm();
                    } else {
                        let cacheErrors = {};
                        if (response?.emailExists && response?.emailExists === true) {
                            cacheErrors = {...cacheErrors, email: 'Bu email adresi zaten kullanılmakta'}
                        }
                        if (response?.phoneExists && response?.phoneExists === true) {
                            cacheErrors = {...cacheErrors, phone: 'Bu telefon numarası zaten kullanılmakta'}
                        }
                        setErrors(cacheErrors);
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
            <Head title="Yeni Kurye Ekle"/>
            <Toast ref={toast}/>
            <div className="card">
                <span className="text-900 text-xl font-bold mb-4 block">Yeni Kurye Ekle</span>
                <div className="grid">
                    <div className="col-12 lg:col-2">
                        <div className="text-900 font-medium text-xl mb-3">Kurye Bilgileri</div>
                        <p className="m-0 p-0 text-600 line-height-3 mr-3">İstatistikler İçin Tüm Bilgileri Tam Bir
                            Şekilde Doldurunuz.
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
                                    })}></i> Ad Soyad
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
                                           tooltip={errors?.email}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           disabled={loading}
                                           onChange={handleChange} value={values.email}
                                           className={classNames('w-full', {
                                               'p-invalid': !!errors.email,
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
                            <div className="col-6"></div>
                            <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                <label htmlFor="password" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.password,
                                    'text-green-500': !errors.password && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.password,
                                        'pi-check-circle text-green-500 text-sm': !errors.password && submitCount > 0,
                                    })}></i> Şifre
                                </label>
                                <InputText id="password"
                                           type="password"
                                           autoComplete={"off"}
                                           name={"password"}
                                           tooltip={errors?.password}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           disabled={loading}
                                           onChange={handleChange} value={values.password}
                                           className={classNames('w-full', {
                                               'p-invalid': !!errors.password,
                                           })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                <label htmlFor="password_confirmation" className={classNames("font-medium text-900", {
                                    'text-red-500': !!errors.password_confirmation,
                                    'text-green-500': !errors.password_confirmation && submitCount > 0,
                                })}>
                                    <i className={classNames("pi", {
                                        'pi-times-circle text-red-500 text-sm': !!errors.password_confirmation,
                                        'pi-check-circle text-green-500 text-sm': !errors.password_confirmation && submitCount > 0,
                                    })}></i> Şifre
                                </label>
                                <InputText id="password_confirmation"
                                           type="password"
                                           autoComplete={"off"}
                                           name={"password_confirmation"}
                                           tooltip={errors?.password_confirmation}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           disabled={loading}
                                           onChange={handleChange} value={values.password_confirmation}
                                           className={classNames('w-full', {
                                               'p-invalid': !!errors.password_confirmation,
                                           })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                <label htmlFor="account_verification"
                                       className={classNames("font-medium text-900 cursor-pointer select-none")}>
                                    Hesap Onayı
                                </label>
                                <br/>
                                <InputSwitch
                                    inputId="account_verification"
                                    checked={values.account_verification}
                                    onChange={(e) => setFieldValue('account_verification', e.value ?? false)}
                                />
                            </div>
                            <div className="col-12">
                                <Button label="Kurye Ekle"
                                        disabled={!isValid}
                                        loading={loading}
                                        type={"submit"}
                                        className="w-auto mt-3"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    </PageContainer>
}
export default NewCourier;

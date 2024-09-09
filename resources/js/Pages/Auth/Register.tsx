'use client';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {useEffect, useRef} from 'react';
import type {LaravelInertiaProps, Page} from '@/types';
import {Password} from 'primereact/password';
import {useState} from 'react';
import {classNames} from 'primereact/utils';
import FullPageLayout from "@/Layouts/FullPageLayout";
import {useFormik} from "formik";
import {InputMask} from "primereact/inputmask";
import {Head, Link, router} from "@inertiajs/react";
import * as Yup from 'yup';
import {Toast} from "primereact/toast";

// @ts-ignore
const AccessDenied: Page = ({csrfToken = '', auth = {}}: LaravelInertiaProps) => {
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [validationType, setValidationType] = useState(false);
    const signUpSchema = Yup.object().shape({
        email: Yup.string().email('Geçerli bir email adresi giriniz').required('Email adresinizi giriniz'),
        name: Yup.string().required('Adınız ve soyadınızı giriniz').min(3, 'Adınız en az 3 karakter olmalıdır'),
        password: Yup.string().required('Şifrenizi giriniz').min(6, 'Şifreniz en az 6 karakter olmalıdır').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, 'Şifreniz en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
        password_confirmation: Yup.string().required('Şifrenizi tekrar giriniz').oneOf([Yup.ref('password'), ""], 'Şifreler uyuşmuyor'),
        phone: Yup.string().required('Telefon numaranızı giriniz').matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Geçerli bir telefon numarası giriniz')
    });
    const {values, dirty, submitCount, setErrors, handleChange, handleSubmit, errors, isValid} = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
        },
        validationSchema: signUpSchema,
        validateOnChange: validationType,
        validateOnBlur: validationType,
        onSubmit: (values) => {
            setLoading(true);
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('X-CSRF-TOKEN', csrfToken);
            fetch(route("register"), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(values)
            })
                .then(response => response.json())
                .then((response) => {
                    if (response.status) {
                        toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
                        router.visit(route(response?.redirect || 'login'));
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
    }, [submitCount])
    return (
        <FullPageLayout>
            <Head title="Kayıt Ol"/>
            <Toast ref={toast}/>
            <div
                className={classNames('surface-ground h-screen w-screen flex align-items-center justify-content-center')}>
                <form onSubmit={handleSubmit}
                      className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem"
                      style={{borderRadius: '14px'}}>
                    <h1 className="font-bold text-2xl mt-0 mb-2">Kayıt Formu</h1>
                    <p className="text-color-secondary mb-4">
                        Kayıt olmak için lütfen aşağıdaki bilgileri doldurunuz.
                    </p>
                    <span className="p-input-icon-left p-input-icon-right mb-3">
                        <i className={classNames("pi pi-user", {
                            'text-red-500': !!errors.name,
                            'text-green-500': errors && !errors.name && submitCount > 0

                        })}></i>
                        <InputText type="text" placeholder="Adınız Soyadınız"
                                   autoComplete={"off"}
                                   name={"name"}
                                   tooltip={errors?.name}
                                   tooltipOptions={{
                                       position: 'top',
                                       event: 'focus',
                                       className: 'text-red-500'
                                   }}
                                   disabled={loading}
                                   onChange={handleChange} value={values.name}
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.name,
                                   })}
                        />
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500': !!errors.name,
                            'pi-check-circle text-green-500': !errors.name && submitCount > 0,
                        })}></i>
                    </span>
                    <span className="p-input-icon-left p-input-icon-right mb-3">
                        <i className={classNames("pi pi-at", {
                            'text-red-500': !!errors.email,
                            'text-green-500': errors && !errors.email && submitCount > 0

                        })}></i>
                        <InputText type="email"
                                   autoComplete={"off"}
                                   name={"email"}
                                   tooltip={errors?.email}
                                   tooltipOptions={{
                                       position: 'top',
                                       event: 'focus',
                                       className: 'text-red-500'
                                   }}
                                   disabled={loading}
                                   onChange={handleChange} value={values.email}
                                   placeholder="Email Adresiniz"
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.email,
                                   })}
                        />
                       <i className={classNames("pi", {
                           'pi-times-circle text-red-500': !!errors.email,
                           'pi-check-circle text-green-500': !errors.email && submitCount > 0,
                       })}></i>
                    </span>
                    <span className="p-input-icon-left p-input-icon-right mb-3">
                       <i className={classNames("pi pi-phone", {
                           'text-red-500': !!errors.phone,
                           'text-green-500': errors && !errors.phone && submitCount > 0

                       })}></i>
                        <InputMask placeholder="Telefon Numaranız"
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
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500': !!errors.phone,
                            'pi-check-circle text-green-500': !errors.phone && submitCount > 0,
                        })}></i>
                    </span>
                    <span className="p-input-icon-left p-input-icon-right mb-3">
                        <i className={classNames("pi pi-key", {
                            'text-red-500': !!errors.password,
                            'text-green-500': errors && !errors.password && submitCount > 0

                        })}></i>
                        <InputText type="password"
                                   autoComplete={"off"}
                                   name={"password"}
                                   tooltip={errors?.password}
                                   tooltipOptions={{
                                       position: 'top',
                                       event: 'focus',
                                       className: 'text-red-500'
                                   }}
                                   disabled={loading}
                                   onChange={handleChange} value={values.password}
                                   placeholder="Şifreniz"
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.password,
                                   })}
                        />
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500': !!errors.password,
                            'pi-check-circle text-green-500': !errors.password && submitCount > 0,
                        })}></i>
                    </span>
                    <span className="p-input-icon-left p-input-icon-right mb-3">
                        <i className={classNames("pi pi-key", {
                            'text-red-500': !!errors.password_confirmation,
                            'text-green-500': errors && !errors.password_confirmation && submitCount > 0

                        })}></i>
                        <InputText type="password"
                                   autoComplete={"off"}
                                   name={"password_confirmation"}
                                   tooltip={errors?.password_confirmation}
                                   tooltipOptions={{
                                       position: 'top',
                                       event: 'focus',
                                       className: 'text-red-500'
                                   }}
                                   disabled={loading}

                                   onChange={handleChange} value={values.password_confirmation}
                                   placeholder="Şifrenizi Onaylayın"
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.password_confirmation,
                                   })}
                        />
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500': !!errors.password_confirmation,
                            'pi-check-circle text-green-500': !errors.password_confirmation && submitCount > 0,
                        })}></i>
                    </span>
                    <span className="text-color-secondary flex justify-content-between mb-4">
                        <Link href={route('password.request')}
                              className="text-color-secondary hover:text-color"
                        >Şifremi Unuttum</Link>
                        <Link href={route('login')}
                              className="text-color-secondary hover:text-color"
                        >Giriş Yap</Link>
                    </span>
                    <Button label="Kayıt Ol" className="mb-4"
                            disabled={!isValid}
                            loading={loading}
                            type={"submit"}
                    ></Button>
                </form>
            </div>
        </FullPageLayout>
    );
};

export default AccessDenied;

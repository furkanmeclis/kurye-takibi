import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {useEffect, useRef} from 'react';
import type {LaravelInertiaProps, Page} from '@/types';
import {useState} from 'react';
import {classNames} from 'primereact/utils';
import FullPageLayout from "@/Layouts/FullPageLayout";
import {useFormik} from "formik";
import {Head, router} from "@inertiajs/react";
import * as Yup from 'yup';
import {Toast} from "primereact/toast";
import {Link} from "@inertiajs/react";
// @ts-ignore
const ForgotPassword: Page = ({csrfToken = '', auth = {}}: LaravelInertiaProps) => {
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [validationType, setValidationType] = useState(false);
    const signInSchema = Yup.object().shape({
        email: Yup.string().email('Geçerli bir email adresi giriniz').required('Email adresinizi giriniz'),
    });
    const {values, submitCount, handleChange, handleSubmit, errors, isValid} = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: signInSchema,
        validateOnChange: validationType,
        validateOnBlur: validationType,
        onSubmit: (values) => {
            let headers = new Headers();
            setLoading(true);
            headers.append('Content-Type', 'application/json');
            headers.append('X-CSRF-TOKEN', csrfToken);
            fetch(route("password.email"), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(values)
            })
                .then(response => response.json())
                .then((response) => {
                    if (response.status) {
                        toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
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
    }, [submitCount])
    return (
        <FullPageLayout>
            <Head title="Şifremi Sıfırla"/>
            <Toast ref={toast}/>
            <div
                className={classNames('surface-ground h-screen w-screen flex align-items-center justify-content-center')}>
                <form onSubmit={handleSubmit}
                      className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem"
                      style={{borderRadius: '14px'}}>
                    <h1 className="font-bold text-2xl mt-0 mb-2">Şifre Sıfırlama Formu</h1>
                    <p className="text-color-secondary">
                        Şifrenizi sıfırlamak için email adresinizi giriniz.
                    </p>
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
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.email,
                                   })}
                                   onChange={handleChange} value={values.email}
                                   placeholder="Email Adresiniz"/>
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500': !!errors.email,
                            'pi-check-circle text-green-500': !errors.email && submitCount > 0,
                        })}></i>
                    </span>
                    <span className="text-color-secondary flex justify-content-between mb-4">
                        <Link href={route('login')}
                              className="text-color-secondary hover:text-color"
                        >Giriş Yap</Link>
                        <Link href={route('register')}
                              className="text-color-secondary hover:text-color"
                        >Kayıt Ol</Link>
                    </span>
                    <Button label="Şifremi Sıfırla" className="mb-4"
                            disabled={!isValid}
                            loading={loading}
                            type={"submit"}
                    ></Button>
                </form>
            </div>
        </FullPageLayout>
    );
};

export default ForgotPassword;

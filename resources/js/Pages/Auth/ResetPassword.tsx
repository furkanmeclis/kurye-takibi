import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {useRef} from 'react';
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
const ResetPassword: Page = ({csrfToken = '', auth = {}, email, token}: LaravelInertiaProps) => {
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const resetPasswordSchema = Yup.object().shape({
        email: Yup.string().email('Geçerli bir email adresi giriniz').required('Email adresinizi giriniz'),
        password: Yup.string().required('Şifrenizi giriniz').min(6, 'Şifreniz en az 6 karakter olmalıdır').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, 'Şifreniz en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
        password_confirmation: Yup.string().required('Şifrenizi tekrar giriniz').oneOf([Yup.ref('password'), ""], 'Şifreler uyuşmuyor'),
    });
    const {values, handleChange, handleSubmit, errors, isValid} = useFormik({
        initialValues: {
            email: email,
            password: '',
            password_confirmation: '',
            token: token
        },
        validationSchema: resetPasswordSchema,
        onSubmit: (values) => {
            let headers = new Headers();
            setLoading(true);
            headers.append('Content-Type', 'application/json');
            headers.append('X-CSRF-TOKEN', csrfToken);
            fetch(route("password.store"), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(values)
            })
                .then(response => response.json())
                .then((response) => {
                    if (response.status) {
                        toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
                        router.visit(route(response?.redirect || 'auth.login.index'));
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
                        Şifrenizi yenilemek için lütfen yeni şifrenizi giriniz.
                    </p>
                    <span className="p-input-icon-left mb-3 mt-4">
                        <i className="pi pi-at"></i>
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
                                   readOnly={true}
                                   onChange={handleChange} value={values.email}
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.email,
                                   })}
                                   placeholder="Email Adresiniz"
                        />
                    </span>
                    <span className="p-input-icon-left mb-3">
                        <i className="pi pi-key"></i>
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
                                   placeholder="Yeni Şifreniz"
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.password,
                                   })}
                        />
                    </span>
                    <span className="p-input-icon-left mb-3">
                        <i className="pi pi-key"></i>
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
                                   placeholder="Yeni Şifrenizi Onaylayın"
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.password_confirmation,
                                   })}/>
                    </span>
                    <span className="text-color-secondary flex justify-content-between mb-4">
                        <Link href={route('auth.login.index')}
                              className="text-color-secondary hover:text-color"
                        >Giriş Yap</Link>
                        <Link href={route('auth.register.index')}
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

export default ResetPassword

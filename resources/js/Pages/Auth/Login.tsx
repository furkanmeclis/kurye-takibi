import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import React, {useContext, useEffect, useRef} from 'react';
import type {LaravelInertiaProps, Page} from '@/types';
import {useState} from 'react';
import {classNames} from 'primereact/utils';
import FullPageLayout from "@/Layouts/FullPageLayout";
import {useFormik} from "formik";
import {Head, router} from "@inertiajs/react";
import * as Yup from 'yup';
import {Toast} from "primereact/toast";
import {Link} from "@inertiajs/react";
import {Checkbox} from "primereact/checkbox";
import {InputSwitch} from "primereact/inputswitch";
import {LayoutContext} from "@/layout/context/layoutcontext";
// @ts-ignore
const Login: Page = ({csrfToken = '', auth = {}}: LaravelInertiaProps) => {
    const {layoutConfig} = useContext(LayoutContext);
    const logo = () => {
        const path = '/layout/images/logo-';
        let logo;
        if (layoutConfig.layoutTheme === 'primaryColor' && layoutConfig.theme !== 'yellow') {
            logo = 'light.png';
        } else {
            logo = layoutConfig.colorScheme === 'light' ? 'dark.png' : 'light.png';
        }
        return path + logo;
    };
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [validationType, setValidationType] = useState(false);
    const signInSchema = Yup.object().shape({
        email: Yup.string().email('Geçerli bir email adresi giriniz').required('Email adresinizi giriniz'),
        password: Yup.string().required('Şifrenizi giriniz')
    });
    const {values, submitCount, setFieldValue, handleChange, handleSubmit, errors, isValid} = useFormik({
        initialValues: {
            email: localStorage.getItem('loginEmailForRememberMe') || '',
            password: '',
            remember: !!localStorage.getItem('loginEmailForRememberMe')
        },
        validationSchema: signInSchema,
        validateOnChange: validationType,
        validateOnBlur: validationType,
        onSubmit: (values) => {
            let headers = new Headers();
            setLoading(true);
            headers.append('Content-Type', 'application/json');
            headers.append('X-CSRF-TOKEN', csrfToken);
            fetch(route("login"), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(values)
            })
                .then(response => response.json())
                .then((response) => {
                    if (response.status) {
                        if (values.remember) {
                            localStorage.setItem('loginEmailForRememberMe', values.email);
                        } else {
                            localStorage.removeItem('loginEmailForRememberMe');
                        }
                        toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
                        router.visit(route(response?.redirect || 'login'));
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
            <Head title="Giriş Yap"/>
            <Toast ref={toast}/>
            <div
                className={classNames('surface-ground h-screen w-screen flex align-items-center justify-content-center')}>
                <form onSubmit={handleSubmit}
                      className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem"
                      style={{borderRadius: '14px'}}>
                    <div className="flex justify-content-center mb-4">
                        <img src={logo()} alt="logo" className="tw-h-20"/>
                    </div>
                    <h1 className="font-bold text-2xl mt-0 mb-2">Giriş Formu</h1>
                    <p className="text-color-secondary">
                        Giriş yapmak için lütfen email adresinizi ve şifrenizi giriniz.
                    </p>
                    <span className="p-input-icon-left p-input-icon-right mb-3 mt-4">
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
                                   className={classNames('w-full', {
                                       'p-invalid': !!errors.password,
                                   })}
                                   onChange={handleChange} value={values.password}
                                   placeholder="Şifreniz"/>
                        <i className={classNames("pi", {
                            'pi-times-circle text-red-500': !!errors.password,
                            'pi-check-circle text-green-500': !errors.password && submitCount > 0,
                        })}></i>
                    </span>
                    <div className="field-checkbox mb-3">
                        <InputSwitch
                            checked={values.remember}
                            inputId={"remember"}
                            onChange={(e) => setFieldValue('remember', e.value ?? false)}
                        />
                        <label htmlFor="remember" className="ml-2">Beni Hatırla</label>
                    </div>
                    <span className="text-color-secondary flex justify-content-between mb-4">
                        <Link href={route('password.request')}
                              className="text-color-secondary hover:text-color"
                        >Şifremi Unuttum</Link>
                        <Link href={route('register')}
                              className="text-color-secondary hover:text-color"
                        >Kayıt Ol</Link>
                    </span>
                    <Button label="Giriş Yap" className="mb-4"
                            disabled={!isValid}
                            loading={loading}
                            type={"submit"}
                    ></Button>
                </form>
            </div>
        </FullPageLayout>
    );
};

export default Login;

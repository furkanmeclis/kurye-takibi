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
import {InputSwitch} from "primereact/inputswitch";
import {getBusiness, updateBusiness} from "@/helpers/Admin/businesses";
import {BlockUI} from "primereact/blockui";
import {LayoutContext} from "@/layout/context/layoutcontext";

interface BusinessType {
    id: string,
    name: string,
    email: string,
    phone: string,
    password_change: boolean,
    password: string,
    password_confirmation: string,
    account_verification: boolean,
    activated_at: string | boolean,
}

const EditBusinessPage = ({auth, csrfToken, businessId = 0}: {
    auth?: any,
    csrfToken?: string,
    businessId?: number
}) => {
    const {setBreadcrumbs} = useContext(LayoutContext);
    useEffect(() => {
        setBreadcrumbs(prevState => {
            return [...prevState, {
                labels: ["İşletmeler", "Düzenle"],
                to: window.location.href
            }]
        });
    }, []);
    const [business, setBusiness] = useState<BusinessType>({
        id: "",
        name: '',
        email: '',
        phone: '',
        password_change: false,
        password: '',
        password_confirmation: '',
        account_verification: false,
        activated_at: '',
    });
    const toast = React.useRef<Toast>(null);
    const [loading, setLoading] = useState(true);
    const [validationType, setValidationType] = useState(false);
    const businessEditSchema = Yup.object().shape({
        id: Yup.number().required('İşletme ID bilgisi bulunamadı'),
        email: Yup.string().email('Geçerli bir email adresi giriniz').required('Email adresinizi giriniz'),
        name: Yup.string().required('Ad soyad giriniz').min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
        phone: Yup.string().required('Telefon numarası giriniz').matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Geçerli bir telefon numarası giriniz'),
        password: Yup.string().when('password_change', {
            is: true,
            then: () => Yup.string()
                .required('Şifrenizi giriniz')
                .min(6, 'Şifreniz en az 6 karakter olmalıdır')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/, 'Şifreniz en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
            otherwise: () => Yup.string().notRequired(),
        }),

        password_confirmation: Yup.string().when('password_change', {
            is: true,
            then: () => Yup.string()
                .required('Şifreyi tekrar giriniz')
                .oneOf([Yup.ref('password'), ""], 'Şifreler uyuşmuyor'),
            otherwise: () => Yup.string().notRequired(),
        }),
    });
    const [blocked, setBlocked] = useState(false);
    const formikField = useFormik({
        initialValues: business as BusinessType,
        validationSchema: businessEditSchema,
        validateOnChange: validationType,
        validateOnBlur: validationType,
        enableReinitialize: true,
        onSubmit: (values: any) => {
            setLoading(true);
            let putData = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                password: values.password,
                password_confirmation: values.password_confirmation,
                account_verification: values.account_verification ? 1 : 0,
            };
            if (values.password_change === true) { // @ts-ignore
                putData = {...putData, password_change: 1};
            }
            updateBusiness(businessId, putData, csrfToken)
                .then((response) => {
                    if (response.status) {
                        toast.current?.show({severity: 'success', summary: 'Başarılı', detail: response.message});
                        let businessData: BusinessType = {
                            id: response.business.id,
                            name: response.business.name,
                            email: response.business.email,
                            phone: response.business.phone,
                            password_change: false,
                            password: '',
                            password_confirmation: '',
                            account_verification: response.business.activated === 1,
                            activated_at: response.business.activated_at === null ? false : new Date(response.business.activated_at).toLocaleString(),
                        }
                        resetForm({
                            values: businessData,
                        });
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
    let {
        values,
        setFieldValue,
        resetForm,
        submitCount,
        setErrors,
        handleChange,
        handleSubmit,
        isValid,
        dirty
    } = formikField;
    // @ts-ignore
    let errors: BusinessType = formikField.errors;
    useEffect(() => {
        if (businessId !== undefined) {
            getBusiness(businessId, csrfToken).then((response) => {
                let {status} = response;
                let businessResponse = response.business;
                if (status) {
                    let businessData = {
                        id: businessResponse.id,
                        name: businessResponse.name,
                        email: businessResponse.email,
                        phone: businessResponse.phone,
                        password_change: false,
                        password: '',
                        password_confirmation: '',
                        account_verification: businessResponse.activated === 1,
                        activated_at: businessResponse.activated_at === null ? false : new Date(businessResponse.activated_at).toLocaleString(),
                    };
                    // @ts-ignore
                    setBusiness(businessData);
                    resetForm({
                        values: businessData as BusinessType,
                        errors: {},
                    });
                } else {
                    setBlocked(true);
                    setErrors({id: 'İşletme bilgileri alınamadı'})
                    toast.current?.show({severity: 'error', summary: 'Hata', detail: 'İşletme bilgileri alınamadı'});
                }
            }).catch((err) => {
                console.error(err)
                setBlocked(true)
                setErrors({id: 'İşletme bilgileri alınamadı'})
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'İşletme bilgileri alınamadı'
                });
            }).finally(() => {
                setLoading(false);
            })
        }
    }, [csrfToken, businessId]);
    useEffect(() => {
        if (submitCount > 0) {
            setValidationType(true);
        }
    }, [submitCount]);

    return <PageContainer auth={auth} csrfToken={csrfToken}>
        <MainLayout>
            <Head title={business?.name !== "" ? "'" + business?.name + "' Adlı İşletmeyi Düzenle" : ""}/>
            <Toast ref={toast}/>
            <div className="card">
                <span
                    className="text-900 text-xl font-bold mb-4 block">{business?.name !== "" ? "'" + business?.name + "' Adlı İşletmeyi Düzenle" : ""} </span>
                <div className="grid">
                    <div className="col-12 lg:col-2">
                        <div className="text-900 font-medium text-xl mb-3">İşletme Bilgileri</div>
                        <p className="m-0 p-0 text-600 line-height-3 mr-3">
                            Bu Ekranda İşletme Sahibinin bilgilerini düzenleyebilirsiniz.
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
                        <BlockUI blocked={blocked} template={<i className="pi pi-exclamation-circle text-red-400"
                                                                style={{fontSize: '3rem'}}></i>}
                                 containerClassName={classNames("", {
                                     'p-3': blocked,
                                     'p-0': !blocked,

                                 })}>
                            <form onSubmit={handleSubmit} className="grid formgrid p-fluid">
                                <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                    <label htmlFor="name" className={classNames("font-medium text-900", {
                                        'text-red-500': !!errors.name,
                                        'text-green-500': !errors.name && submitCount > 0,
                                    })}>
                                        <i className={classNames("pi", {
                                            'pi-times-circle text-red-500 text-sm': !!errors.name,
                                            'pi-check-circle text-green-500 text-sm': !errors.name && submitCount > 0,
                                        })}></i> Ad Soyad (İşletme Sahibi)
                                    </label>
                                    <InputText id="name"
                                               type="text"
                                               autoComplete={"off"}
                                               name={"name"}
                                               tooltip={errors.name}
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
                                <div className="field mb-4 col-12 p-input-icon-right">
                                    <label htmlFor="password_change"
                                           className={classNames("font-medium text-900 cursor-pointer select-none")}>
                                        Şifre Değişikliği
                                    </label>
                                    <br/>
                                    <InputSwitch
                                        inputId="password_change"
                                        checked={values.password_change}
                                        onChange={(e) => setFieldValue('password_change', e.value ?? false)}
                                    />
                                </div>
                                {values.password_change && <>
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
                                        <label htmlFor="password_confirmation"
                                               className={classNames("font-medium text-900", {
                                                   'text-red-500': !!errors.password_confirmation,
                                                   'text-green-500': !errors.password_confirmation && submitCount > 0,
                                               })}>
                                            <i className={classNames("pi", {
                                                'pi-times-circle text-red-500 text-sm': !!errors.password_confirmation,
                                                'pi-check-circle text-green-500 text-sm': !errors.password_confirmation && submitCount > 0,
                                            })}></i> Şifre Tekrarı
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
                                </>}
                                <div className="field mb-4 col-12 md:col-6 p-input-icon-right">
                                    <label htmlFor="account_verification"
                                           className={classNames("font-medium text-900 cursor-pointer select-none")}>
                                        Hesap Aktifliği {values.account_verification && values.activated_at !== false &&
                                        <span className="text-green-500">Aktifleştirme Tarihi : {values.activated_at}</span>}
                                    </label>
                                    <br/>
                                    <InputSwitch
                                        inputId="account_verification"
                                        checked={values.account_verification}
                                        onChange={(e) => setFieldValue('account_verification', e.value ?? false)}
                                    />
                                </div>
                                <div className="col-12">
                                    <Button label="Geri"
                                            icon={"pi pi-arrow-left"}
                                            type={"button"}
                                            severity={"secondary"}
                                            size={"small"}
                                            onClick={() => {
                                                window.history.back();
                                            }}
                                            className="w-auto mt-3 mr-2"/>
                                    <Button label="İşletmeyi Kaydet"
                                            disabled={!isValid || !dirty}
                                            loading={loading}
                                            size={"small"}
                                            type={"submit"}
                                            className="w-auto mt-3"/>
                                </div>
                            </form>
                        </BlockUI>
                    </div>
                </div>
            </div>
        </MainLayout>
    </PageContainer>
}
export default EditBusinessPage;

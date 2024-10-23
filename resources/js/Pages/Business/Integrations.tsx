import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";
import React, {useContext, useEffect, useRef} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {Head} from "@inertiajs/react";
import {Toast} from "primereact/toast";
import {Accordion, AccordionTab} from "primereact/accordion";
import trendyolSvg from "@/icons/trendyol.svg"
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {getIntegrations, saveTrendyolSettings} from "@/helpers/Business/integrations";
import {Formik} from "formik";
import * as Yup from 'yup';
import {Badge} from "primereact/badge";

const Integrations = ({auth, csrfToken, errors}: {
    auth?: any,
    csrfToken?: string,
    errors?: any
}) => {
    const toast = useRef<Toast>(null);
    const {setBreadcrumbs} = useContext(LayoutContext);
    const [loading, setLoading] = React.useState(false);
    const [trendyolSettings, setTrendyolSettings] = React.useState<any>(false);
    const [getirSettings, setGetirSettings] = React.useState(false);
    const [yemeksepetiSettings, setYemeksepetiSettings] = React.useState(false);
    const fetchIntegrations = () => {
        setLoading(true);
        getIntegrations(csrfToken).then((response) => {
            if (response.status) {
                setTrendyolSettings(response.data.trendyol);
                setGetirSettings(response.data.getir);
                setYemeksepetiSettings(response.data.yemeksepeti);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: response.message
                });
            }
        }).finally(() => setLoading(false));
    }
    useEffect(() => {
        setBreadcrumbs(prevState => {
            return [...prevState, {
                labels: ["Entegrasyonlar"],
                to: window.location.href
            }]
        });
        fetchIntegrations();
    }, []);
    return <PageContainer auth={auth} csrfToken={csrfToken} errors={errors}>
        <MainLayout>
            <Head title={"Entegrasyonlar"}/>
            <Toast ref={toast}/>
            <Accordion>
                {!loading && <AccordionTab header={<span className="flex align-items-center gap-2 w-full">
                    <img src={trendyolSvg} className={"w-4"} alt=""/>
                    <span className="font-bold white-space-nowrap">Trendyol Yemek</span>
                    <Badge value="3" className="ml-auto"/>
                    </span>}>
                    <Formik
                        initialValues={{
                            supplierId: trendyolSettings?.supplierId || '',
                            apiKey: trendyolSettings?.apiKey || '',
                            apiSecret: trendyolSettings?.apiSecret || ''
                        }}
                        validationSchema={Yup.object({
                            supplierId: Yup.string().required('Zorunlu Alan'),
                            apiKey: Yup.string().required('Zorunlu Alan'),
                            apiSecret: Yup.string().required('Zorunlu Alan')
                        })}
                        onSubmit={(values, {setSubmitting}) => {

                            saveTrendyolSettings(values, csrfToken).then((response) => {
                                if (response.status) {
                                    toast.current?.show({
                                        severity: 'success',
                                        summary: 'Başarılı',
                                        detail: response.message
                                    });
                                    setTrendyolSettings(false);
                                    fetchIntegrations();
                                } else {
                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Hata',
                                        detail: response.message
                                    });
                                }
                            }).catch((err: any) => {
                                console.log(err);
                                toast.current?.show({
                                    severity: 'error',
                                    summary: 'Hata',
                                    detail: 'Bir hata oluştu'
                                });
                            }).finally(() => setSubmitting(false));
                        }}
                    >
                        {(props) => <form onSubmit={props.handleSubmit} className="grid formgrid p-fluid">
                            <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                <label htmlFor="supplierId" className={classNames("font-medium text-900")}>
                                    Satıcı Id
                                </label>
                                <InputText id="supplierId"
                                           type="text"
                                           autoComplete={"off"}
                                           name={"supplierId"}
                                           onChange={props.handleChange}
                                           value={props.values.supplierId}
                                    // @ts-ignore
                                           tooltip={props.errors?.supplierId}
                                           tooltipOptions={{
                                               position: 'top',
                                           }}
                                           onBlur={props.handleBlur}
                                           className={classNames('w-full', {
                                               'p-invalid': !!props.errors.supplierId,
                                           })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                <label htmlFor="apiKey" className={classNames("font-medium text-900")}>
                                    API Key
                                </label>
                                <Password id="apiKey"
                                          feedback={false}
                                          toggleMask
                                          autoComplete={"off"}
                                          name={"apiKey"}
                                    // @ts-ignore
                                          tooltip={props.errors?.apiKey}
                                          tooltipOptions={{
                                              position: 'top',
                                          }}
                                          onChange={props.handleChange}
                                          value={props.values.apiKey}
                                          onBlur={props.handleBlur}
                                          className={classNames('w-full', {
                                              'p-invalid': !!props.errors.apiKey,
                                          })}
                                />
                            </div>
                            <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                                <label htmlFor="apiSecret" className={classNames("font-medium text-900")}>
                                    API Secret
                                </label>
                                <Password id="apiSecret"
                                          feedback={false}
                                          toggleMask
                                          autoComplete={"off"}
                                          name={"apiSecret"}
                                    // @ts-ignore
                                          tooltip={props.errors?.apiSecret}
                                          tooltipOptions={{
                                              position: 'top',
                                          }}
                                          onChange={props.handleChange}
                                          value={props.values.apiSecret}
                                          onBlur={props.handleBlur}
                                          className={classNames('w-full', {
                                              'p-invalid': !!props.errors.apiSecret,
                                          })}
                                />
                            </div>
                            <div className="col-12">
                                <Button label="Kaydet"
                                        size={"small"}
                                        severity={"success"}
                                        type={"submit"}
                                        disabled={!props.dirty || !props.isValid}
                                        loading={props.isSubmitting}
                                        className="w-auto mt-3"/>
                            </div>
                        </form>}
                    </Formik>

                </AccordionTab>}
            </Accordion>
        </MainLayout>
    </PageContainer>
}
export default Integrations;

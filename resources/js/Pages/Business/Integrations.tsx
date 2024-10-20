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

const Integrations = ({auth, csrfToken, errors}: {
    auth?: any,
    csrfToken?: string,
    errors?: any
}) => {
    const toast = useRef<Toast>(null);
    const {setBreadcrumbs, setAuth} = useContext(LayoutContext);
    useEffect(() => {
        setBreadcrumbs(prevState => {
            return [...prevState, {
                labels: ["Entegrasyonlar"],
                to: window.location.href
            }]
        });
    }, []);
    return <PageContainer auth={auth} csrfToken={csrfToken} errors={errors}>
        <MainLayout>
            <Head title={"Entegrasyonlar"}/>
            <Toast ref={toast}/>
            <Accordion>
                <AccordionTab header={<img src={trendyolSvg} className={"w-4"} alt=""/>}>
                    <div className="grid formgrid p-fluid">
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="supplierId" className={classNames("font-medium text-900", {
                                'text-red-500': false,
                                'text-green-500': false,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': false,
                                    'pi-check-circle text-green-500 text-sm': false,
                                })}></i> Satıcı Id
                            </label>
                            <InputText id="supplierId"
                                       type="text"
                                       autoComplete={"off"}
                                       name={"name"}
                            />
                        </div>
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="apiKey" className={classNames("font-medium text-900", {
                                'text-red-500': false,
                                'text-green-500': false,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': false,
                                    'pi-check-circle text-green-500 text-sm': false,
                                })}></i> API Key
                            </label>
                            <Password id="apiKey"
                                      feedback={false}
                                      toggleMask
                                      autoComplete={"off"}
                                      name={"name"}
                            />
                        </div>
                        <div className="field mb-4 col-12 md:col-4 p-input-icon-right">
                            <label htmlFor="apiSecret" className={classNames("font-medium text-900", {
                                'text-red-500': false,
                                'text-green-500': false,
                            })}>
                                <i className={classNames("pi", {
                                    'pi-times-circle text-red-500 text-sm': false,
                                    'pi-check-circle text-green-500 text-sm': false,
                                })}></i> API Secret
                            </label>
                            <Password id="apiSecret"
                                      feedback={false}
                                      toggleMask
                                      autoComplete={"off"}
                                      name={"name"}
                            />
                        </div>
                        <div className="col-12">
                            <Button label="Kaydet"
                                    size={"small"}
                                    severity={"success"}
                                    type={"submit"}
                                    onClick={() => {
                                        toast.current?.show({severity: 'info', summary: 'Uyarı', detail: 'Bu Özellik Daha Kullanıma Açık Değildir!'});
                                    }}
                                    className="w-auto mt-3"/>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </MainLayout>
    </PageContainer>
}
export default Integrations;

import {Sidebar} from 'primereact/sidebar';
import {Accordion, AccordionTab} from "primereact/accordion";
import {Badge} from "primereact/badge";
import {Avatar} from "primereact/avatar";
import trendyolSvg from "@/icons/trendyol.svg";
import {useEffect, useRef, useState} from "react";
import {
    getIntegrations,
    getTrendyolRestaurantInfo,
    updateTrendyolRestaurantWorkingStatus
} from "@/helpers/Business/integrations";
import {Toast} from "primereact/toast";
import {useLocalStorage} from "primereact/hooks";
import {classNames} from "primereact/utils";
import {SelectButton} from 'primereact/selectbutton';
import {Formik} from "formik";
import {Button} from "primereact/button";
import {Message} from "primereact/message";

const RestauranSettingsSidebar = ({csrfToken, visible, setVisible}: {
    csrfToken: any,
    visible: any,
    setVisible: any
}) => {
    const [activeIndex, setActiveIndex] = useLocalStorage<any>(null, 'businessRestaurantInfoActiveIndex');
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastSync, setLastSync] = useLocalStorage<any>(null, 'businessRestaurantInfoLastSyncDate');
    const [trendyolRestaurant, setTrendyolRestaurant] = useLocalStorage<any>(false, "businessRestaurantInfoTrendyolSettings");
    const [getirRestaurant, setGetirRestaurant] = useLocalStorage<any>(false, "businessRestaurantInfoGetirSettings");
    const [yemeksepetiRestaurant, setYemesepetiRestaurant] = useLocalStorage<any>(false, "businessRestaurantInfoYemeksepetiSettings");
    const syncData = () => {
        setLoading(true);
        getTrendyolRestaurantInfo(csrfToken).then((response) => {
            if (response.status) {
                setTrendyolRestaurant(response.data);
                setLastSync(new Date().toISOString());
            } else {
                setTrendyolRestaurant(false);
                toast.current?.show({severity: 'error', summary: 'Hata', detail: response.message});
            }
        }).finally(() => {
            setLoading(false);
        });
    }
    useEffect(() => {
        if (lastSync && new Date().getTime() - new Date(lastSync).getTime() > 300000) {
            syncData();
        } else if (lastSync === null) {
            syncData();
        }
        let interval = setInterval(() => {
            if (lastSync && new Date().getTime() - new Date(lastSync).getTime() > 300000) {
                syncData();
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [visible]);
    return <Sidebar
        visible={visible}
        position={"right"}
        onHide={() => setVisible(false)}
        className={"w-full md:w-20rem lg:w-30rem"}
        header={<span
            className={"text-lg font-semibold"}
        >
            Restoran Ayarları
        </span>}
        icons={<button
            className="p-sidebar-icon p-link mr-2"
            onClick={() => syncData()}
        >
            <span className={classNames("pi pi-sync", {
                "pi-spin": loading
            })}/>
        </button>}
    >
        <Toast ref={toast}/>
        {!getirRestaurant && !trendyolRestaurant && !yemeksepetiRestaurant && <Message
            severity={"warn"}
            text={"Listelenecek restoran ayarı bulunamadı."}
            className={"w-full"}
        />}
        <Accordion
            activeIndex={activeIndex}
            onTabChange={(e) => {
                setActiveIndex(e.index);
            }}
        >
            {trendyolRestaurant !== null &&
                <AccordionTab header={<span className="flex align-items-center gap-2 w-full">
                <Avatar image={trendyolSvg} size={"large"}/>
                <span className="font-bold white-space-nowrap">{trendyolRestaurant.name}</span>
            </span>}>


                    <div className={"flex flex-column gap-2"}>
                        <Formik
                            initialValues={{
                                workingStatus: trendyolRestaurant?.workingStatus === "OPEN" ? "Açık" : "Kapalı",
                            }}
                            onSubmit={(values, {setSubmitting, setValues, resetForm}) => {
                                let workingStatus: "OPEN" | "CLOSED" = values.workingStatus === "Açık" ? "OPEN" : "CLOSED";
                                setSubmitting(true)
                                updateTrendyolRestaurantWorkingStatus(workingStatus, csrfToken).then((response) => {
                                    if (response.status) {
                                        toast.current?.show({
                                            severity: 'success',
                                            summary: 'Başarılı',
                                            detail: response.message
                                        });
                                        resetForm({
                                            values: {
                                                workingStatus: workingStatus === "OPEN" ? "Açık" : "Kapalı"
                                            }
                                        });
                                        syncData();
                                    } else {
                                        toast.current?.show({
                                            severity: 'error',
                                            summary: 'Hata',
                                            detail: response.message
                                        });
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Hata',
                                        detail: "Bir hata oluştu."
                                    });
                                }).finally(() => {
                                    setSubmitting(false);
                                })
                            }}>
                            {(props) => (<form onSubmit={props.handleSubmit}>
                                <div className="font-semibold mb-2">Restoran Durumu</div>
                                <SelectButton
                                    disabled={props.isSubmitting}
                                    allowEmpty={false}
                                    options={["Açık", "Kapalı"]}
                                    onChange={(e) => {
                                        props.setFieldValue("workingStatus", e.value);
                                    }}
                                    value={props.values.workingStatus}
                                />
                                {props.dirty && <Button label={"Kaydet"} icon={"pi pi-save"}
                                                        loading={props.isSubmitting}
                                                        type={"submit"}
                                                        severity={"success"} className={"mt-2"} size={"small"}/>}
                            </form>)}
                        </Formik>
                        <div className="flex justify-between gap-2">
                            <span className="font-semibold">Son Senkronizasyon</span>
                            <span>{lastSync ? new Date(lastSync).toLocaleString() : "Bilgi Yok"}</span>
                        </div>
                    </div>
                </AccordionTab>}

        </Accordion>

    </Sidebar>
}
export default RestauranSettingsSidebar;

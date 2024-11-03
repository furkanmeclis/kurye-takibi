import {useContext, useEffect, useRef} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import PersonalInformationCourier from "@/Pages/Courier/PersonalInformation";
import PersonalInformationBusiness from "@/Pages/Business/PersonalInformation";
import MainLayout from "@/Layouts/MainLayout";
import ActiveOrder from "@/Pages/Courier/Orders/ActiveOrder";
import {listenOrderEvents, subscribeOrderEventsGlobal} from "@/helpers/globalHelper";
import {Toast} from "primereact/toast";
import bellAudio from "@/sounds/bell.mp3";
import notificationAudio from "@/sounds/notification.mp3";

const PageContainer = ({auth, csrfToken, errors = [], children, profilePage = false, courierIsTransporting = false}: {
    auth?: any,
    csrfToken?: any,
    errors?: any,
    children: React.ReactNode,
    profilePage?: boolean,
    courierIsTransporting?: boolean
}) => {
    const toast = useRef<Toast>(null);
    const {setAuth, setCsrfToken, layoutConfig, setLayoutConfig} = useContext(LayoutContext);
    useEffect(() => {
        setAuth(auth);
        setCsrfToken(csrfToken);
    }, [auth, csrfToken]);
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
    const showNotification = (data: any) => {
        if (Notification.permission === "granted") {
            let notification = new Notification(data.title, {
                body: data.message,
                icon: logo()
            });
            notification.onclick = function () {
                window.focus();
            };
        } else {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    let notification = new Notification(data.title, {
                        body: data.message,
                        icon: logo()
                    });
                    notification.onclick = function () {
                        window.focus();
                    };
                }
            });
        }
    }
    useEffect(() => {
        let bellAudioClient = new Audio(bellAudio);
        let notificationAudioClient = new Audio(notificationAudio);
        notificationAudioClient.volume = 1;
        bellAudioClient.volume = 1;
        if (auth?.user?.role === "business") {
            let client = subscribeOrderEventsGlobal(auth?.user?.id);
            let disconnect = listenOrderEvents((data: any) => {
                if (data.forRole === auth?.user?.role) {
                    if (data.showMessage) {
                        if (!data.playSound) notificationAudioClient.play().then(r => r).catch(e => e);
                        showNotification(data);
                        toast.current?.show({severity: data.severity, summary: data.title, detail: data.message});
                    }
                    if (data.playSound) {
                        bellAudioClient.play().then(r => r).catch(e => e);
                    }
                }
            });
            return () => {
                client();
                disconnect();
            }
        }
    }, [auth]);
    return (
        <>
            <Toast ref={toast} position={"bottom-left"}/>
            {auth?.user?.role === "courier" && <>

                {!profilePage && auth?.profile_approved === 0 || !profilePage && auth?.profile_approved === false ?
                    <MainLayout>

                        <PersonalInformationCourier
                            page={true}
                            profileCompleted={auth?.profile_completed}
                            profileApproved={auth?.profile_approved}
                            csrfToken={csrfToken}
                        />
                    </MainLayout> : <>
                        {courierIsTransporting ? <MainLayout>
                            <ActiveOrder auth={auth} csrfToken={csrfToken}/>
                        </MainLayout> : children}
                    </>}
            </>}
            {auth?.user?.role === "business" && <>
                {!profilePage && auth?.profile_approved === 0 || !profilePage && auth?.profile_approved === false ?
                    <MainLayout>
                        <PersonalInformationBusiness
                            page={true}
                            profileCompleted={auth?.profile_completed}
                            profileApproved={auth?.profile_approved}
                            csrfToken={csrfToken}
                        />
                    </MainLayout> : <>{children}</>}
            </>}
            {auth?.user?.role === "admin" && <>
                {children}
            </>}
        </>
    );
}
export default PageContainer;

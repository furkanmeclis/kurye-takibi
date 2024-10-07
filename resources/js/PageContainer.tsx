import {useContext, useEffect} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import PersonalInformationCourier from "@/Pages/Courier/PersonalInformation";
import PersonalInformationBusiness from "@/Pages/Business/PersonalInformation";
import MainLayout from "@/Layouts/MainLayout";
import ActiveOrder from "@/Pages/Courier/Orders/ActiveOrder";

const PageContainer = ({auth, csrfToken, errors = [], children, profilePage = false, courierIsTransporting = false}: {
    auth?: any,
    csrfToken?: any,
    errors?: any,
    children: React.ReactNode,
    profilePage?: boolean,
    courierIsTransporting?: boolean
}) => {
    const {setAuth, setCsrfToken} = useContext(LayoutContext);
    useEffect(() => {
        setAuth(auth);
        setCsrfToken(csrfToken);
    }, [auth, csrfToken]);
    return (
        <>
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

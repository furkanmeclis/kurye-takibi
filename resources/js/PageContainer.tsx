import {useContext, useEffect} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import PersonalInformationCourier from "@/Pages/Courier/PersonalInformation";
import PersonalInformationBusiness from "@/Pages/Business/PersonalInformation";
import MainLayout from "@/Layouts/MainLayout";

const PageContainer = ({auth, csrfToken, errors = [], children,profilePage=false}: {
    auth?: any,
    csrfToken?: any,
    errors?: any,
    children: React.ReactNode,
    profilePage?: boolean
}) => {
    const {setAuth, setCsrfToken} = useContext(LayoutContext);
    useEffect(() => {
        setAuth(auth);
        setCsrfToken(csrfToken);
    }, [auth, csrfToken]);
    return (
        <>
            {auth?.user?.role === "courier" && <>
                {!profilePage && auth?.profile_completed === 0  ?
                    <MainLayout>
                        <PersonalInformationCourier
                            page={true}
                            profileCompleted={auth?.profile_completed}
                            profileApproved={auth?.profile_approved}
                            csrfToken={csrfToken}
                        />
                    </MainLayout> : <>{children}</>}
            </>}
            {auth?.user?.role === "business" && <>
                {!profilePage && auth?.profile_completed === 0  ?
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

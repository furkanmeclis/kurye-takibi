import {useContext, useEffect} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import PersonalInformation from "@/Pages/Courier/PersonalInformation";
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
                {!profilePage && auth?.profile_completed === false  ?
                    <MainLayout>
                        <PersonalInformation
                            page={true}
                            profileCompleted={auth?.profile_completed}
                            profileApproved={auth?.profile_approved}
                            csrfToken={csrfToken}
                        />
                    </MainLayout> : <>{children}</>}
            </>}
            {auth?.user?.role !== "courier" && <>
                {children}
            </>}
        </>
    );
}
export default PageContainer;

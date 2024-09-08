import {useContext, useEffect} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import PersonalInformation from "@/Pages/Courier/PersonalInformation";
import MainLayout from "@/Layouts/MainLayout";

const PageContainer = ({auth, csrfToken, errors = [], children}: {
    auth?: any,
    csrfToken?: any,
    errors?: any,
    children: React.ReactNode
}) => {
    const {setAuth, setCsrfToken} = useContext(LayoutContext);
    useEffect(() => {
        setAuth(auth);
        setCsrfToken(csrfToken);
    }, [auth, csrfToken]);
    return (
        <>
            {auth?.user?.role === "courier" && <>
                {auth.profile_completed === false ?
                    <MainLayout>
                        <PersonalInformation
                            page={true}
                            profileCompleted={auth?.profile_completed}
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

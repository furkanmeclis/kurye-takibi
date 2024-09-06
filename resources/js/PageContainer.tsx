import {useContext, useEffect} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";

const PageContainer = ({auth, csrfToken, errors=[], children}: {
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
            {children}
        </>
    );
}
export default PageContainer;

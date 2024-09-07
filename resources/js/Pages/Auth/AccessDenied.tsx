import FullPageLayout from "@/Layouts/FullPageLayout";
import {Button} from "primereact/button";
import {Head, router} from "@inertiajs/react";

const AccessDenied = () => {


    return <>
        <FullPageLayout>
            <Head title="Erişim Engellendi"/>
            <div className="surface-ground h-screen w-screen flex align-items-center justify-content-center">
                <div className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem"
                     style={{borderRadius: '14px'}}>
                    <h1 className="font-bold text-2xl mt-0 mb-2 text-center">ERİŞİM ENGELLENDİ</h1>
                    <p className="text-color-secondary mb-4 text-center">
                        Bu sayfaya erişim izniniz bulunmamaktadır.
                    </p>
                    <img src="/layout/images/pages/auth/access-denied.svg" alt="access-denied"
                         className="mb-4 align-self-center"/>
                    <Button label="Kontrol Paneline Git"
                            onClick={() => {
                                router.visit(route("dashboard"))
                            }}
                    ></Button>
                </div>
            </div>
        </FullPageLayout>
    </>

}
export default AccessDenied;

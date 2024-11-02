import Show from "@/components/OrderShow";
import PageContainer from "@/PageContainer";
import MainLayout from "@/Layouts/MainLayout";

const ShowPage = ({
                      orderId = 0,
                      csrfToken = "",
                      auth = {}
                  }) => {
    return <>
        <PageContainer auth={auth} csrfToken={csrfToken}>
            <MainLayout>
                <Show orderId={orderId} csrfToken={csrfToken} auth={auth} page={true}/>

            </MainLayout>
        </PageContainer>

    </>
}
export default ShowPage;

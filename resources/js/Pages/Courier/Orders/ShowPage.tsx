import Show from "@/components/OrderShow";
import MainLayout from "@/Layouts/MainLayout";
import PageContainer from "@/PageContainer";

const ShowPage = ({
                      orderId = 0,
                      csrfToken = "",
                      auth = {},
                      courierIsTransporting = false
                  }) => {
    return <PageContainer auth={auth} csrfToken={csrfToken} courierIsTransporting={courierIsTransporting}>
        <MainLayout>
            <Show orderId={orderId} csrfToken={csrfToken} auth={auth}/>
        </MainLayout>
    </PageContainer>;
}
export default ShowPage;

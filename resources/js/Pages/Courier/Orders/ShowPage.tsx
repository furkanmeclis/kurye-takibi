import Show from "@/Pages/Courier/Orders/Show";

const ShowPage = ({
                      orderId = 0,
                      csrfToken = "",
                      auth = {},
                      courierIsTransporting = false
                  }) => {
    return <Show orderId={orderId} csrfToken={csrfToken} auth={auth} page={true} courierIsTransporting={courierIsTransporting}/>;
}
export default ShowPage;

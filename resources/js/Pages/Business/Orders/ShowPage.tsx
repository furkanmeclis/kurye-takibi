import Show from "@/Pages/Business/Orders/Show";

const ShowPage = ({
                      orderId = 0,
                      csrfToken = "",
                      auth = {}
                  }) => {
    return <Show orderId={orderId} csrfToken={csrfToken} auth={auth} page={true}/>;
}
export default ShowPage;

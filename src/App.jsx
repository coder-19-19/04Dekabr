import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/register/index.jsx";
import Home from "./pages/home/index.jsx";
import MainLayout from "./components/mainLayout/index.jsx";
import Login from "./pages/login/index.jsx";
import {ToastContainer} from "react-toastify";
import RegisterApprove from "./pages/register-approve/index.jsx";
import User from "./pages/user/index.jsx";
import Profile from "./pages/profile/index.jsx";
import TweetDetail from "./pages/tweet-detail/index.jsx";

export const routes = [
    {
        id: 1,
        path: '/',
        title: 'Home',
        element: <Home/>,
        show: true
    },
    {
        id: 2,
        path: '/user/:id',
        title: 'User',
        element: <User/>,
        show: false
    },
    {
        id: 3,
        path: '/profile',
        title: 'Profile',
        element: <Profile/>,
        show: false
    },
    {
        id: 4,
        path: '/tweet/:id',
        title: 'Profile',
        element: <TweetDetail/>,
        show: false
    },
]
const App = () => {


    return <>
        <ToastContainer/>
        <BrowserRouter>
            <Routes>
                {routes.map(item => (
                    <Route path={item.path} key={item.id} element={<MainLayout title={item.title}>
                        {item.element}
                    </MainLayout>}/>
                ))}
                <Route path="/register" element={<Register/>}/>
                <Route path="/register/approve/:id" element={<RegisterApprove/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    </>

}
export default App

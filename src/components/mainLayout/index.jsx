import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Container} from "reactstrap";
import Navabar from "../navabar/index.jsx";

const MainLayout = ({children, title}) => {
    const token = localStorage.getItem('token')
    const location = useLocation()
    const navigate = useNavigate()


    useEffect(() => {
        document.title = title
        if (!token) {
            navigate('/login')
        }
    }, [location])
    return (
        <>
            <Navabar/>
            <Container>
                {children}
            </Container>
        </>

    )
}

export default MainLayout

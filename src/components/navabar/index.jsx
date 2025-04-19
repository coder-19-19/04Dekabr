import {routes} from "../../App.jsx";
import {DropdownItem, DropdownMenu, DropdownToggle, NavLink, Spinner, UncontrolledDropdown} from "reactstrap";
import {useEffect, useState} from "react";
import instance from '../../api/index.js'
import {useNavigate} from "react-router-dom";

const Navabar = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState({})
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    const getOwn = async () => {
        setIsLoading(true)
        try {
            const data = await instance.get('/profile/own', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setUser(data?.data?.data?.user)
        } catch (e) {
            if (e.response.status === 401) {
                navigate('/login')
            }
        } finally {
            setIsLoading(false)
        }

    }

    const getUserShortName = () => {
        const name = user?.name
        const arr = name?.split(' ')
        return `${arr?.[0]?.[0]}${arr?.[1]?.[0]}`

    }

    const searchByUserName = async (e) => {
        e.preventDefault()
        const data = await instance.get('/profile/search', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                keyword: search
            }
        })
        setUsers(data?.data?.data?.users)
    }

    useEffect(() => {
        getOwn()
    }, [])

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Twitter</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        {routes.filter(item => item.show).map(item => (
                            <li className="nav-item" key={item.id}>
                                <NavLink className="nav-link" aria-current="page" href="#">{item.title}</NavLink>
                            </li>
                        ))}
                    </ul>
                    <form className="d-flex" onSubmit={searchByUserName}>
                        <input onChange={(e) => setSearch(e.target.value)} className="form-control me-2" type="search"
                               placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-outline-success" type="submit">Search
                        </button>
                        {!!users?.length && (
                            <UncontrolledDropdown>
                                <DropdownToggle caret>
                                    Users
                                </DropdownToggle>
                                <DropdownMenu right>
                                    {users?.map(item => (
                                        <DropdownItem
                                            onClick={() => user?.id === item.id ? navigate('/profile') : navigate(`/user/${item.id}`)}
                                            key={item.id}>{item.name}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        )}
                    </form>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        border: '1px solid',
                        marginLeft: 10,
                        textAlign: 'center',
                        lineHeight: '39px'
                    }}>
                        {isLoading ? <Spinner/> : getUserShortName()}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navabar

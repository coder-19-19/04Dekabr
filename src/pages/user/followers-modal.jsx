import {Link, useParams} from "react-router-dom";
import instance from "../../api/index.js";
import {useEffect, useState} from "react";
import {ListGroup, ListGroupItem, Spinner} from "reactstrap";
import {getFileFullUrl} from "../../utils/file/index.js";
import {getUserShortName} from "../../utils/text/index.js";

const FollowersModal = ({type, currentUserId}) => {
    const params = useParams()
    const id = currentUserId || params.id
    const [isFetching, setIsFetching] = useState(false)
    const [users, setUsers] = useState([])
    const authorizedUser = JSON.parse(localStorage.getItem('user'))
    const userId = authorizedUser?.id
    const getUserFollowers = async () => {
        setIsFetching(true)
        const data = await instance.get(`/follow/followers/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setUsers(data?.data?.data?.users)
        setIsFetching(false)
    }

    const getUserFollowings = async () => {
        setIsFetching(true)
        const data = await instance.get(`/follow/following/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setUsers(data?.data?.data?.users)
        setIsFetching(false)
    }


    useEffect(() => {
        if (type === 1) {
            getUserFollowers()
        } else {
            getUserFollowings()
        }
    }, [])

    return isFetching ? <div className="d-flex justify-content-center">
        <Spinner/>
    </div> : users.length ? <ListGroup>
        {users?.map(user => (
            <ListGroupItem key={user.id}>
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-1">
                        {user?.profile_photo_path ? <img width="50px" height="50px" style={{borderRadius: '50%'}}
                                                         src={getFileFullUrl(user?.profile_photo_path)}
                                                         alt={user.name}/> : <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            border: '1px solid',
                            textAlign: 'center',
                            lineHeight: '49px'
                        }}>
                            {getUserShortName(user)}
                        </div>}
                        <Link to={userId === user.id ? '/profile' : `/user/${user.id}`}>
                            {user.name}
                        </Link>
                    </div>
                </div>
            </ListGroupItem>
        ))}
    </ListGroup> : <div className="d-flex justify-content-center">
        No Followers
    </div>

}

export default FollowersModal

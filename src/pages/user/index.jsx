import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import instance from '../../api/index.js'
import {Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap";

const User = () => {
    const {id} = useParams()
    const [user, setUser] = useState({})

    const getUserByUserId = async () => {
        const data = await instance.get(`/profile/other/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setUser(data?.data?.data?.user)
    }

    const followUser = async () => {
        await instance.post(`/follow/${id}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        getUserByUserId()
    }


    useEffect(() => {
        getUserByUserId()
    }, [id])

    return (
        <Row className="justify-content-center mt-5">
            <Col>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {user?.name} - {user?.email}
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col sm={12} md={4}>
                                <img width="200px" height="200px"
                                     src={`${import.meta.env.VITE_APP_BASE_URL}${user?.profile_photo_path}`}/>
                            </Col>
                            <Col sm={12} md={4}>
                                <div>
                                    <b>Username</b>:
                                    <span>{user?.username}</span>
                                </div>
                                <div>
                                    <b>Bio</b>:
                                    <span>{user?.bio}</span>
                                </div>
                                <div>
                                    <b>Link</b>:
                                    <a href={user?.link} target="_blank">{user?.link}</a>
                                </div>
                            </Col>
                            <Col sm={12} md={4}>
                                <div>
                                    <b>Followers</b>:
                                    <span>{user?.followers_count}</span>
                                </div>
                                <div>
                                    <b>Following</b>:
                                    <span>{user?.following_count}</span>
                                </div>
                                {user?.is_following ? <Badge color="primary">Following</Badge> :
                                    <Button size="sm" color="primary" onClick={followUser}>Follow</Button>}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default User

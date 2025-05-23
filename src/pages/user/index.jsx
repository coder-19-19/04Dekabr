import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import instance from '../../api/index.js'
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner
} from "reactstrap";
import UsersListModal from "./users-list-modal.jsx";
import {getFileFullUrl} from "../../utils/file/index.js";
import {getUserShortName} from "../../utils/text/index.js";

const User = () => {
    const {id} = useParams()
    const [user, setUser] = useState({})
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [isFollowLoading, setIsFollowLoading] = useState(false)
    const getUserByUserId = async () => {
        const data = await instance.get(`/profile/other/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setUser(data?.data?.data?.user)
    }

    const followUser = async () => {
        setIsFollowLoading(true)
        await instance.post(`/follow/${id}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setIsFollowLoading(false)
        getUserByUserId()
    }

    const toggleModal = () => {
        setIsUserModalOpen(!isUserModalOpen)
    }


    useEffect(() => {
        getUserByUserId()
        setIsUserModalOpen(false)
    }, [id])

    return (
        <Row className="justify-content-center mt-5">
            <Modal isOpen={isUserModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Followers</ModalHeader>
                <ModalBody>
                    <UsersListModal type={modalData}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => {
                        toggleModal()
                    }} outline>Close</Button>
                </ModalFooter>
            </Modal>
            <Col>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {user?.name} - {user?.email}
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col sm={12} md={3}>
                                {user?.profile_photo_path ? (
                                    <img width="200px" height="200px"
                                         src={getFileFullUrl(user?.profile_photo_path)}/>
                                ) : (
                                    <div style={{
                                        width: 200,
                                        height: 200,
                                        cursor: 'pointer',
                                        fontSize: 60,
                                        textAlign: 'center',
                                        lineHeight: '199px',
                                        border: '1px solid'
                                    }}>
                                        {getUserShortName(user)}
                                    </div>
                                )}

                            </Col>
                            {user?.profile_banner_path && (
                                <Col sm={12} md={3}>
                                    <img width="200px" height="200px"
                                         src={getFileFullUrl(user?.profile_banner_path)}/>
                                </Col>
                            )}
                            <Col sm={12} md={3}>
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
                            <Col sm={12} md={3}>
                                <div className="d-flex flex-column gap-2">
                                    <div>
                                        <b>Followers</b>
                                        <Badge style={{
                                            cursor: 'pointer'
                                        }} color="warning" onClick={() => {
                                            toggleModal()
                                            setModalData(1)
                                        }}>{user?.followers_count}</Badge>
                                    </div>
                                    <div>
                                        <b>Following</b>
                                        <Badge color="warning" style={{
                                            cursor: 'pointer'
                                        }} onClick={() => {
                                            toggleModal()
                                            setModalData(2)
                                        }}>{user?.following_count}</Badge>
                                    </div>
                                    {user?.is_following ? <>
                                            <Button disabled={isFollowLoading} size="sm" color="danger"
                                                    onClick={followUser}>
                                                {isFollowLoading ? <Spinner size="sm"/> : 'Unfollow'}
                                            </Button>
                                        </> :
                                        <Button disabled={isFollowLoading} size="sm" color="primary"
                                                onClick={followUser}>
                                            {isFollowLoading ? <Spinner size="sm"/> : 'Follow'}
                                        </Button>}
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default User

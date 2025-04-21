import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Progress,
    Row,
    Spinner
} from "reactstrap";
import FollowersModal from "../user/followers-modal.jsx";
import {getProfileFileUrl} from "../../utils/file/index.js";
import {useEffect, useState} from "react";
import instance from "../../api/index.js";
import {useNavigate} from "react-router-dom";
import {getUserShortName} from "../../utils/text/index.js";

const Profile = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(false)

    const [binaryPhoto, setBinaryPhoto] = useState(null)
    const [profilePhotoPercent, setProfilePhotoPercent] = useState(0)
    const [isProfileProgressStart, setIsProfileProgressStart] = useState(false)

    const [binaryBannerPhoto, setBinaryBannerPhoto] = useState(null)
    const [bannerPhotoPercent, setBannerPhotoPercent] = useState(0)
    const [isBannerProgressStart, setIsBannerProgressStart] = useState(false)
    const navigate = useNavigate()

    const toggleModal = () => {
        setIsUserModalOpen(!isUserModalOpen)
    }

    const getOwn = async () => {
        setIsLoading(true)
        try {
            const data = await instance.get('/profile/own', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setUser(data?.data?.data?.user)
            localStorage.setItem('user', JSON.stringify(data?.data?.data?.user))
        } catch (e) {
            if (e.response.status === 401) {
                navigate('/login')
            }
        } finally {
            setIsLoading(false)
        }

    }

    const updateProfile = async (e) => {
        e.preventDefault()
        await instance.post(`/profile/update`, user, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        getOwn()
    }
    const setProfilePhoto = async e => {
        const file = e.target.files[0]
        setBinaryPhoto(URL.createObjectURL(file))
        const formData = new FormData()
        formData.append('file', file)
        setIsProfileProgressStart(true)
        const data = await instance.post('file/upload', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            onUploadProgress: e => {
                setProfilePhotoPercent(e.loaded / e.total * 100)
            }
        })
        setIsProfileProgressStart(false)
        const resFile = data?.data?.data?.file
        setUser({
            ...user,
            profile_photo: {
                file_uuid: resFile?.id,
                file_path: resFile?.storage_path,
            }
        })
    }

    const setBannerPhoto = async e => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        setIsBannerProgressStart(true)
        const data = await instance.post('file/upload', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            onUploadProgress: e => {
                setBannerPhotoPercent(e.loaded / e.total * 100)
            }
        })
        setIsBannerProgressStart(false)
        const resFile = data?.data?.data?.file
        setUser({
            ...user,
            profile_banner: {
                file_uuid: resFile?.id,
                file_path: resFile?.storage_path,
            }
        })
        setBinaryBannerPhoto(URL.createObjectURL(file))
    }

    useEffect(() => {
        getOwn()
    }, [])
    return isLoading ? <Spinner/> : <Row className="justify-content-center mt-5">
        <Modal isOpen={isUserModalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Followers</ModalHeader>
            <ModalBody>
                <FollowersModal currentUserId={user?.id} type={modalData}/>
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
                            <input onChange={setProfilePhoto} accept=".png,.jpeg,.jpg,.jfif,.webp"
                                   id="profile-photo" type="file" style={{
                                display: 'none'
                            }}/>
                            {(binaryPhoto || user?.profile_photo_path) ? <label htmlFor="profile-photo">
                                <img width="200px" height="200px"
                                     src={binaryPhoto || getProfileFileUrl(user?.profile_photo_path)}/>
                            </label> : (
                                <label htmlFor="profile-photo" style={{
                                    width: 200,
                                    height: 200,
                                    cursor: 'pointer',
                                    fontSize: 60,
                                    textAlign: 'center',
                                    lineHeight: '199px',
                                    border: '1px solid'
                                }}>

                                    {getUserShortName(user)}
                                </label>
                            )}
                            {isProfileProgressStart && (
                                <Progress value={profilePhotoPercent}/>
                            )}
                        </Col>
                        <Col sm={12} md={3}>
                            <input onChange={setBannerPhoto} accept=".png,.jpeg,.jpg,.jfif,.webp"
                                   id="banner-photo" type="file" style={{
                                display: 'none'
                            }}/>
                            {(binaryBannerPhoto || user?.profile_banner_path) ? (
                                <label htmlFor="banner-photo">
                                    <img width="200px" height="200px"
                                         src={binaryBannerPhoto || getProfileFileUrl(user?.profile_banner_path)}/>
                                </label>
                            ) : (
                                <>
                                    <label style={{
                                        cursor: 'pointer'
                                    }} htmlFor="banner-photo">Upload Banner Photo</label>
                                </>
                            )}
                            {isBannerProgressStart && (
                                <Progress value={bannerPhotoPercent}/>
                            )}
                        </Col>
                        <Col sm={12} md={3}>
                            <form action="" onSubmit={updateProfile}>
                                <div>
                                    <b>Username</b>:
                                    <Input value={user?.username} onChange={e => {
                                        setUser({
                                            ...user,
                                            username: e.target.value
                                        })
                                    }
                                    }/>
                                </div>
                                <div>
                                    <b>Name</b>:
                                    <Input value={user?.name} onChange={e => {
                                        setUser({
                                            ...user,
                                            name: e.target.value
                                        })
                                    }
                                    }/>
                                </div>
                                <div>
                                    <b>Bio</b>:
                                    <Input value={user?.bio} onChange={e => {
                                        setUser({
                                            ...user,
                                            bio: e.target.value
                                        })
                                    }
                                    }/>
                                </div>
                                <div>
                                    <b>Link</b>:
                                    <Input value={user?.link} onChange={e => {
                                        setUser({
                                            ...user,
                                            link: e.target.value
                                        })
                                    }
                                    }/>
                                </div>
                                <Button className="mt-2" color="success" type="submit">Save</Button>
                            </form>
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
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    </Row>

}

export default Profile

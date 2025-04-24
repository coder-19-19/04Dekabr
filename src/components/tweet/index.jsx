import {Button, Card, CardBody, CardHeader, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {FaBookmark, FaEdit, FaRegComment} from "react-icons/fa";
import {AiFillLike} from "react-icons/ai";
import {useState} from "react";
import instance from "../../api/index.js";
import UsersListModal from "../../pages/user/users-list-modal.jsx";
import {getFileFullUrl} from "../../utils/file/index.js";
import {cutText, getReadTime, getUserShortName} from "../../utils/text/index.js";
import {Link, useNavigate} from "react-router-dom";

const Tweet = ({tweet}) => {
    const [localTweet, setLocalTweet] = useState(tweet)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const authorizedUser = JSON.parse(localStorage.getItem('user'))
    const userId = authorizedUser?.id
    const navigate = useNavigate()

    const likeTweet = async () => {
        await instance.post(`/tweet/like/${localTweet?.id}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setLocalTweet({
            ...localTweet,
            like_count: localTweet.is_liked ? localTweet.like_count - 1 : localTweet.like_count + 1,
            is_liked: !localTweet.is_liked
        })
    }

    const saveTweet = async () => {
        await instance.post(`/tweet/save/${localTweet?.id}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setLocalTweet({
            ...localTweet,
            is_saved_bookmarked: !localTweet?.is_saved_bookmarked
        })
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }


    return (
        <>
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>
                    Liked List
                </ModalHeader>
                <ModalBody>
                    <UsersListModal type={3} tweetId={localTweet?.id}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => {
                        toggleModal()
                    }} outline>Close</Button>
                </ModalFooter>
            </Modal>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex gap-1 align-items-center">
                                {localTweet?.creator?.profile_photo_path ?
                                    <img width="50px" height="50px" style={{borderRadius: '50%'}}
                                         src={getFileFullUrl(localTweet?.creator?.profile_photo_path)}
                                         alt={localTweet?.creator.name}/> : <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        border: '1px solid',
                                        textAlign: 'center',
                                        lineHeight: '49px'
                                    }}>
                                        {getUserShortName(localTweet?.creator)}
                                    </div>}
                                <Link
                                    to={userId === localTweet?.creator?.id ? '/profile' : `/user/${localTweet?.creator?.id}`}>
                                    {localTweet?.creator?.name}
                                </Link>
                            </div>
                            <div className="d-flex gap-1">
                                <span>
                                    {localTweet?.created_at}
                                </span>
                                <span>
                                    {getReadTime(localTweet?.description)} min.
                                </span>
                                {localTweet?.can_edit && (
                                    <span>
                                <FaEdit cursor="pointer" color="blue"/>
                            </span>
                                )}
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    {cutText(localTweet.description)}
                    <hr/>
                    <div className="d-flex gap-1">
                    <span className="d-flex gap-1 align-items-center"
                          onClick={() => navigate(`/tweet/${localTweet?.id}`)}>
                    <FaRegComment cursor="pointer" size={20}/>
                        {localTweet?.comment_count}
                </span>
                        <span className="d-flex gap-1 align-items-center">
                    <AiFillLike onClick={likeTweet} cursor="pointer" size={20}
                                color={localTweet.is_liked ? '#0a58ca' : null}/>
                       <span style={{cursor: 'pointer'}} onClick={toggleModal}> {localTweet?.like_count}</span>
                </span>
                        <span className="d-flex gap-1 align-items-center" onClick={saveTweet}>
                    <FaBookmark cursor="pointer" size={18} color={localTweet.is_saved_bookmarked ? '#0a58ca' : null}/>
                </span>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default Tweet

import {Link, useParams} from "react-router-dom";
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Spinner} from "reactstrap";
import {getFileFullUrl} from "../../utils/file/index.js";
import {getReadTime, getUserShortName} from "../../utils/text/index.js";
import {FaEdit} from "react-icons/fa";
import {useEffect, useState} from "react";
import instance from "../../api/index.js";
import Fancybox from '../../components/fancybox'
import Comment from "./comment.jsx";
import {toast} from "react-toastify";

const TweetDetail = () => {
    const [localTweet, setLocalTweet] = useState({})
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const authorizedUser = JSON.parse(localStorage.getItem('user'))
    const userId = authorizedUser?.id
    const {id} = useParams()

    const getTweetById = async () => {
        setIsLoading(true)
        const data = await instance.get(`tweet/show/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
        setLocalTweet(data?.data?.data?.tweet)
        setIsLoading(false)
    }

    const getTweetCommentById = async () => {
        setIsLoading(true)
        const data = await instance.get(`tweet/comments/all/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
        setComments(data?.data?.data?.comments)
        setIsLoading(false)
    }

    const sendComment = async () => {
        setIsSending(true)
        const data = await instance.post(`/tweet/comments/save/${id}`, {
            comment,
            parent_id: null
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setIsSending(false)
        setComment('')
        getTweetCommentById()
        toast.success(data?.data?.message)
    }


    useEffect(() => {
        getTweetById()
        getTweetCommentById()
    }, [id])

    return <Row>
        {isLoading ? <Spinner/> : <Col sm={12} className="mt-5">
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
                    {localTweet?.description}
                    <Fancybox
                        options={{
                            Carousel: {
                                infinite: false,
                            },
                        }}
                    >
                        {localTweet?.tweet_files?.map(item => (
                            <a key={item.id} href={getFileFullUrl(item.file_path)} data-fancybox="gallery">
                                <img width={100} height={100} src={getFileFullUrl(item.file_path)} alt=""/>
                            </a>
                        ))}
                    </Fancybox>
                    <hr/>
                    <h4>Comments</h4>
                    <div className="mb-3">
                        <Input type="textarea" onChange={e => setComment(e.target.value)} value={comment}/>
                        <div className="d-flex justify-content-end mt-2">
                            <Button disabled={isSending} color="primary" onClick={sendComment}>
                                {isSending ? <Spinner size="sm"/> : 'Send'}
                            </Button>
                        </div>
                    </div>
                    {comments?.map(item => (
                        <Comment comment={item} key={item.id} getCommnetListCallback={getTweetCommentById}/>
                    ))}
                </CardBody>
            </Card>
        </Col>}
    </Row>
}
export default TweetDetail

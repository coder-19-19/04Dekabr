import {getFileFullUrl} from "../../utils/file/index.js";
import {getUserShortName} from "../../utils/text/index.js";
import {Link, useParams} from "react-router-dom";
import {FaReply} from "react-icons/fa";
import {useState} from "react";
import {Button, Input, Spinner} from "reactstrap";
import instance from "../../api/index.js";
import {toast} from "react-toastify";

const Comment = ({comment, getCommnetListCallback}) => {
    const {id} = useParams()
    const authorizedUser = JSON.parse(localStorage.getItem('user'))
    const userId = authorizedUser?.id
    const [isCommentOpen, setIsCommentOpen] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [isSending, setIsSending] = useState(false)

    const sendComment = async () => {
        setIsSending(true)
        const data = await instance.post(`/tweet/comments/save/${id}`, {
            comment: commentText,
            parent_id: comment?.id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setIsSending(false)
        setCommentText('')
        setIsCommentOpen(false)
        getCommnetListCallback()
        toast.success(data?.data?.message)
    }

    return (
        <div style={{
            border: '1px solid',
            borderRadius: 6,
            marginBottom: 10,
            padding: 10
        }}>
            <div className="d-flex gap-1 align-items-center justify-content-between">
                <div>
                    {comment?.profile_photo_path ?
                        <img width="50px" height="50px" style={{borderRadius: '50%'}}
                             src={getFileFullUrl(comment?.profile_photo_path)}
                             alt={comment?.name}/> : <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            border: '1px solid',
                            textAlign: 'center',
                            lineHeight: '49px'
                        }}>
                            {getUserShortName(comment?.name)}
                        </div>}
                    <Link
                        to={userId === comment?.user_id ? '/profile' : `/user/${comment?.user_id}`}>
                        {comment?.name}
                    </Link>
                    ({comment?.children?.length}) Comments
                </div>
                <div className="d-flex gap-1">
                    <span>{comment?.created_at}</span>
                    <span onClick={() => setIsCommentOpen(!isCommentOpen)} style={{
                        cursor: 'pointer'
                    }}>
                    <FaReply color="blue"/>
                    Reply
                </span>
                </div>
            </div>
            <div>
                {comment?.comment}
            </div>
            {isCommentOpen && (
                <div>
                    <Input type="textarea" onChange={e => setCommentText(e.target.value)} value={commentText}/>
                    <div className="d-flex justify-content-end mt-2">
                        <Button disabled={isSending} color="primary" onClick={sendComment}>
                            {isSending ? <Spinner size="sm"/> : 'Send'}
                        </Button>
                    </div>
                </div>
            )}
            {comment?.children?.map(childrenComment => (
                <div style={{
                    marginLeft: 20
                }}>
                    <Comment comment={childrenComment} getCommnetListCallback={getCommnetListCallback}/>
                </div>
            ))}
        </div>
    )
}

export default Comment

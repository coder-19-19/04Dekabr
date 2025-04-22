import {Card, CardBody, CardHeader, CardTitle} from "reactstrap";
import {FaBookmark, FaEdit, FaRegComment} from "react-icons/fa";
import {AiFillLike} from "react-icons/ai";

const Tweet = ({tweet}) => {
    console.log(tweet)
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="d-flex justify-content-between">
                        {tweet?.creator?.name}
                        {tweet?.can_edit && (
                            <span>
                                <FaEdit cursor="pointer" color="blue"/>
                            </span>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardBody>
                {tweet.description}
                <hr/>
                <div className="d-flex gap-1">
                    <span className="d-flex gap-1 align-items-center">
                    <FaRegComment cursor="pointer" size={20}/>
                        {tweet?.comment_count}
                </span>
                    <span className="d-flex gap-1 align-items-center">
                    <AiFillLike cursor="pointer" size={20} color={tweet.is_liked ? '#0a58ca' : null}/>
                        {tweet?.like_count}
                </span>
                    <span className="d-flex gap-1 align-items-center">
                    <FaBookmark cursor="pointer" size={18} color={tweet.is_saved_bookmarked ? '#0a58ca' : null}/>
                </span>
                </div>
            </CardBody>
        </Card>
    )
}

export default Tweet

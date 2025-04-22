import {useEffect, useState} from "react";
import instance from "../../api/index.js";
import Tweet from "../../components/tweet/index.jsx";
import {Col, Row} from "reactstrap";

const MyTweets = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const id = currentUser?.id
    const [isLoading, setIsLoading] = useState(false)
    const [tweets, setTweets] = useState([])
    const getTweets = async () => {
        setIsLoading(true)
        const data = await instance.get(`tweet/all/own/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setTweets(data?.data?.data?.tweets)
        setIsLoading(false)
    }

    useEffect(() => {
        getTweets()
    }, [])

    return (
        <Row>
            {tweets.map(item => (
                <Col key={item.id} sm={12} md={4}>
                    <Tweet tweet={item}/>
                </Col>
            ))}
        </Row>
    )
}

export default MyTweets

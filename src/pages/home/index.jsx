import PostTweet from "../../components/post-tweet/index.jsx";
import {Col, Row, Spinner} from "reactstrap";
import instance from "../../api/index.js";
import {useEffect, useState} from "react";
import Tweet from "../../components/tweet/index.jsx";

const Home = () => {
    const [forYouAllData, setForYouAllData] = useState([])
    const [followingAll, setFollowingAll] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getForYouAll = async () => {
        setIsLoading(true)
        const data = await instance.get(`tweet/all/for-you`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                limit: 300
            }
        })
        setForYouAllData(data?.data?.data?.tweets)
        setIsLoading(false)
    }

    const getFollowingAll = async () => {
        setIsLoading(true)
        const data = await instance.get(`tweet/all/following`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                limit: 300
            }
        })
        setFollowingAll(data?.data?.data?.tweets)
        setIsLoading(false)
    }

    useEffect(() => {
        getForYouAll()
        getFollowingAll()
    }, [])

    return (
        <>
            <Row className="mt-2">
                <Col sm={12} md={6}>
                    <PostTweet/>
                </Col>
            </Row>
            <Row className="row-gap-3">
                <h1>For You</h1>
                {isLoading ? <Spinner/> : (
                    forYouAllData.map(item => (
                        <Col sm={12} md={4} key={item.id}>
                            <Tweet tweet={item}/>
                        </Col>
                    ))
                )}
            </Row>
            <Row className="row-gap-3">
                <h1>Following All</h1>
                {isLoading ? <Spinner/> : (
                    followingAll.map(item => (
                        <Col sm={12} md={4} key={item.id}>
                            <Tweet tweet={item}/>
                        </Col>
                    ))
                )}
            </Row>
        </>
    )
}

export default Home

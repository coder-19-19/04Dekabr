import PostTweet from "../../components/post-tweet/index.jsx";
import {Col, Row} from "reactstrap";

const Home = () => {
    return (
        <Row className="mt-2">
            <Col sm={12} md={6}>
                <PostTweet/>
            </Col>
        </Row>
    )
}

export default Home

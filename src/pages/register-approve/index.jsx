import {Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Input, Label, Row} from "reactstrap";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import instance from '../../api/index.js'

const RegisterApprove = () => {
    const {id} = useParams()
    const [values, setValues] = useState({})
    const navigate = useNavigate()

    const changeFieldValue = (value, name) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    const approve = async (e) => {
        e.preventDefault()
        const data = await instance.post(`/register/approve/${id}`, values)
        navigate('/login')
    }

    return <Container>
        <Row className="justify-content-center mt-5">
            <Col sm={12} md={4}>
                <Card>
                    <CardHeader>
                        <CardTitle>Approve User</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <form action="" onSubmit={approve}>
                            <div>
                                <Label htmlFor="code">Code</Label>
                                <Input value={values.code}
                                       onChange={e => changeFieldValue(e.target.value, 'code')} name="code"
                                       id="code"/>
                            </div>
                            <div className="mt-2 d-flex justify-content-center">
                                <Button type="submit" color="primary">Approve</Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
}

export default RegisterApprove

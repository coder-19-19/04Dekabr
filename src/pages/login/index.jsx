import {Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Input, Label, Row} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import instance from '../../api/index.js'
import {toast} from "react-toastify";

const Login = () => {
    const [values, setValues] = useState({})
    const navigate = useNavigate()

    const changeFieldValue = (value, name) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    const login = async (e) => {
        e.preventDefault()
        try {
            const data = await instance.post('/login', values)
            const token = data?.data?.data?.token
            localStorage.setItem('token', token)
            navigate('/')
        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col sm={12} md={4}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <form action="" onSubmit={login}>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input value={values.email}
                                           onChange={e => changeFieldValue(e.target.value, 'email')}
                                           type="email"
                                           name="email" id="email"/>
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input value={values.password} type="password"
                                           onChange={e => changeFieldValue(e.target.value, 'password')}
                                           name="password"
                                           id="password"/>
                                </div>
                                <div className="mt-2 d-flex justify-content-center">
                                    <Button type="submit" color="primary">Login</Button>
                                </div>
                            </form>
                            <hr/>
                            <div className="d-flex justify-content-center">
                                <Link to="/register">Register</Link>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Login

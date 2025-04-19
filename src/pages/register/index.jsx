import {Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Input, Label, Row} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import instance from '../../api/index.js'
import {toast} from "react-toastify";

const Register = () => {
    const [values, setValues] = useState({})
    const navigate = useNavigate()
    const register = async (e) => {
        e.preventDefault()
        try {
            const data = await instance.post('/register', values)
            const userId = data?.data?.data?.userId
            if (userId) {
                return navigate(`/register/approve/${userId}`)
            }
        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    const changeFieldValue = (value, name) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    return <Container>
        <Row className="justify-content-center mt-5">
            <Col sm={12} md={4}>
                <Card>
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <form action="" onSubmit={register}>
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input value={values.username}
                                       onChange={e => changeFieldValue(e.target.value, 'username')} name="username"
                                       id="username"/>
                            </div>
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input value={values.name} onChange={e => changeFieldValue(e.target.value, 'name')}
                                       name="name" id="name"/>
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input value={values.email} onChange={e => changeFieldValue(e.target.value, 'email')}
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
                                <Button type="submit" color="primary">Register</Button>
                            </div>
                        </form>
                        <hr/>
                        <div className="d-flex justify-content-center">
                            <Link to="/login">Login</Link>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
}

export default Register

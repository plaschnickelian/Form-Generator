import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../features/user/userActions'
import { useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './../css/pages/loginpage.css'

const LoginScreen = () => {
  const { loading, userInfo } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo?.isActive) {
      if (userInfo?.isAdministrator) {
        navigate('/admin')
      }
      else {
        navigate('/user')
      }
    }
  }, [navigate, userInfo])

  const submitForm = (data) => {
    dispatch(userLogin(data))
  }

  return (
    <div id="login-container">
      <Form className="cl_LoginForm" onSubmit={handleSubmit(submitForm)}>
        <Form.Group>
          <Form.Control
            id="LoginUserMailInput"
            type="email"
            name="userMail"
            placeholder="E-Mail"
            className="cl_LoginInput"
            {...register('userMail')}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            id="LoginPasswordInput"
            type="password"
            name="userPassword"
            placeholder="Passwort"
            className="cl_LoginInput"
            {...register('userPassword')}
          />
        </Form.Group>
        <div>
          <Button type="submit" className="cl_LoginButton">Login</Button>
        </div>
      </Form>
    </div>
  )
}

export default LoginScreen

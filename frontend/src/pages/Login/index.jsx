import { useNavigate } from 'react-router'

import useAuth from '../../hooks/useAuth'

import UserForm from '../../components/UserForm'

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    
    const onSubmit = async (data) => {
        try {
            await login(data.username, data.password)
            navigate('/', {replace: true})
        } catch(e) {
            console.error('Login fail:', e)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <UserForm 
                onSubmit={onSubmit}
            />
        </div>
    )
}

export default Login
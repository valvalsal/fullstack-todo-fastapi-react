import { useNavigate } from 'react-router';

import useAuth from '@/hooks/useAuth';

import Form from '@/components/Form';
import type { FieldProps } from '@/components/Form';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  interface LoginForm {
    username: string;
    password: string;
  }

  const fields: Array<FieldProps<LoginForm>> = [
    {
      name: 'username',
      type: 'text',
      label: 'Login',
    },
    { name: 'password', type: 'password', label: 'Password' },
  ];

  const submitHandler = async (data: LoginForm) => {
    try {
      await login(data.username, data.password);
      navigate('/', { replace: true });
    } catch (e) {
      console.error('Login fail:', e);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <Form fields={fields} onSubmit={submitHandler} />
    </div>
  );
};

export default Login;

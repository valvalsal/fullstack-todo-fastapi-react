import { useState } from 'react';

const initialFormData = {
  username: '',
  password: '',
  full_name: '',
  email: '',
};

const getBtnText = (formMode: FormMode) => {
  const texts: Record<FormMode, string> = {
    edit: 'Save',
    login: 'Login',
    create: 'Register and login',
  };

  return texts[formMode] ?? 'Login';
};

type FormMode = 'login' | 'edit' | 'create';

export interface UserFormData {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  mode?: FormMode;
  userData?: UserFormData;
}

const UserForm = ({ userData, onSubmit, mode = 'login' }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>(
    userData || initialFormData,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buttonTxt = getBtnText(mode);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">User name:</label>{' '}
      <input
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <label htmlFor="password">Password:</label>{' '}
      <input
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
      />
      {mode === 'edit' && (
        <>
          <label htmlFor="full_name">Full name:</label>{' '}
          <input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
          <label htmlFor="email">Email:</label>{' '}
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </>
      )}
      <div>
        <button type="submit">{buttonTxt}</button>
      </div>
    </form>
  );
};

export default UserForm;

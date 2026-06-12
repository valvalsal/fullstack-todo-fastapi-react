import { useState } from "react"

const initialFormData = {
    'username': '',
    'password': '',
    'full_name': '',
    'email': ''
}

const getBtnText = (formMode) => {
    const texts = {
        'edit': 'Save',
        'create': 'Register and login'
    }

    return texts[formMode] ?? 'Login'
}

const UserForm = ({userData, onSubmit, mode = 'login'}) => {
    const [formData, setFormData] = useState(userData || initialFormData)

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const buttonTxt = getBtnText(mode)

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="username">User name:</label>
        {' '}<input id="username" name="username"
            value={formData.username} onChange={handleChange} />
        
        <label htmlFor="password">Password:</label>
        {' '}<input id="password" name="password"
            value={formData.password} onChange={handleChange} type="password" />
        
        { mode === 'edit' && <>
        <label htmlFor="full_name">Full name:</label>
        {' '}<input id="full_name" name="full_name"
            value={formData.full_name} onChange={handleChange} />
        
        <label htmlFor="email">Email:</label>
        {' '}<input id="email" name="email"
            value={formData.email} onChange={handleChange} />
        </>}
        <div>
            <button type="submit">{buttonTxt}</button>
        </div>
    </form>
    )
}

export default UserForm
import { useNavigate } from 'react-router'

import ToDoForm from '../../components/TodoForm'
import api from '../../api'

function CreateTodo() {
    const navigate = useNavigate()

    const onSave = (data) => {
        api.post('/todos/', data)
            .then(() => navigate('/'))
            .catch((e) => console.error(e))
    }
    
    const onCancel = () => {
        navigate(-1)
    }

    return (
        <div>
            <h1>Create todo</h1>
            <ToDoForm onSave={onSave} onCancel={onCancel}/>
        </div>
    )
}

export default CreateTodo
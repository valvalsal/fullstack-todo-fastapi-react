import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'

import api from '../../api'

import TodoForm from '../../components/TodoForm'

function EditTodo() {
    const navigate = useNavigate()
    const { todoId } = useParams()
    const [todo, setTodo] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/todos/${todoId}`)
            .then(response => {
                setTodo(response.data)
                setLoading(false)
            })
    }, [todoId])

    const onSave = (data) => {
        api.put(`/todos/${todoId}`, {
            "description": data.description
        }).then(() => navigate('/'))
    }

    const onCancel = () => {
        navigate(-1)
    }

    if (loading) {
        return <div>Loading&hellip;</div>
    }

    return (
        <div>
            <h1>Edit todo</h1>
            <TodoForm 
                key={todo?.id}
                itemToEdit={todo} 
                onSave={onSave}
                onCancel={onCancel}
            />
        </div>
    )
}

export default EditTodo
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'

import { updateTodo, getTodo } from '../../services/todoService'

import TodoForm from '../../components/TodoForm'
import Loader from '../../components/Loader'

function EditTodo() {
    const navigate = useNavigate()
    const { todoId } = useParams()
    const [todo, setTodo] = useState({})
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const data = await getTodo(todoId)
                setTodo(data)
                setLoading(false)
            } catch(e) {
                console.error("Error: ", e.response)
                setLoading(false)
                setErrorMessage(e.response.data.detail)
            }
        }
        
        fetchTodo()
    }, [todoId])

    const onSave = async (data) => {
        try {
            await updateTodo(todoId, {
                "description": data.description
            })
            navigate('/')
        } catch(e) {
            console.error("Error: ", e)
        }
    }

    const onCancel = () => {
        navigate(-1)
    }

    if (loading) {
        return <Loader />
    }

    if (errorMessage) {
        return (
        <div style={{paddingTop: '1rem'}}>
            <p>{errorMessage}</p>
            <p><a href="/">Go back</a></p>
        </div>
        )
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
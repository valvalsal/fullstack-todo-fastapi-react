import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import api from '../../api'

import './style.css'

function Home() {
    const [todos, setTodos] = useState([])
    const [deletingId, setDeletingId] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        api.get('/todos/')
            .then(response => setTodos(response.data))
    }, [])
    
    const handleDelete = (id) => {
        api.delete(`/todos/${id}`)
            .then(() => {
                setDeletingId(id)

                setTimeout(() => {
                    setTodos(prevTodos => prevTodos.filter(t => t.id !== id))
                    setDeletingId(null)
                }, 500)
            })
    }

    const handleDoneToggle = (todo) => {
        const newStatus = !todo.is_done
        
        api.put(`/todos/${todo.id}`, {
            "is_done": newStatus
        }).then(newTodo => {
            setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? newTodo.data : t))
        })
    }

    return (
        <div>
            <h1><FontAwesomeIcon icon="fa-solid fa-list-check" /> My todos</h1>
            <div id="container">
                {todos.map(todo => (
                    <div key={todo.id} className={`item ${deletingId === todo.id ? 'fade-out' : ''} ${todo.is_done ? 'done' : ''}`}>
                        <span 
                            className="action done"
                            title={todo.is_done ? 'Mark as not done' : 'Mark as done'}
                            onClick={() => handleDoneToggle(todo)}
                        >
                            <FontAwesomeIcon icon={`fa-regular ${todo.is_done ? 'fa-square-check' : 'fa-square'}`} />
                        </span>
                        {' '}{todo.description}
                        {' '}<span className="action edit" title="Edit" onClick={() => navigate(`/edit/${todo.id}`)}>
                                <FontAwesomeIcon icon="fa-regular fa-pen-to-square" />
                            </span>
                        {' '}<span className="action delete" onClick={() => handleDelete(todo.id)} title="Delete item">
                                <FontAwesomeIcon icon="fa-regular fa-trash-can" />
                            </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
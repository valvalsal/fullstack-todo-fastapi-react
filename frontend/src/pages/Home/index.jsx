import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* import Loader from '../../components/Loader'
import useAuth from '../../hooks/useAuth' */
import { updateTodo, getTodos, deleteTodo } from '../../services/todoService'

import './style.css'

function Home() {
    const [todos, setTodos] = useState([])
    const [deletingId, setDeletingId] = useState(null)

    const navigate = useNavigate();

    //const { isConnected, loading } = useAuth()
    
    useEffect(() => {
        /* if (loading) return
        
        if (!isConnected) {
            navigate('/login')
            return
        }       */  
        
        const fetchTodos = async () => {
            try {
                const data = await getTodos()
                setTodos(data)
            } catch (e) {
                console.error("Error: ", e)
            }
        }
        
        fetchTodos()
    }, [/*isConnected, loading, navigate*/])
    
    const handleDelete = async (id) => {
        try {
            await deleteTodo(id)
                
            setDeletingId(id)

            setTimeout(() => {
                setTodos(prevTodos => prevTodos.filter(t => t.id !== id))
                setDeletingId(null)
            }, 500)
        } catch(e) {
            console.error("Error: ", e)
        }
    }

    const handleDoneToggle = async (todo) => {
        try {
            const newStatus = !todo.is_done
            
            const newTodo = await updateTodo(todo.id, {
                "is_done": newStatus
            })
            
            setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? newTodo : t))
        } catch(e) {
            console.error("Error: ", e)
        }
    }

   /*  if (loading) {
        return <Loader />
    }

    if (!isConnected) {
        return <></>
    } */

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
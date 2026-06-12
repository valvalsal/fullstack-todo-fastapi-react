import api from '../api'

const updateTodo = async (todoId, updateData) => {
    const r = await api.put(`/todos/${todoId}`, updateData)
    return r.data
}

const getTodos = async () => {
    const r = await api.get('/todos/')
    return r.data
}

const getTodo = async (todoId) => {
    const r = await api.get(`/todos/${todoId}`)
    return r.data
}

const deleteTodo = async (todoId) => {
    return await api.delete(`/todos/${todoId}`)
}

const createTodo = async (todoData) => {
    return await api.post('/todos/', todoData)
}

export { updateTodo, getTodo, getTodos, deleteTodo, createTodo }
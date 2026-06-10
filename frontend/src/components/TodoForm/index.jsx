import { useState } from 'react'

import './style.css'

const initialFormData = {
    'description': ''
}

const TodoForm = ({itemToEdit, onSave, onCancel}) => {
    const [formData, setFormData] = useState(itemToEdit || initialFormData)

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="description">Description:</label>
        {' '}<input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
        />
      </div>
      <div className="actions">
        <button className="submit" type="submit">Save</button>
        {onCancel && <button className="cancel" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default TodoForm
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ToDo.css';

function ToDo() {
    const [task, setTask] = useState("");
    const [submittask, setSubmitTask] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://dotask-2.onrender.com/tasks');
                setSubmitTask(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }
        fetchData();
    }, []);

    
    function handleChange(event) {
        setTask(event.target.value)
    }

    async function submitTask(event) {
        event.preventDefault();
        try {
            const response = await axios.post('https://dotask-2.onrender.com/form', { name: task });
            const newTask = response.data.name;
            setSubmitTask([...submittask, newTask]);
            setTask("");
        } catch (error) {
            console.error('There was an error submitting the form!', error);
        }
    }


    async function completeTask(deleteTask) {
        try {
            await axios.post('https://dotask-2.onrender.com/delete', { name: deleteTask });
            const updatedTask = submittask.filter(task => task !== deleteTask);
            setSubmitTask(updatedTask);
        } catch (error) {
            console.error('There was an error submitting the form!', error);
        }
    }


    return (
        <div className="todo-container">
            <h1>To Do List</h1>
            <form onSubmit={submitTask} className="todo-form">
                <input 
                    type="text" 
                    onChange={handleChange} 
                    value={task}
                    placeholder="Enter a new task"
                    className="todo-input"
                />
                <button className="todo-submit-button">Submit</button>
            </form>
            <ul className="todo-list">
               {submittask.map(tasks => (
                    <li key={tasks} onClick={() => completeTask(tasks)} className="todo-item">{tasks}</li>
               ))}
            </ul>
        </div>
    );
}

export default ToDo;

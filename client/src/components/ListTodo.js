import React, { Fragment, useEffect, useState } from "react";
import { EditTodo } from "./EditTodo";

export const ListTodo = () => {
    const [todos, setTodos] = useState([])

    const deleteTodo = async (id) => {
        try {
            await fetch(`http://localhost:5000/todos/${id}`, {
                method: "DELETE"
            });

            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.log(error.message);            
        }
    }

    const getTodos = async () => {
        try {
            const response = await fetch("http://localhost:5000/todos", {
                method: "GET"
            });
            const jsonData = await response.json();

            setTodos(jsonData);
            console.log(jsonData);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getTodos();
    }, [])
    
    return (
        <Fragment>
            <table className="table mt-5 text-center">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {todos.map((todo) => (
                            <tr key={todo.id}>
                                <td>{todo.description}</td>
                                <td><EditTodo todo={todo} /></td>
                                <td><button className="btn btn-danger" onClick={ () => deleteTodo(todo.id) }>Delete</button></td>
                            </tr>
                        )                   
                    )}
                </tbody>
            </table>
        </Fragment>
    );
}
import { useState, useEffect } from 'react';

import './Tasks.css';
import Todo from './Todo';
import TodoForm from './TodoForm';

import initialTasks from './InitialTasks';

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showCompleatedTasks, setShowCompleatedTasks] = useState(false);

  const TODO_BASE_URL = 'http://localhost:3000/todos';

  const fetchData = async () => {
    const response = await fetch(TODO_BASE_URL)
    const data = await response.json()
    setTasks((tasks) => data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  function addTodo(task) {
    const postBody = JSON.stringify({
      title: task,
      completed: false,
    })

    fetch(TODO_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: postBody
    }).then(
      response => response.json()
    ).then((result) => {
      setTasks(tasks => [
        ...tasks,
        {
          id: result.id,
          title: result.title,
          completed: result.completed,
        }
      ])
    })
  }

  function deleteTodo(taskId) {
    fetch(TODO_BASE_URL + '/' + taskId, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then(() =>
      setTasks((tasks) => tasks.filter((task) => task.id !== taskId))
    )
  }

  function filterTodo(completed) { 

      setTasks((tasks) => tasks.filter((task) => task.completed == completed))
  
  }

  function setTodoCompleted(todo) {
    const putBody = JSON.stringify({
      completed: !todo.completed
    })

    fetch(TODO_BASE_URL + '/' + todo.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: putBody
    }).then(() => {
      setTasks((tasks) => {
        return tasks.map((task) => {
          if (task.id === todo.id) {
            return {
              ...task, ...{
                completed: !todo.completed
              }
            }
          }

          return task;
        })
      })
    })
  }

  return (
    <>
      <div className="Tasks">
        <h1>Tasks</h1>
        <table>
          <thead>
            <tr>
              <th>Todo ID</th>
              <th>Title</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.filter (todo=>todo.completed == showCompleatedTasks || !todo.completed ).map((todo) => {
              return <Todo key={todo.id} todo={todo} deleteTodo={deleteTodo} setTodoCompleted={setTodoCompleted} />
            
            })}
          </tbody>
        </table>
      </div>

     

      <button
        onClick={() => {
         setShowCompleatedTasks (!showCompleatedTasks)
        }}
      >
        {showCompleatedTasks?"show incompleate tasks": "show all Tasks"}
      
      </button>

      <div>
        <TodoForm addTodo={addTodo} />
      </div>
    </>
  );
}

export default Tasks;
import {useState} from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_TODOS = gql`
  query getTodos {
     todos {
      done
      id
      text
    }
  }
  `
  const TOGGLE_TODO = gql`
    mutation toggleTodo($id: uuid, $done: Boolean) {
    update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
      returning {
        done
        id
        text
      }
    }
  }
  `
  const ADD_TODO = gql`
  mutation addTodo($text: String!) {
  insert_todos(objects: {text: $text}) {
    returning {
      done
      text
      id
    }
  }
}
  `
  const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: {id: {_eq: $id}}) {
      returning {
        text
        id
        done
      }
  }
}

  `
function App() {
  const [text, setText] = useState('')
  const {data, loading, error} = useQuery(GET_TODOS)
  const [toggleTodo] = useMutation(TOGGLE_TODO)
  const [addTodo] = useMutation(ADD_TODO)
  const [deleteDoto] = useMutation(DELETE_TODO)
  if(loading) {
    return <div>...Loading</div>
  }
  const onToggleTogo = (todo) => {
      toggleTodo({variables: {id: todo.id, done: !todo.done}})
  }
  const handleSubmit = (e) => {
    e.preventDefault()
  if(!text?.trim()) return;
    addTodo({variables: {text: text}, refetchQueries: [{query: GET_TODOS}]})
    setText('')
  }
  const handleDeleteTodo = (id) => {
    deleteDoto({
      variables: {id: id}, 
      update: cache => {
        const prevData = cache.readQuery({query: GET_TODOS})//get previouse cache before mutatuin
        const newTodos = prevData.todos.filter(todo => todo.id !== id)
        cache.writeQuery({query: GET_TODOS, data: {todos: newTodos}})
      }
    })
  }
  return (
    <div className="vh-100 code flex flex-column items-center bg-pink white pa3 fl-1">
      <h1 className="f2-1">Checkist</h1>
    <form className="mb-3" onSubmit={handleSubmit}> 
      <input 
      onChange={(e) => setText(e.target.value)}
      value={text}
      type="text" 
      placeholder="What is your TODO?" 
      className="pa2 f4"></input>
      <button type="submit" className="pa2 f4">Create</button>   
    </form>
    <div className="flex items-center justufy-center flex-column">
      {data?.todos.map(todo => <p key={todo.id}  onClick={() => onToggleTogo(todo)}>
        <span className={`pointer list pa1 f3 ${todo.done && 'strike'}`}>
        {todo.text} <button className="bg-transparent bn f4">
          <span className="red" onClick={() => handleDeleteTodo(todo.id) }>&times;</span></button></span></p>)}
    </div>
    </div>
  );
}

export default App;

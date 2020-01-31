import React, { Component } from 'react'
import axios from 'axios';
import {token$, updateToken} from "./TokenStore";
import { Redirect } from 'react-router-dom';


class Todo extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            content: '',
            removeValue: '',

            todoList: [],
            addedTodo: [],

            logout: false
        }
    }

    componentDidMount() {
        const API_ROOT = 'http://3.120.96.16:3002';

        this.subscription = token$.subscribe(token => {
            console.log(token);

            axios(`${API_ROOT}/todos`, {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            })
            .then(res => {
                console.log(res.data.todos);

                let todos = res.data.todos;

                this.setState({ todoList: todos });
            })
            .catch(err => {
                console.log(err);
                // updateToken(null);
            })
        })
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    onchange = (e) => {
        this.setState({ content: e.target.value });
    }

    addTodo = () => {
        let { content } = this.state;
        const API_ROOT = 'http://3.120.96.16:3002';

        this.subscription = token$.subscribe(token => {
            console.log(token);

            let item = {
                content: content
            }

            let options = {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            };

            axios
                .post(`${API_ROOT}/todos`, item, options)
            .then (res => {

                let todo = res.data.todo;
                let newTodo = this.state.addedTodo;
                newTodo.push(todo);

                this.setState({ addedTodo: newTodo });
            })
            .catch(err => {
                console.log(err);
            })
        })
    }

    rensaInput = (e) => {
        e.preventDefault();

        this.setState({ removeValue: this.state.content, content: '' });
    }


    deleteTodo = (id) => {
        const API_ROOT = 'http://3.120.96.16:3002';

        this.subscription = token$.subscribe(token => {
            let options = {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            };

            axios.delete(`${API_ROOT}/todos/${id}`, options)
            .then(res => {
                const list = [...this.state.todoList];

                const updateList = list.filter(item => item.id !== id);

                this.setState({ todoList: updateList });
            });
        })
    }


    deleteAddedTodo = (id) => {
        const API_ROOT = 'http://3.120.96.16:3002';

        this.subscription = token$.subscribe(token => {
            let options = {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            };

            axios.delete(`${API_ROOT}/todos/${id}`, options)
            .then(res => {
                const list = [...this.state.addedTodo];

                const updateList = list.filter(item => item.id !== id);

                this.setState({ addedTodo: updateList });
            });
        })
    }

    logOut = () => {
        updateToken(null)    // kan också funka!
        localStorage.removeItem('token');
        return this.setState({logout: true})
    }


    render() {
        const { content, todoList, addedTodo, logout } = this.state;

        if (logout) return <Redirect to="/login" />


        let items = todoList.map(todo => {
            return (
                <div key={todo.id}>
                    <p key={todo.id}>{todo.content}</p>
                    <button onClick={() => this.deleteTodo(todo.id)}>Delete item</button>
                </div>
            )
        });


        let addTodo = addedTodo.map(todo => {
            return (
                <div key={todo.id}>
                    <p key={todo.id}>{todo.content}</p>
                    <button onClick={() => this.deleteAddedTodo(todo.id)}>Delete item</button>
                </div>
            )
        })


        return (
            <div>
                <form onSubmit={this.rensaInput}>
                    <label>
                        <input type="text" value={content} onChange={this.onchange} placeholder="Add your todo ..." />
                    </label>
                    <button onClick={this.addTodo}>Add todo</button>
                    <button onClick={this.logOut}>LogOut</button>
                </form>

                {items}
                {addTodo}
            </div>
        )
    }
}

export default Todo

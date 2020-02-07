import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import axios from 'axios';
import { token$, updateToken } from './TokenStore';


class AddTodos extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            content: '',
            removeValue: '',

            todos: [],

            errAddTodo: false,
            errAddTodoMsg: ''
        }
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
                let newTodo = this.state.todos;
                newTodo.push(todo);

                this.setState({ todos: newTodo });
            })
            .catch(err => {
                console.log(err);
                this.setState({ errAddTodo: true });

                if (this.state.errAddTodo) {
                    this.setState({ errAddTodoMsg: "Ooopss!! There's a server error right now, we are trying to fix it...  Try to logout and then login and se if your todo works :)" });
                } else {
                    this.setState({ errAddTodoMsg: '' });
                }
            })
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
                const list = [...this.state.todos];

                const updateList = list.filter(item => item.id !== id);

                this.setState({ todos: updateList });
            });
        })
    }

    rensaInput = (e) => {
        e.preventDefault();

        this.setState({ removeValue: this.state.content, content: '' });
    }


    render() {
        const { content, todos, errAddTodoMsg } = this.state;

        let addTodo = todos.map(todo => {
            return (
                <div key={todo.id}>
                    <p key={todo.id}>{todo.content}</p>
                    <button onClick={() => this.deleteAddedTodo(todo.id)}>Delete item</button>
                </div>
            )
        })


        return (
            <>
            <Link to="/">
                <p>Main Page</p>
            </Link>

            <form onSubmit={this.rensaInput}>
                <label>
                    <input type="text" value={content} onChange={this.onchange} placeholder="Add your todo ..." />
                </label>
                <button onClick={this.addTodo}>Add todo</button>
                {this.props.logout}
            </form>

            <br/>

            <p>{errAddTodoMsg}</p>

            <br/>

            {this.props.renderedItems}
            {addTodo}
            </>
        )
    }
}

export default AddTodos

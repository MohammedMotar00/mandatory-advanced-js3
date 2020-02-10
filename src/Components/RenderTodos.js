import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import axios from 'axios';
import jwt from 'jsonwebtoken';

import {token$, updateToken} from "./TokenStore";
import AddTodos from './AddTodos';



class RenderTodos extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            todoList: [],

            logout: false,

            currentTime: null,

            tokenExpired: false,
            tokenExpireTime: null,

            emailFromToken: null
        }
    }

    componentDidMount() {
        this.interval = setInterval( () => {
            this.setState({
                currentTime : new Date().getTime() / 1000   // <-- Gör en sån på alla sidor, så du returnerar automatiskt till login eller main sidan (beroende på vilken sida du är på!)
            })
        }, 1000)

        const API_ROOT = 'http://3.120.96.16:3002';

        this.subscription = token$.subscribe(token => {

            const decoded = jwt.decode(token);

            if (decoded) {
                this.setState({ emailFromToken: decoded.email });
                this.setState({ tokenExpireTime: decoded.exp });
                console.log(decoded.exp);
            }
            else {
                return null;
            }

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

                updateToken(null);
            })
        })
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
        this.setState({ emailFromToken: null });
    }

    componentDidUpdate() {
        let { currentTime, tokenExpireTime } = this.state;

        if (currentTime > tokenExpireTime) {
            console.log('token expired');

            this.setState({ emailFromToken: null });
            localStorage.removeItem("token");
            this.setState({ tokenExpired: true });
        }
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

    logOut = () => {
        this.setState({ emailFromToken: null });
        localStorage.removeItem('token');
        this.setState({logout: true});
        updateToken(null);
    }


    render() {
        const { todoList, logout, tokenExpired, currentTime, emailFromToken  } = this.state;

        if (logout) return <Redirect to="/login" />

        if (tokenExpired) return <Redirect to="/login" />

        const btn = <button onClick={this.logOut}>Logout</button>

        let items = todoList.map(todo => {
            return (
                <div key={todo.id} className="todo-items">
                    <p className="item" key={todo.id}>{todo.content}</p>
                    <button className="delete-btn" onClick={() => this.deleteTodo(todo.id)}>Delete item</button>
                </div>
            )
        });


        return (
            <div className="todo-page">
                <Helmet>
                    <title>Todo</title>
                </Helmet>
                {currentTime}
                <AddTodos renderedItems={items} logout={btn} />
            </div>
        )
    }
}

export default RenderTodos

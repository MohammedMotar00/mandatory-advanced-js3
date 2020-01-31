import React, { Component } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Register extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: '',
            password: '',
            registered: false
        }
    }

    emailOnchange = (e) => {
        this.setState({ email: e.target.value })
    }

    passwordOnchange = (e) => {
        this.setState({ password: e.target.value })
    }

    register = () => {
        let { email, password } = this.state;
        const API_ROOT = 'http://3.120.96.16:3002';

        let data = {
            email: email,
            password: password
        }

        axios
            .post(`${API_ROOT}/register`, data)
        .then(res => {
            console.log(res);
            this.setState({ registered: true })
        })
        .catch(err => {
            console.log(err);
        })
    }


    render() {
        const { email, password, registered } = this.state;

        if (registered) return <Redirect to="/login" />

        return (
            <form onSubmit={e => e.preventDefault()}>
                <label>
                    Email:
                    <input type="text" value={email} onChange={this.emailOnchange}/>
                </label>

                <label>
                    Password:
                    <input type="password" value={password} onChange={this.passwordOnchange}/>
                </label>

                <button onClick={this.register}>Register</button>
            </form>
        )
    }
}

export default Register

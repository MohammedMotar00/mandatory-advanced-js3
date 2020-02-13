import React, { Component } from 'react'
import jwt from 'jsonwebtoken';

import { token$, updateToken } from "./TokenStore";

class TokenExpired extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            currentTime: null,
            tokenExpireTime: null,
        }
    }

    componentDidMount() {
        this.interval = setInterval( () => {
            this.setState({
                currentTime : new Date().getTime() / 1000
            })
        }, 1000)

        this.subscription = token$.subscribe(token => {
            const decoded = jwt.decode(token);

            if (decoded) {
                this.setState({ tokenExpireTime: decoded.exp });
            }
            else {
                return null;
            }
        })
    }

    componentDidUpdate() {
        let { currentTime, tokenExpireTime } = this.state;

        if (currentTime > tokenExpireTime) {
            updateToken(null);
            this.subscription.unsubscribe();
            clearInterval(this.interval);
        }
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }

    render() {
        return <></>
    }
}

export default TokenExpired

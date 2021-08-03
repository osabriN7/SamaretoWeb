import React, { useState } from 'react'
import "../styles/PagesStyle/SignIn.css";
import axios from 'axios';
import { v4 as uuidV4} from 'uuid'
const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = (e) => {
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error')
        e.preventDefault();
        
        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/user/login`,
            withCredentials: true,
            data: {
                email,
                password,
            },
        }).then((res) => {
            console.log(res.data)
            if (res.data.errors) {
                emailError.innerHTML = res.data.errors.email;
                passwordError.innerHTML = res.data.errors.password;
            } else {
                window.location = '/diagram/' + uuidV4();;
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="form">
            <p>Login</p>
            <form action="" onSubmit={handleLogin}>
                <input type="text"
                    name="username"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email} />
                <div className="email error"></div>
                <br />
                <input type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <div className="password error"></div>
                <br />
                <button>login</button>
                <p class="message">Not registred? <a href="/account/signup">Create an account</a></p>
            </form>
        </div>
    )
};

export default SignIn;
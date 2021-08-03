import '../styles/PagesStyle/NavBar.css'
import { useSelector } from 'react-redux';
import React, { useContext, useState } from 'react';
import { UidContext } from './AppContext';
import axios from 'axios';
import cookie from "js-cookie";
import Share from './Forms/Share'
import SignIn from '../pages/SignIn';
import ShareForm from './Forms/ShareForm';




const NavBar = () => {
    const uid = useContext(UidContext);
    const userData = useSelector((state) => state.userReducer);
    const [isOpen, setIsOpen] = useState(false);
    const removeCookie = (key) => {
        if (window !== undefined) {
            cookie.remove(key, { expires: 1 })
        }
    }
    const logout = async () => {
        await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}api/user/logout`,
            withCredentials: true,

        })
            .then(() => removeCookie('jwt'))
            .catch((err) => console.log(err))
        window.location = "/account/signin";
    }
    return (
        <div class="navbar">
            <div class="container">
                <div class="logo">
                    <img src="" alt="logo" />
                </div>
                <nav>

                    {uid ? (
                        <>
                            <ul>
                                <li><button className="remove-back" onClick={() => setIsOpen(true)}> Colaborate</button></li>
                            </ul>

                            <div class="logout">
                                <button  className="remove-back" onClick={logout}>Logout</button>
                            </div>
                            <div class="pseudo"> {userData.pseudo} </div>
                        </>
                    ) : (
                        <div class="button">
                            <a href="/account/signin">Login</a>
                        </div>
                    )}
                </nav>
            </div>
            <Share open={isOpen} > 
                   <ShareForm onClose ={() => setIsOpen(false)}/>
            </Share>
        </div>

    )
};

export default NavBar;

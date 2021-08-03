import React, { useState } from 'react'
import "../../styles/PagesStyle/ShareModel.css";
import { useSelector } from 'react-redux'
import axios from 'axios';
import { v4 as uuidV4} from 'uuid'

const ShareForm = ({onClose}) => {
    const userData = useSelector((state) => state.userReducer);
    const [email, setEmail] = useState('');
    const uuid =  uuidV4();
    const handleHref = (id) => {
        document.getElementById("href").setAttribute("href", "/diagram/"+ id)
    }
    const handleLogin = (e) => {
        e.preventDefault();
        if(!email) {
            onClose();
        }else {
            axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/colaborate`,
                withCredentials: true,
                data: {
                    receiver:email,
                    sender: userData.email,
                    diagramId:uuid
                },
            }).then((res) => {
                window.location = `/diagram/${uuid}`;
                
            }).catch(err => {
                console.log(err)
            })
        }
        
    }

    return (
        <div className="form">
            <p id="p">Share with users and groups</p>
            <form action="" onSubmit={handleLogin}>
                <input type="text"
                    name="username"
                    placeholder="Add users and groups"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email} />
                <div className="email error"></div>
                <br />
                <button>Send Request</button>

                <div>
                    <p className="invitation" id="p">Invitation</p>
                    <div className="parent">
                    <ul>
                        {
                            userData.colaboraters.map((c) => (
                                <li> <a id="href" href= "/" onClick={() => handleHref(c.diagramId)}>{c.colaborater}</a></li>
                            ))
                        }
                    </ul>
                    </div>
                </div>
            </form>
        </div>
    )
};

export default ShareForm;
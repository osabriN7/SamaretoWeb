import React, { useContext, useEffect } from 'react'
import { UidContext } from '../components/AppContext';
import Diagram from './Diagram';
import SignIn from './SignIn';
const Profil = () => {
    const uid = useContext(UidContext);
    return (
        <div>
            {uid ? (
                <Diagram/>
            ): (
                <SignIn/>
            )
            }
        </div>

    )
};

export default Profil;
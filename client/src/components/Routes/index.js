import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Diagram from '../../pages/Diagram';
import Profil from '../../pages/Profil';
import SignIn from '../../pages/SignIn';
import SignUp from '../../pages/SignUp';
import NavBar from '../NavBar';
import { v4 as uuidV4} from 'uuid'
const index = () => {
    return (
        <Router>
            <NavBar/>
            <Switch>
                <Route path="/account/signin" exact component={SignIn}/>
                <Route path="/account/signUp" exact component={SignUp}/>
                <Route path="/diagram/:id">
                    <Profil/>
                </Route>
                <Redirect to={`/diagram/${uuidV4()}`} />
            </Switch>
        </Router>
    );
};

export default index;
import React, { useState } from 'react'
import "../styles/PagesStyle/SignUp.css";
import SignIn from './SignIn';
import axios from 'axios';


const SignUp = () => {
    const [formSubmit, setFormSubmit] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const terms = document.getElementById('terms');
        const pseudoError = document.querySelector('.pseudo.error');
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');
        const passwordConfirmError = document.querySelector('.password-confirm.error');
        const termsError = document.querySelector('.terms.error');

        pseudoError.innerHTML = "";
        emailError.innerHTML = "";
        passwordError.innerHTML = "";
        passwordConfirmError.innerHTML = "";
        termsError.innerHTML = "";
        if (password !== controlPassword || !terms.checked) {
            if (password !== controlPassword)
                passwordConfirmError.innerHTML = "Les mots de passe ne correspondent pas";
            if (!terms.checked)
                termsError.innerHTML = "Veillez valider les conditions générales";
        } else {
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                data: {
                    pseudo,
                    email,
                    password
                }
            }).then((res) => {
                console.log(res)
                if (res.data.errors) {
                    pseudoError.innerHTML = res.data.errors.pseudo;
                    emailError.innerHTML = res.data.errors.email;
                    passwordError.innerHTML = res.data.errors.password;
                }else{
                    setFormSubmit(true)
                }
            }).catch((err) => console.log(err))
        }
    }
    return(
    <>
        {formSubmit ? ( 
            <>
            <SignIn/>
            <h4 className="success"> Enregistrement réussie, veuillez-vous connecter</h4>
            </>
        ):(
    <div className="form">
        <p>S'inscrire</p>
        <form action="" onSubmit={handleRegister} id="sign-up-form">
                    <label htmlFor="pseudo">Pseudo</label>
                    <br />
                    <input type="text"
                        name="pseudo"
                        id="pseudo"
                        onChange={(e) => setPseudo(e.target.value)}
                        value={pseudo}>
                    </input>
                    <div className="pseudo error"></div>
                    <br />
                    <label htmlFor="email">Email</label>
                    <br />
                    <input type="text"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}>
                    </input>
                    <div className="email error"></div>
                    <br />
                    <label htmlFor="password">Mot de passe</label>
                    <br />
                    <input type="password"
                        name="passsword"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}>
                    </input>
                    <div className="password error"></div>
                    <br />
                    <label htmlFor="password-conf">Confirmer mot de passe</label>
                    <br />
                    <input type="password"
                        name="passsword-conf"
                        id="password-conf"
                        onChange={(e) => setControlPassword(e.target.value)}
                        value={controlPassword}>
                    </input>
                    <div className="password-confirm error"></div>
                    <br />
                    <input type="checkbox" id="terms"/>
                    <label htmlFor="terms">J'accepte les <a href="/" target="_blank" rel="noopener noreferrer">condition générales</a></label>
                    <div className="terms error"></div>
                    <input type="submit" value="Valider inscription" />
                </form>
    </div>
    )}
    </>
    )
};

export default SignUp;
module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' };
    if (err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déja pris";

    if (err.message.includes('email'))
        errors.email = "Email incorrect";

    if (err.message.includes('password'))
        errors.password = "Le mot de passe doit faire 6 caractères minimum";
    if (err.code === 11000 && Object.keys(err.keyValue).includes("pseudo"))
        errors.pseudo = "Ce pseudo est déja pris ";

    if (err.code === 11000 && Object.keys(err.keyValue).includes("email"))
        errors.email = "Cet email est déja enregistré "


    return errors;
}

module.exports.signInErrors = (err) => {
    let errors = { "email": '', "password": '' }

    if (err.message.includes("email"))
        errors.email = "Email inconnu";
    if (err.message.includes('password'))
        errors.password = "Le mot de passe ne correspond pas"

    return errors
}

module.exports.uploadErrors = (err) => {
    let errors = {format:'', maxSize: ''};

    if(err.message.includes('Invalid file'))
        errors.format = "Format incompatible";
    
    if(err.message.includes('max size'))
        errors.maxSize = "Le fichier dépasse 500 ko ";
    
    return errors
}
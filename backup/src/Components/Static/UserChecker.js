import {sha256} from 'js-sha256'

export const Errors = {
    USEREXIST : "User already exist.",
    DISSPASSWORD : "Password and confirm password are not same.",
    NOUSER : "No such user exist.",
    LENGTH : "Length must be greater then 3",
    SUCCESS : "User added successfully",
    LOGGEDIN : "Welcome!",
    WRONGPASSWORD: "You have entered wrong password.",
}

export const SignupChecker = async (email, password) => {
    const user = await fetch(`http://localhost:5000/get-user-email/${email}`);

    if (await user.json() === null)
        return Errors.NOUSER
    else
        return Errors.USEREXIST
}

export const loginChecker = async (email, username, password) => {
    let user = null;

    if (username === "")
        user = await fetch(`http://localhost:5000/get-user-email/${email}`);
    else
        user = await fetch(`http://localhost:5000/get-user-username/${username}`);

    user = await user.json();
    if (user === null)
        return Errors.NOUSER
    else{
        const hashedPassword = sha256(`${user.email}${password}${user.username}`)

        if (user.password === hashedPassword)
            return user;
        else
            return Errors.WRONGPASSWORD
    }
}
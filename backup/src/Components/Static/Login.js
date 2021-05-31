import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import "./../../style/main.css"

import {Errors, loginChecker} from './UserChecker';
import Navbar from './Navbar'
import {IoMdLogIn} from "react-icons/io"
import {HiOutlineUserCircle} from 'react-icons/hi'


function Login() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [flashMessage, setFlashMessage] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const[userLoggedIn, setUserLoggedIn] = useState('')
    

    const handleLoginCheck = async (e) => {
        e.preventDefault();

        const loginCheck = await loginChecker(email, username, password);

        if (loginCheck === Errors.WRONGPASSWORD)
            setFlashMessage(`${Errors.WRONGPASSWORD}`)
        else if (loginCheck === Errors.NOUSER)
            setFlashMessage(`${Errors.NOUSER}`)
        else{
            setUserLoggedIn(loginCheck);
            setLoggedIn(true);
        }
    }

    const setFlashAlert = () => {
        setFlashMessage(flashMessage);
    }

    useEffect(() => {
        setFlashAlert();
    })

    return (
        <div>
            <Navbar/>
            {flashMessage && <div class="alert alert-warning alert-dismissible fade show" role="alert">
                {flashMessage}
            </div>}
            <h1 class="mt-3 pb-3 pt-2 display-3 z-10 col-3 container-fluid text-center font-bold bg-blue-400 rounded-t-full">Login</h1>
            <div className="col-6 bg-blue-400 rounded-2xl p-5 shadow-2xl mx-auto">
                <form onSubmit={(e) => handleLoginCheck(e)} className="">
                    <div className="flex bg-pink-500 p-5 rounded-full shadow justify-between">
                        <div className="p-4 bg-green-400 rounded-full shadow-2xl">
                            <HiOutlineUserCircle size="100" className=""/>
                        </div>
                        <div className="ml-3 form-group flex-col flex justify-center align-center">
                            <input type="text" className="h-14 text-xl text-center form-control bg-gray-200 rounded-t-full shadow focus:shadow-xl focus:bg-gray-200" id="username" placeholder="Enter username" value={username} onChange={(e) => setUsername((e.target.value).trim())} required/>
                    
                            <input type="password" className="h-14 text-xl form-control bg-gray-200 text-center rounded-b-full shadow focus:shadow-xl focus:bg-gray-200" id="password" placeholder="Enter password" required value={password} onChange={(e) => setPassword((e.target.value).trim())}/>
                        </div>
                        <button type="submit" className="btn ml-3 p-4 bg-green-400 rounded-full shadow-2xl hover:bg-green-500"><IoMdLogIn size="100"/></button>
                    </div>
                </form>
                <hr className="mt-4"></hr>
                <div className="col-12 text-center mt-4">
                    <button type="button" className="btn bg-pink-500 font-bold text-gray-200 rounded-full shadow py-2 px-3 text-lg" onClick={() => window.location = "/signup"}>Create a account</button>
                </div>
            </div>
            {loggedIn && 
            <Redirect to={{
                pathname: "/",
                state: {user: userLoggedIn}
            }}/>}
        </div>
    )
}

export default Login


                    // <div className="form-group">
                    // <input type="text" className="form-control rounded-xl hover:shadow focus:shadow" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail((e.target.value).trim())}/>
                    // </div>
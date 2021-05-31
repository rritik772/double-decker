import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import "./../../style/main.css"
import { ImFilePicture } from "react-icons/im";

import {Errors, SignupChecker} from "./UserChecker";
import {sha256} from "js-sha256";
import Navbar from './Navbar'

function SignUp() {
    // firstName, secondName, email, password1, password2, username, dateBirth, profilePicture

    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [passPhrase, setPassPhrase] = useState('')
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePictureName, setProfilePictureName] = useState('')
    const [flashMessage, setFlashMessage] = useState(false)

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log("he")

        if (firstName.length < 4)
            setFlashMessage(`First Name : ${Errors.LENGTH}`);
        else if (email.length < 4)
            setFlashMessage(`Email : ${Errors.LENGTH}`);
        else if (password1 !== password2){
            if (password1.length < 4 || password2.length < 4)
                setFlashMessage(`Password and confirm password : ${Errors.LENGTH}`);
            else
                setFlashMessage(`Password and Confirm password must be same.`);
        }else if (username.length < 4)
            setFlashMessage(`Username : ${Errors.LENGTH}`)
        else{
            const signUpCheck = await SignupChecker(email, password1);

            if (signUpCheck === Errors.NOUSER){
                const formData = new FormData();

                formData.append('firstName', firstName);
                formData.append('secondName', secondName);
                formData.append('email', email);
                formData.append('username', username);
                formData.append('profilePicture', profilePicture);
                formData.append('dateBirth', dateBirth);

                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();

                const formDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                formData.append('dateCreated', formDate);
                formData.append('dateModified', formDate);

                const hashedPassword = sha256(`${email}${password1}${username}`);
                formData.append('password', hashedPassword);

                const hashedPassphrase = sha256(`${email}${passPhrase}${username}`);
                formData.append('passphrase', hashedPassphrase);

                const response = await fetch('http://localhost:5000/add-user', {
                    method : 'POST',
                    body : formData
                });

                const result = await response.json();
                if (result === "done") setFlashMessage(Errors.SUCCESS);
                else setFlashMessage("Indigestion :{, Something went wrong.")

                window.location = "/login";
            }else
                setFlashMessage(Errors.USEREXIST);
        }
    }

    const setFlashAlert = () => {
        setFlashMessage(flashMessage)
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
            <h1 class="mt-3 pb-3 pt-2 display-3 z-10 col-3 container-fluid text-center font-bold bg-blue-400 rounded-t-full">Sign Up</h1>
            <div className="mb-4 container-sm bg-blue-400 rounded-2xl p-5 shadow-2xl">
                <form encType="multipart/form-data" onSubmit={(e) => handleSignUp(e)}>
                    <div className="form-group">
                        <div className="flex">
                            <div className="col-6">
                                <input type="text" className="h-14 text-xl text-center form-control bg-gray-200 rounded-t-full shadow focus:shadow-xl focus:bg-gray-200" id="firstName" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>            
                                <input type="text" className="h-14 text-xl form-control bg-gray-200 text-center rounded-b-full shadow focus:shadow-xl focus:bg-gray-200" id="secondName" placeholder="Enter second name" value={secondName} onChange={(e) => setSecondName(e.target.value)}/>            
                            </div>
                            <div className="col-6">
                                <input type="text" className="h-14 text-xl text-center form-control bg-gray-200 rounded-t-full shadow focus:shadow-xl focus:bg-gray-200" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                <input type="text" className="h-14 text-xl form-control bg-gray-200 text-center rounded-b-full shadow focus:shadow-xl focus:bg-gray-200" id="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>            
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="flex">
                            <div className="col-6">
                                <input type="password" className="h-14 text-xl text-center form-control bg-gray-200 rounded-t-full shadow focus:shadow-xl focus:bg-gray-200" id="password1" placeholder="Enter Password" value={password1} onChange={(e) => setPassword1(e.target.value)}/>            
                                <input type="password" className="h-14 text-xl form-control bg-gray-200 text-center rounded-b-full shadow focus:shadow-xl focus:bg-gray-200" id="password2" placeholder="Confirm password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>            
                            </div>
                            <div className="col-6">
                                <div className="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text text-xl rounded-tl-full pl-4 bg-gray-200" id="basic-addon1">Date of birth</span>
                                    </div>
                                    <input type="date" className="pr-5 h-14 text-xl text-center form-control bg-gray-200 rounded-t-full focus:shadow-xl focus:bg-gray-200" id="dateBirth" value={dateBirth} onChange={(e) => setDateBirth(e.target.value)} placeholder="Date of birth"/>
                                </div>
                                <input type="text" className="h-14 text-xl form-control bg-gray-200 text-center rounded-b-full shadow focus:shadow-xl focus:bg-gray-200" value={passPhrase} onChange={(e) => setPassPhrase(e.target.value)} placeholder="Enter passphrase" required/>            
                            </div>
                        </div>
                    </div>
                    <div className="flex mt-4 h-28 form-group text-center items-center justify-evenly bg-pink-600 rounded-full">
                        <label className="mb-0 p-3 bg-green-400 cursor-pointer rounded-full btn hover:shadow-xl">
                            <label for="profilePicture">
                                <span className="text-lg font-bold">Profile picture</span>
                                {/* <ImFilePicture className="mt-1 mx-auto" size="42"/> */}
                            </label>
                            <input type="file" accept="image/*" className="hidden" name="profilePicture" id="profilePicture" onChange={(e) => {
                                setProfilePicture(e.target.files[0])
                                setProfilePictureName(e.target.files[0].name)
                                }}/><br></br>
                            <span className="text-center text-lg font-bold overflow-x-auto">{profilePictureName}</span>
                        </label>
                        <div className="text-center">
                            <button type="submit" className="text-lg font-bold px-4 py-3 btn bg-green-400 text-lg rounded-full shadow-xl transition transform hover:-translate-y-1">Sign Up</button>
                        </div>
                    </div>
                </form>
                <hr className="mt-4"></hr>
                <div className="col-12 text-center mt-4">
                    <a href="/login">
                    <button type="button" className="px-4 py-2 btn bg-pink-600 text-white text-lg font-bold rounded-full shadow-xl py-2 px-3 text-lg transition transform hover:-translate-y-1">Login</button>
                    </a>
                </div>
            </div>   
        </div>
    )
}

export default SignUp


/*

                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
*/
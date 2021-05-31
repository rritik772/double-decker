import React from 'react'
import {Link} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import "./../../style/main.css"
import {CgDarkMode, CgProfile} from 'react-icons/cg'
 

function Navbar({user}) {
    // console.log(user)

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-b-xl">
                <Link className="navbar-brand" to={{pathname: "/", state: {user: user}}}>Backer Decker</Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse mt-2" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item hover:bg-gray-700 px-2 rounded-xl">
                            <Link className="nav-link hover:hover:bg-gray-700 px-2 rounded-xl" to={{pathname:"/", state: {user: user}}}>Home</Link>
                        </li>
                        {(!user) &&
                            <li className="nav-item hover:bg-gray-700 px-2 rounded-xl">
                                <a className="nav-link" href="/login">Login</a>
                            </li>}
                        {(!user) &&
                            <li className="nav-item hover:bg-gray-700 px-2 rounded-xl">
                                <a className="nav-link" href="/signup">Sign Up</a>
                            </li>}
                        {(user) && 
                        <li className="nav-item hover:bg-gray-700 px-2 rounded-xl">
                            <Link className="nav-link hover:bg-gray-700 px-2 rounded-xl" to={{pathname:"/", state: {user: null}}}>Log out</Link>
                        </li>}
                    </ul>
                    <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                            <a className="nav-link hover:bg-gray-700 px-2 rounded-xl" href="/profile">
                                <p><span>Dark Mode</span> <CgDarkMode className="inline-block"/></p>
                            </a>
                        </li>
                        {(user) &&
                        <li className="nav-item">
                            <Link className="nav-link hover:bg-gray-700 px-2 rounded-xl" to={{pathname:"/profile", state: {user: user}}}>
                            <p><span>{user.first_name}</span> <CgProfile className="inline-block"/></p></Link>
                        </li>}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar

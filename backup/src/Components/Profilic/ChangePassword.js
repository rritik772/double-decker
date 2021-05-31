import React, {useState, useEffect} from 'react'
import {TiTick} from "react-icons/ti"

function ChangePassword({user}) {
    const [flashMessage, setFlashMessage] = useState("");    
    return (
        <div>
            <form>
                <div className="form-group">
                    <input type="text" className="h-14 text-xl text-center form-control bg-gray-200 rounded-full shadow focus:shadow-xl focus:bg-gray-200" placeholder="Enter old password"/>
                </div>
                <div className="form-group">
                    <input type="password" className="h-14 text-xl text-center form-control bg-gray-200 rounded-t-full shadow focus:shadow-xl focus:bg-gray-200" placeholder="Enter new password"/>
                    <input type="password" className="h-14 text-xl text-center form-control bg-gray-200 rounded-b-full shadow focus:shadow-xl focus:bg-gray-200" placeholder="Confirm new password"/>
                </div>
                <div className="flex justify-end">
                    <span className="p-2 bg-pink-600 w-100 mr-3 rounded-full"></span>
                    <button className="btn p-2 rounded-full shadow-xl bg-green-500"><TiTick className="text-white" size="40"/></button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword

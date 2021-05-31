import React, {useState, useEffect} from 'react'
import {RiSendPlaneFill} from "react-icons/ri"
import SingleComment from './SingleComment';

function CommentsContainer({user, postTextData, data}) {
    console.log({user, postTextData, data});
    const [commentText, setCommentText] = useState('');
    const [flashMessage, setFlashMessage] = useState('');
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (commentText.length < 4) setFlashMessage('Enter a valid comment');
        else{
            const formData = new FormData();
            formData.append('comment', commentText);
            formData.append('user_id', user.user_id);
            formData.append('post_id', postTextData.post_id)

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            const formDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            formData.append('dateCreated', formDate);
            
            const response = await fetch('http://localhost:5000/add-comment', {
                method: 'POST',
                body: formData
            })

            setCommentText("");
        }
    }

    return (
        <div>
            <div className="p-4 bg-blue-50 my-5 rounded-xl shadow container">
                {user && 
                <form className="container-sm justify-start align-start flex" onSubmit={(e) => handleCommentSubmit(e)}>
                        <div className="input-group">
                            <input type="text" className="form-control rounded-full border-2 bg-gray-50" placeholder="Type your comment" aria-describedby="sendButton" value={commentText} onChange={(e) => setCommentText(e.target.value)}/>
                            <div class="input-group-append cursor-pointer">
                                <button class="btn bg-indigo-400 hover:bg-blue-400 rounded-full" type="submit" id="button-addon2">Send
                                    <RiSendPlaneFill className="items-center p-0 ml-1 inline-block" id="sendButton" size="21"/>
                                </button>
                            </div>
                        </div>
                </form>}
                {data.comments.length > 0 && <div className="row overflow-auto h-60 justify-center align-center rounded mt-2">
                        {
                            Array.from(data.comments).map((singleComment, index) => {
                                return(<SingleComment data={singleComment} key={index}/>)
                            })
                        }
                </div>}
            </div>
        </div>
    )
}

export default CommentsContainer

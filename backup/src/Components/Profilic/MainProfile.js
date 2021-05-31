import React, {useState, useEffect}from 'react';
import Navbar from '../Static/Navbar';
import AddPost from './AddPost';
import PostContainer from '../Post/PostContainer';
import ChangePassword from './ChangePassword';


function MainProfile(props){
    let userLoggedIn = null
    try{
        userLoggedIn = props.location.state.user;
    }catch(e){
        console.error(e)
    }
    
    const [toAddPost, setToAddPost] = useState(false);
    const [toggleModal, setToggleModal] = useState(false);

    if (userLoggedIn){
        return (
            <>
            <Navbar user={userLoggedIn}/>

            {/* Profile Bar */}
            <div className="bg-blue-50 p-2 container rounded-full my-4 mx-auto">
                <div className="flex justify-center align-center">
                    <div className="btn mx-3 hover:bg-blue-500 rounded-full cursor-pointer text-gray-500 hover:text-gray-50 font-bold" onClick={() => setToAddPost(!toAddPost)}>
                        <span>Add Post</span>
                    </div>
                    <div className="btn mx-3 hover:bg-blue-500 rounded-full cursor-pointer text-gray-500 hover:text-gray-50 font-bold">
                        <span>Request for new Category</span>
                    </div>
                    <div className="btn mx-3 hover:bg-blue-500 rounded-full cursor-pointer text-gray-500 hover:text-gray-50 font-bold">
                        <span data-target="#Modal" data-toggle="modal">Change Password</span>
                    </div>
                    <div className="btn mx-3 hover:bg-blue-500 rounded-full cursor-pointer text-gray-500 hover:text-gray-50 font-bold">
                        <span>Change Passphrase</span>
                    </div>
                </div>
            </div>
            {/* Profile Bar End */}

            {toAddPost && <AddPost user={userLoggedIn}/>}
            <PostContainer user={userLoggedIn} pageNo={1}/>

{/*Modal */}

            <div className="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                    <div className="modal-content bg-blue-400">
                    <div className="modal-header">
                        <h5 className="modal-title italic font-lg font-bold" id="exampleModalLabel">
                            <span className="text-indigo-500">@</span>
                            {userLoggedIn.username}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setToggleModal(!toggleModal)}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body p-4">
                    {<ChangePassword user={userLoggedIn}/>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setToggleModal(!toggleModal)}>Close</button>
                    </div>
                    </div>
                </div>
                </div>
{/*Modal End */}
            </>
        );
    }else{
        // window.location = "/login";
        // return <><h2>hello</h2></>;
        return (<h1>Bad Request</h1>);
    }
    
}

export default MainProfile;
import React, {useState, useEffect} from 'react'
import {CgProfile} from 'react-icons/cg'

import ReactHtmlParser from 'react-html-parser'; 
import ImagesContainer from './ImagesContainer';
import {BsFillHeartFill} from "react-icons/bs";
import {FaComments} from "react-icons/fa";
import CommentsContainer from './CommentsContainer';


function SinglePost({user, postTextData, data}) {
    const [toggleInstructionIngredient, setToggleInstructionIngredient] = useState(false);
    const [toggleAllFoodPicture, setToggleAllFoodPicture] = useState(false);
    const [imagesURL, setImageURL] = useState([]);
    const [showFullPostText, setShowFullPostText] = useState(true);
    const [toggleLike, setToggleLike] = useState((data.isPostLiked.length > 0)? true : false);
    const [noOfLikes, setNoOfLikes] = useState(data.noOfLikes[0].likes)
    const [toggleComment, setToggleComment] = useState(false);

    const handleToggleInstructionIngredient = () => {
        setToggleInstructionIngredient(!toggleInstructionIngredient);
    }

    const appendPostText = () => (ReactHtmlParser(postTextData.post_text))
    const appendToggledInstruction = () => (ReactHtmlParser(data.instructions[0].instruction))
    const appendToggledIngredient = () => (ReactHtmlParser(data.ingredients[0].ingredient))

    const imagesFromBufferToImage = () => {
        const imageurls = []
        for (var i = 0; i < data.images.length; i++){
            let arrayBufferView = new Uint8Array(data.images[i].image_blob.data);

            let blob = new Blob([arrayBufferView], {type:`image/png`})
            let src = URL.createObjectURL(blob);

            imageurls.push(src);

            setImageURL(imageurls);
        }
    }

    const handleToggleLike = async () => {
        console.log(user)
        if (!user) return;

        setToggleLike(!toggleLike);

        if(toggleLike === true) setNoOfLikes(noOfLikes - 1);
        else setNoOfLikes(noOfLikes + 1);

        await incrementLikeBy1();
    }

    const incrementLikeBy1 = async () => {
        try {
            let response = null;

            const formData = new FormData();
            formData.append('post_id', postTextData.post_id);
            formData.append('user_id', user.user_id);

            if (toggleLike == true){
                formData.append('request', 0);
                response = await fetch(`http://localhost:5000/increment-like`,{
                    method: 'POST',
                    body: formData
                })
            }else if (toggleLike == false){ 
                formData.append('request', 1);
                response = await fetch(`http://localhost:5000/increment-like`,{
                    method: 'POST',
                    body: formData
                })
            }
        } catch (error) {
            console.error(error)   
        }
    }

    useEffect(() => {
        imagesFromBufferToImage();
    }, [])


    return (
        <div className="container my-5">
           <article className="p-2 bg-blue-50 rounded-xl shadow">
               <div className="row">
                   <div className="col-6">
                       <div className="row gx-5">
                           <div className="col-6 align-center flex">
                                <CgProfile size="30" className="inline-block"/>
                                <span className="font-bold p-2"> {data.userData[0].first_name}</span>
                           </div>
                           <div className="col-6 align-center flex">
                                <span className="font-bold p-2">{postTextData.category}</span>
                           </div>
                       </div>
                   </div>
                   <div className="col-6">
                        <div className="row">
                            <div className="col-6 justify-end align-center flex">
                                <span className={`btn font-bold hover:bg-blue-500 text-gray-500 hover:text-gray-50 rounded-full cursor-pointer ${toggleInstructionIngredient && "bg-green-500 text-white"}`} onClick={() => handleToggleInstructionIngredient()}>Instructions & Ingredient</span>
                            </div>
                            <div className="col-6 justify-end align-center flex">
                                <span className={`btn font-bold hover:bg-blue-500 text-gray-500 hover:text-gray-50 rounded-full cursor-pointer ${!showFullPostText && "bg-green-500 text-white"}`} onClick={() => setShowFullPostText(!showFullPostText)}>{!showFullPostText? "Show less post" : "Show full post"}</span>
                            </div>
                        </div>
                   </div>
               </div>
               <h2 className="">{postTextData.title}</h2>
               <div className="row m-4">
                   <div className={`col-7 ${(showFullPostText) ? "h-96 truncate" : ""}`} id="postTextEl">
                       {appendPostText()}
                   </div>
                   <div className="col-5 justify-center align-center flex h-96">
                        <img src={imagesURL[0]} class="img-fluid rounded-xl shadow cursor-pointer" onClick={() => setToggleAllFoodPicture(!toggleAllFoodPicture)} data-toggle="modal" data-target="#imageModal"/>
                   </div>
               </div>
               <div className="flex m-4">
                   <div className={`btn font-bold hover:bg-green-500 text-gray-500 hover:text-gray-50 rounded-full cursor-pointer ${toggleComment && "bg-green-500 text-white"}`} onClick={() => setToggleComment(!toggleComment)}>
                       <FaComments className="inline-block cursor-pointer" size="25" onClick={() => setToggleComment(!toggleComment)}/>
                       <span className="ml-3 cursor-pointer">Comments<span className="ml-2">{data.comments.length}</span></span>
                    </div>
                    <div className={`btn font-bold hover:bg-${toggleLike? "red" : "blue"}-500 ml-5 hover:text-gray-50 rounded-full cursor-pointer ${toggleLike? "bg-red-500" : ""}`} onClick={() => handleToggleLike()}>
                       <BsFillHeartFill className="inline-block cursor-pointer" color={`${toggleLike? "white" : "gray"}`} size="25"/>
                       <span className={`ml-3  ${toggleLike? "text-white":"text-gray-500"}`}>{noOfLikes}</span>
                    </div>
               </div>
{/* Image Modal */}
                {toggleAllFoodPicture && 
                <div className="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div className="modal-content bg-blue-50">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{postTextData.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setToggleAllFoodPicture(!toggleAllFoodPicture)}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body h-110 mb-5">
                    {<ImagesContainer imagesURL={imagesURL}/>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setToggleAllFoodPicture(!toggleAllFoodPicture)}>Close</button>
                    </div>
                    </div>
                </div>
                </div>}
{/* Image Modal End */}
           </article> 
               {toggleInstructionIngredient && 
               <div className="row p-2 my-2 rounded-xl mx-1 my-3 bg-blue-50 shadow">
                   <div className="col-8">
                        <span className="font-bold">Instructions</span>
                        <div className="m-3">
                            {appendToggledInstruction()}
                        </div>
                   </div>
                   <div className="col-4">
                        <span className="font-bold">Instructions</span>
                        <div className="m-3">
                            {appendToggledIngredient()}
                        </div>
                   </div>
               </div>}
               {toggleComment && <CommentsContainer user={user} postTextData={postTextData} data={data}/>}
        </div>
    )
}

export default SinglePost

import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import "./../../style/main.css"

import {BsFillPlusCircleFill} from 'react-icons/bs'
import TextareaMarkdown from 'textarea-markdown'
import {Categories} from "./FoodCategory";

function AddPost({user}) {

    const [postTitle, setPostTitle] = useState('')
    const [foodPictures, setFoodPictures] = useState('');
    const [postText, setPostText] = useState('');
    const [ingredients, setIngredient] = useState('');
    const [instructions, setInstructions] = useState('')
    const [postTextPreviewHandlerToggler, setPostTextPreviewHandlerToggler] = useState(false);
    const [formattedPostText, setFormattedPostText] = useState();
    const [formattedIngredient, setFormattedIngredient] = useState();
    const [formattedInstructions, setFormattedInstructions] = useState();
    const [selectedCategory, setSelectedCategory] = useState(Categories[0]);
    const [flashMessage, setFlashMessage] = useState(false);

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if (postText.length < 100){setFlashMessage('Post Text length must be greater than 100');}
        else if (ingredients.length < 20){setFlashMessage('Ingredient must be at least 20');}
        else if (instructions.length < 100){setFlashMessage('Instructions must be at least 100');}
        else{
            // console.log(formattedPostText.previews[0].innerHTML);
            const formData = new FormData();
            
            formData.append('title', postTitle);
            formData.append('postText', formattedPostText.previews[0].innerHTML);
            formData.append('ingredients', formattedIngredient.previews[0].innerHTML);
            formData.append('instructions', formattedInstructions.previews[0].innerHTML);
            formData.append('category', selectedCategory);
            formData.append('user_id', user.user_id)

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            const formDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            formData.append('date', formDate);

            for (var i = 0; i < foodPictures.length ;i++){
                formData.append('images', foodPictures[i])
            }
            console.log(user)
            const response = await fetch('http://localhost:5000/add-post',{ 
                method : 'POST',
                body : formData
            })
            const result = await response.json()
            if (result == "done"){
                setFlashMessage("Post Added successfully")
                setPostTitle('');
                setFoodPictures('');
                setIngredient('')
                setInstructions('');
                setPostText('');
            };
            
        }
    }

    const ingredientsPreviewHandler = () => {
        let ingredientTextarea = document.getElementById('ingredientsEditor');
        setFormattedIngredient(new TextareaMarkdown(ingredientTextarea));
    }

    const instructionPreviewHandler = () => {
        let instructionTextarea = document.getElementById('instructionEditor');
        setFormattedInstructions(new TextareaMarkdown(instructionTextarea));
    }

    const postTextPreviewHandler = () => {
        let postTextTextarea = document.getElementById('postTextEditor');
        setFormattedPostText(new TextareaMarkdown(postTextTextarea));
    }
    const inputPicturePreviewHandler = () => {
        return (
            <>
                {
                    Array.from(foodPictures).map((foodPicture, key) => {
                        try{
                            return(
                                <div className="mx-3 col-2 h-28" key={key}>
                                    <button>
                                        {/* <AiFillCloseCircle className="top-0 left-0 absolute z-10" color="red" size="25"/> */}
                                        <img src={URL.createObjectURL(foodPicture)} alt={foodPicture.name} className="h-28 rounded-xl top-0 left-0 absolute"/>
                                    </button>
                                </div>
                            );
                        }catch(error){
                            console.log(error);
                            return;
                        }
                    })
                }
            </>
        );
    }

    const appendCategoryDropdown = () => {
        return(
            <>
                {Categories.map((category,index) => {
                    return (
                        <button class="dropdown-item hover:bg-blue-200" type="button" key={index} onClick={() => setSelectedCategory(category)}>{category}</button>
                    );
                })}
            </>
        )
    }

    useEffect(() => {
        ingredientsPreviewHandler();
    }, [ingredients])
    useEffect(() => {
        instructionPreviewHandler();
    }, [instructions])
    useEffect(() => {
        postTextPreviewHandler();
    }, [postText])
    // console.log(foodPictures)

    return (
        <>
        <div>
            <form className="container-sm shadow-xl p-4 mt-5 bg-blue-50 rounded-xl mb-5" encType="multipart/form-data">
                {flashMessage && <div class="alert alert-danger rounded-xl" role="alert">
                    {flashMessage}
                </div>}
                <div className="form-group">
                    <div className="row justify-center align-center flex">
                        <div className="col-3">
                            <span className="font-bold p-2 text-3xl">A Fresh Title</span>
                        </div>
                        <div className="col-7">
                            <input type="text" className="form-control font-bold  p-2 text-xl border-2 border-gray-400" value={postTitle} onChange={(e) => setPostTitle(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-10">
                            <label for="postText" className="text-lg p-2">Tell us about the dish ;)</label>
                        </div>
                        <div className="col-2">
                            <label className="justify-center flex mr-3 cursor-pointer p-2 hover:bg-blue-200 rounded-xl" onClick={e => setPostTextPreviewHandlerToggler(!postTextPreviewHandlerToggler)}>Preview</label>
                        </div>
                    </div>
                    <textarea className="form-control text-lg border-2 border-gray-400 hover:border-blue-500" value={postText} onChange={(e) => setPostText(e.target.value)} data-preview="#postTextPreview" id="postTextEditor"></textarea>
                    <small className="form-text text-muted">
                        **markdown supported :
                            <a href="https://guides.github.com/features/mastering-markdown/"> Learn about markdown from here.</a>
                    </small>
                </div>
                {postTextPreviewHandlerToggler &&
                <div className="form-group">
                    <div className="p-2 mx-3" id='postTextPreview'></div>
                </div>}
                <hr className="my-4"></hr>
                <div className="form-group">
                    <div className="row">
                        <div className="col-6">
                            <label className="p-2" for="ingredientsEditor">Add Ingredients</label>
                            <textarea className="form-control text-lg border-2 border-gray-400 hover:border-blue-500" data-preview="#ingredientsPreview" id="ingredientsEditor" placeholder=""  value={ingredients} onChange={(e) => setIngredient(e.target.value)}></textarea>
                            <small className="form-text text-muted">
                                **markdown supported :
                                <a href="https://guides.github.com/features/mastering-markdown/"> Learn about markdown from here.</a>
                            </small>
                        </div>
                        <div className="col-6">
                            <label className="p-2">Ingredients Markdown Preview</label>
                            <div className='p-2' id="ingredientsPreview"></div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-6">
                            <label className="p-2" for="instructionEditor">Add Instructions</label>
                            <textarea id="instructionEditor" className="form-control text-lg border-2 border-gray-400 hover:border-blue-500" data-preview="#instructionPreview" value={instructions} onChange={(e) => setInstructions(e.target.value)}></textarea>
                            <small className="form-text text-muted">
                                **markdown supported :
                                <a href="https://guides.github.com/features/mastering-markdown/"> Learn about markdown from here.</a>
                            </small>
                        </div>
                        <div className="col-6">
                            <label className="p-2">Instructions markdown preview</label>
                            <div className='p-2' id="instructionPreview"></div>
                        </div>
                    </div>
                </div>
                <hr className="mt-4"></hr>
                <div className="form-group mt-4">
                    <span>Add meal pictures</span> 
                    <div className="row mt-2">
                        <div className="col-12 text-center shadow px-2 pt-4 pb-6 rounded-xl">
                            <label for="foodPics">
                                <BsFillPlusCircleFill color="gray" size="50" className="shadow rounded-full"/>
                            </label>
                            <input type="file" accept="image/*" className="hidden" id="foodPics" onChange={(e) => {setFoodPictures(e.target.files)}} multiple/>
                            <span className="form-control h-36 justify-center align-center items-center">
                                <div className="overflow-x-auto flex">
                                    {inputPicturePreviewHandler()}
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle rounded-xl shadow" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {selectedCategory}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            {appendCategoryDropdown()}
                        </div>
                    </div>
                    <div className="items-end mt-4">
                        <button type="submit" onClick={(e) => handlePostSubmit(e)} className="btn btn-primary rounded-xl shadow-xl border-5 border-blue-500 hover:border-blue-200">Submit Post</button>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}

export default AddPost

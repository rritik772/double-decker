import React, { useState, useEffect }from 'react'
import Loading from '../Loading';
import SinglePost from './SinglePost';

function PostContainer({user, page, category, pageNo}) {
    // console.log({user, page})
    const [postText, setPostText] = useState([]);
    const [postData, setPostData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [currPageNo, setCurrPageNo] = useState(pageNo);

    const getAllData = async () => {
        setIsLoading(true);

        let data = null;
        let response = null;
        if (page === "MainLanding" && user){
            response = await fetch(`http://localhost:5000/get-all-posts/${user.user_id}/${currPageNo}`)
            data = await response.json();
        }else if(user){
            response = await fetch(`http://localhost:5000/get-post-by-user_id/${user.user_id}/${currPageNo}`)
            data = await response.json();
        }else if(page == "MainLanding"){
            response = await fetch(`http://localhost:5000/get-all-posts/none/${currPageNo}`)
            data = await response.json();
        }
        // console.log(data);

        setPostText(data.posts)
        setPostData(data.postData)

        try {
            setTotalPages(parseInt(data.postData[0].TotalPost[0].count / 10) + 1)
        } catch (error) {
            setTotalPages(0)
        }        
        setIsLoading(false);
    }

    useEffect(async () => {
        await getAllData();
    }, [currPageNo]); 

    // console.log(currPageNo)
    if (isLoading)
        return (
            <div>
                <Loading/>
            </div>
        )
    return (
        <>
        {
            postText.map((postTxt, index) => {
                return (
                <>
                    <SinglePost user={user} postTextData={postTxt} data={postData[index]} key={index}/>
                </>);
            })
        }

            {/* PageNo Container */}
            <div className="my-5 flex container overflow-x-auto justify-center align-center">
                {
                    Array.from(Array(totalPages), (allPage, index) => {
                        return(
                            <button className={`btn m-2 ${((index + 1) === currPageNo)? "btn-primary": "btn-secondary"} rounded-full shadow-xl`} onClick={() => setCurrPageNo(index + 1)}>{index + 1}</button>
                        );
                    })
                }
            </div>
            {/* PageNo Container end */}
        </>
    );
}

export default PostContainer

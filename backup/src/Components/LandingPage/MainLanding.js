import React, {useEffect} from 'react'
import Loading from '../Loading';
import PostContainer from '../Post/PostContainer';
import Navbar from '../Static/Navbar'


function MainLanding(props) {
    // console.log(props)
    let userLoggedIn = null;
    try{
        userLoggedIn = props.location.state.user
    }catch(e){
        console.log(e)
    }
    
    return (
        <div>
            <Navbar user={userLoggedIn}/>
            <PostContainer user={userLoggedIn} page="MainLanding" pageNo={1}/>
        </div>
    )
}

export default MainLanding

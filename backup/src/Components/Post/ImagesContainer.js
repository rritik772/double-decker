import React, {useEffect} from 'react'
import {GrNext, GrPrevious} from 'react-icons/gr'

function ImagesContainer({imagesURL}) {

    const appendCarousalImages = () => {
        return (
        Array.from(imagesURL).map((image, index) => {
            if(index !== 0){
                return (
                <div class="carousel-item" key={index}>
                    <img src={image} class="h-110 d-block mx-auto rounded shadow-lg" alt={index} download/>
                </div>
            );
        }
        }));
    }

    return (
        <>
            <div id="postImageCarousel" className="carousel slide z-10" data-ride="carousel">
                <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={imagesURL[0]} class="h-110 d-block mx-auto rounded shadow-lg" download/>
                        </div>
                        {appendCarousalImages()}
                </div>
                <a className="carousel-control-prev" href="#postImageCarousel" role="button" data-slide="prev">
                    {/* <span className="carousel-control-prev-icon p-3 bg-blue-500 rounded-full" aria-hidden="true"></span> */}
                    <GrPrevious className="btn btn-primary p-2 rounded-full" color="black" size="40"/>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#postImageCarousel" role="button" data-slide="next">
                    {/* <span className="carousel-control-next-icon p-3 bg-blue-500 rounded-full" aria-hidden="true"></span> */}
                    <GrNext className="btn btn-primary p-2 rounded-full" color="black" size="40"/>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </>
    )
}

export default ImagesContainer

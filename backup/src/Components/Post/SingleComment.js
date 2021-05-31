import React, {useState, useEffect} from 'react'
import {CgProfile} from 'react-icons/cg'

function SingleComment({data}) {
    console.log(data)
    const [proPicSrc, setProPicSrc] = useState(null);

    const imageToBuffer = () => {
        try {
            let arrayBufferView = new Uint8Array(data.profile_pic.data);

            let blob = new Blob([arrayBufferView], {type:`image/png`})
            let src = URL.createObjectURL(blob);


            setProPicSrc(src);
        } catch (error) {
            setProPicSrc(null);
        }        
    }

    useEffect(() => {
        imageToBuffer();
    }, [data])

    return (
        <div>
           <div class="bg-white dark:bg-gray-800 w-96 shadow-sm rounded-xl p-4 m-4">
                <p class="text-gray-600 dark:text-white">
                    <span class="font-bold text-indigo-500 text-lg">
                        “
                    </span>
                    {data.comment_text}
                    <span class="font-bold text-indigo-500 text-lg">
                        ”
                    </span>
                </p>
                <div class="flex items-center mt-4">
                    <div class="block relative">
                        {proPicSrc?
                            <img alt={data.first_name} src={proPicSrc} class="mx-auto object-cover rounded-full" width="40" height="40"/>:
                            <CgProfile size="40"/>
                        }
                        
                    </div>
                    <div class="flex flex-col ml-2 justify-between">
                        <span class="font-semibold text-indigo-500 text-lg">
                            {data.first_name}
                        </span>
                        <span class="dark:text-gray-400 text-xs flex items-center font-bold ">
                            @{data.username}
                        </span>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default SingleComment

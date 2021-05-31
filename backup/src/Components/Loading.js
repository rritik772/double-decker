import React from 'react'

function Loading() {
    return (
        <div className="container">
            <div className="p-5 bg-blue-50 h-96 my-5 rounded shadow align-middle">
                <span className="animate-pulse text-5xl text-bold flex align-center justify-center">Loading...</span>
            </div>
        </div>
    )
}

export default Loading

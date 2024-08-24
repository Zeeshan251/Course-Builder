import React from 'react'

const ImageComponent = () => {
    return (
        <div className="empty space-y-2 flex flex-col text-sm justify-center items-center">
            <img
                src="/Resources.png"
                alt="Resources"
                className="size-40 object-cover"
            />
            <div className="text-center text-lg font-semibold">
                Nothing added here yet
            </div>
            <div className="text-gray-600">
                Click on the [+] Add button to add items to this course
            </div>
        </div>
    )
}

export default ImageComponent
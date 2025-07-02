const RecycleNumber = ({ text, image, number }) => {

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-2">
                <img src={image} alt="Recycle Icon" className="w-15 h-15" />
                <span className="text-4xl"> {number}</span>
            </div>
            <p className="mt-2 font-semibold text-xl">{text}</p>
        </div>
    )
}

export default RecycleNumber;
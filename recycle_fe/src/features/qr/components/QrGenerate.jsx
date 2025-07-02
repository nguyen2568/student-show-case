const QrGenerate = ({text}) => {
    return (
        <>
            <p className="text-lg text-center mb-8 font-semibold">1. Scan this QR code at the recycling bin to tracking </p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=200x200`} alt="QR Code" className="mb-4" />
        </>
    )
}

export default QrGenerate;
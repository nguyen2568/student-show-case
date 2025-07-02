// This component is used to generate a QR code for the user to scan at recycle bins.
// It will be used to track the user's recycling habits and provide information for recycling.
import styled from "styled-components";
import recycling from "../../assets/recycling.png"; // Import the recycle symbol image
import { Link } from "react-router-dom";
import { useState, useEffect, use } from "react";
import { connectSocket } from "../../api/socket";
import useAuth from "../auth/hooks/useAuth";
import { user, accumulate } from "../../api/user"; // Import the user API function
import QrGoBack from "./components/QrGoBack";
import QrGenerate from "./components/QrGenerate";
import LevelRing from "../../component/LevelRing";
import Conversion from "../../component/Conversion";
import BottleSVG from "../../assets/bottle.svg";
import CanSVG from "../../assets/cans.svg";
import Firework from "../../assets/firework.gif";
import { milestones, getCurretMilestone, getNextGoal, getPercentage } from "../../config/milestone";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Div = styled.div`
    background: #C4E7F7;
    background: linear-gradient(128deg, rgba(196, 231, 247, 1) 0%, rgba(255, 255, 255, 1) 21%, rgba(196, 231, 247, 1) 47%, rgba(255, 255, 255, 1) 77%, rgba(196, 231, 247, 1) 100%);
    padding-top: 30px;
    min-height: 100vh;
`;

const DivQR = styled.div.attrs({
    className: "mx-4 md:mx-8 lg:mx-16 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center bg-gray-100",
})``;



const QRPage = () => {

    let initialCount = 0; // Initial number of cans
    const { auth, refreshToken } = useAuth();
    const [isScanned, setIsScanned] = useState(false); // State to track if the QR code has been scanned
    const [isFinished, setIsFinished] = useState(false); // State to track if the process is finished

    const [cans, setCans] = useState(0); // State to track the number of cans scanned
    const [bottles, setBottles] = useState(0); // State to track the number of bottles scanned
    const [total, setTotal] = useState(0); // State to track the total number of cans and bottles scanned
    const [nextGoal, setNextGoal] = useState(1); // State to track the next goal

    useEffect(() => {
        if(total == nextGoal)
        {
            showNextGoal(total); // Show the next goal when the current goal is reached
        }

        
    },[total])

    const updateAccumulation = async (data) => {

        const { material } = data; // Get the material from the data

        try {
            const response = await accumulate(data);
            if (material == "plastic") {
                setBottles(x => x + 1); // Update the number of bottles scanned
            }
            if (material == "metal") {
                setCans(x => x + 1); // Update the number of cans scanned
            }

            setTotal(x => x + 1); // Update the total number of cans and bottles scanned

        } catch (error) {
            console.log("Error updating accumulation:", error);
        }
    }

    const showNextGoal = (curTotal) => {
        notify(); // Show a notification for the new milestone
        setTimeout(() => {
            setNextGoal(getNextGoal(curTotal)); // Update the next goal
        }, 1000);
    }

    const notify = () => toast('🦄 You have a new milestone!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        draggable: true,
        transition: Slide,
        theme: "colored",
        style: {
            marginTop: "10px",
            width: "400px",
            background: "skyblue",
            color: "white",
            fontWeight: "bold",
            borderRadius: "10px",
        },
    });

    const getUser = async () => {
        try {
            const response = await user(); // Pass username to the socket connection
            const accumulatedPoints = response.accumulatedPoints; // Get the accumulated points from the response

            const canInfo = accumulatedPoints.find(item => item.material === "cans" || item.material == "metal"); // Get the number of cans from the accumulated points
            const bottleInfo = accumulatedPoints.find(item => item.material === "bottle" || item.material == "plastic");; // Get the number of bottles from the accumulated points

            if (canInfo) { setCans(canInfo.count); } // Set the number of cans in the state
            if (bottleInfo) { setBottles(bottleInfo.count); } // Set the number of bottles in the state

            if (canInfo && bottleInfo) {
                initialCount = canInfo.count + bottleInfo.count; // Set the initial count to the sum of cans and bottles
            }

            setNextGoal(getNextGoal(initialCount)); // Set the next goal based on the initial count


        } catch (error) {
        }
    }

    useEffect(() => {

        let socket = null;
        const socketConnect = async () => {

            try {
                socket = await connectSocket(auth.accessToken, auth.refreshToken, refreshToken); // Pass username to the socket connection
                socket.on("scan-success", x => setIsScanned(true)); // Listen for messages from the server
                socket.on("count", data => { updateAccumulation(data) }); // Listen for messages from the server
                socket.on("session-ended", messages => { console.log(messages); }); // Listen for messages from the server       
            }
            catch (error) {
                console.error("Error connecting to socket:", error);
            }
        }

        socketConnect();
        getUser();

        return () => {
            if (socket) {
                socket.disconnect(); // Disconnect the socket when the component unmounts
                console.log("Socket disconnected");
            }
        };
    }, []);

    return (
        <Div>
            <ToastContainer />
            <DivQR>
                <div className="mb-4">
                    <img className="w-15 h-15" src={recycling} alt="" />
                </div>
                {/* show QR code for user to scan at recycle bins */}
                {!isScanned && <QrGenerate text={auth.encryptedQR} />}
                {/* scanned qr code */}
                {isScanned && !isFinished &&
                    <>
                        <p className="text-lg text-center mb-8 font-semibold">2. Put your cans or bottles in the recycle box </p>
                        <div className="w-40">
                            <LevelRing current={cans + bottles} target={nextGoal} />
                        </div>
                        <div className="flex mt-4 mb-8 space-x-2" >
                            <Conversion icon={CanSVG} number={cans} description="Cans" />
                            <Conversion icon={BottleSVG} number={bottles} description="Bottles" />
                        </div>
                        {/* finish button */}
                        <button
                            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                            onClick={() => setIsFinished(true)}>Finish</button>
                    </>
                }
                {
                    isScanned && isFinished &&
                    <>
                        <p className="text-lg text-center mb-8 font-semibold">
                            Thank you for recycling with us! <br />
                        </p>
                        <p className="text-center">You have recycled <span className="font-semibold">{total - initialCount}</span> items.</p>
                        <img src={Firework} alt="" className="w-25 h-25 mx-auto" />
                        {
                            initialCount == 0 && cans + bottles > 0 &&
                            <div>
                                <p className="text-center mt-4">The new journey is beginning! Your action is helping to protect the environment.</p>
                            </div>
                        }
                    </>
                }
                <QrGoBack />
            </DivQR>
        </Div>

    )
}

export default QRPage;
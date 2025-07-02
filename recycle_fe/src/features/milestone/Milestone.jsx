import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styled from "styled-components";
import LevelRing from "../../component/LevelRing";
import ImgBackgroundHeader from "../../assets/dashboard_header_bg.jpg";
import { Link } from "react-router-dom";
import { milestones, getCurretMilestone, getNextGoal, getPercentage } from "../../config/milestone";
import { user } from "../../api/user"; // Import the user API function
import FacebookShareButton from "../../component/ShareButton";
// 1. Define your milestone data (could come from props or your store)

const Div = styled.div.attrs({
    className: "flex flex-col space-y-4 p-6 bg-white rounded-lg"
})`
`;

const Milestone = () => {
    const [cans, setCans] = useState(0); // State to track the number of cans scanned
    const [bottles, setBottles] = useState(0); // State to track the number of bottles scanned
    const [recycledCount, setRecycledCount] = useState(0); // State to track the total number of cans and bottles scanned
    const [username, setUsername] = useState(""); // State to track the username

    const getUser = async () => {
        try {
            const response = await user(); // Pass username to the socket connection
            setUsername(response.username); // Set the username in the state
            const accumulatedPoints = response.accumulatedPoints; // Get the accumulated points from the response
            let cans = 0; // Initialize cans count
            let bottles = 0; // Initialize bottles count
            const canInfo = accumulatedPoints.find(item => item.material === "cans" || item.material == "metal"); // Get the number of cans from the accumulated points
            const bottleInfo = accumulatedPoints.find(item => item.material === "bottle" || item.material == "plastic");; // Get the number of bottles from the accumulated points
            if (canInfo) { setCans(canInfo.count); cans = canInfo.count; } // Set the number of cans in the state
            if (bottleInfo) { setBottles(bottleInfo.count); bottles = bottleInfo.count } // Set the number of bottles in the state

            setRecycledCount(cans + bottles); // Set the total number of cans and bottles in the state

        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(function() {
        getUser(); // Call the function to fetch user data
    },[])

    return (
        <div className="relative w-full h-screen">
            <div className="header absolute">
                <img src={ImgBackgroundHeader} alt="Background" className="w-full h-full object-cover rounded-b-xl" />
            </div>
            <div className="relative container mx-auto px-4 pt-10">
                <div className="bg-white rounded-lg p-6 mb-4 shadow-md">
                    <h1 className="text-center font-semibold text-2xl text-gray-800 mb-4">Your milestones</h1>
                    <div className="w-30 mx-auto mb-4">
                        <LevelRing current={recycledCount} target={getNextGoal(recycledCount)} />
                    </div>
                    <p className="text-center">Hi, {username}</p>
                    <div>
                        <p className="text-center">Milestone: <span className="font-semibold  mb-4">{getCurretMilestone(recycledCount)}</span></p>
                        <p className="text-center">Your process: <span className="font-semibold  mb-4">{getPercentage(recycledCount)}%</span></p>
                        <div className="text-center mb-4">
                            <FacebookShareButton username={username}/>
                        </div>
                    </div>
                    {
                        recycledCount == 0 &&
                        <>
                            <p className="text-center">You have not recycled any items yet.</p>
                            <p className="text-center">
                                <Link to="/qr" className="text-center text-blue-500 hover:underline">Start recycling now!</Link>
                            </p>
                        </>
                    }
                </div>
            </div>
            <Div>
                {milestones.map((m) => {
                    const achieved = recycledCount >= m.threshold;
                    const Icon = m.icon;
                    return (
                        <div key={m.id}
                            className={clsx(
                                "flex items-center space-x-3 p-4 rounded-2xl transition-shadow duration-200",
                                achieved
                                    ? "bg-green-50 text-green-800 shadow-lg"
                                    : "bg-gray-100 text-gray-400 filter grayscale"
                            )}
                        >
                            <Icon
                                className={clsx(
                                    "w-8 h-8 flex-shrink-0 transition-transform duration-200",
                                    achieved && "transform scale-110"
                                )}
                            />
                            <div>
                                <p className="font-semibold">{m.title}</p>
                                <p>Recycled: {m.threshold}</p>
                            </div>
                        </div>
                    );
                })}
            </Div>

        </div>
    )
}

export default Milestone;
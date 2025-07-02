import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styled from "styled-components";
import LevelRing from "../../component/LevelRing";
import ImgBackgroundHeader from "../../assets/dashboard_header_bg.jpg";
import { Link } from "react-router-dom";
import { milestones, getCurretMilestone, getNextGoal, getPercentage } from "../../config/milestone";
import { useParams } from 'react-router-dom';

// 1. Define your milestone data (could come from props or your store)

const Div = styled.div.attrs({
    className: "flex flex-col space-y-4 p-6 bg-white rounded-lg"
})`
`;

const Share = () => {

    const { canPar, bottlePar } = useParams();

    const [cans, setCans] = useState(0); // State to track the number of cans scanned
    const [bottles, setBottles] = useState(0); // State to track the number of bottles scanned
    const [recycledCount, setRecycledCount] = useState(0); // State to track the total number of cans and bottles scanned

    useEffect(function () {
        if (canPar) {
            setCans(parseInt(canPar)); // Set the number of cans in the state
        }
        if (bottlePar) {
            setBottles(parseInt(bottlePar)); // Set the number of bottles in the state
        }
        setRecycledCount(parseInt(canPar) + parseInt(bottlePar)); // Set the total number of cans and bottles in the state
    }, [])

    return (
        <div className="relative w-full h-screen">
            <div className="header absolute">
                <img src={ImgBackgroundHeader} alt="Background" className="w-full h-full object-cover rounded-b-xl" />
            </div>
            <div className="relative container mx-auto px-4 pt-10">
                <div className="bg-white rounded-lg p-6 mb-4 shadow-md">
                    <h1 className="text-center font-semibold text-2xl text-gray-800 mb-4">Welcome</h1>
                    <div className="w-30 mx-auto mb-4">
                        <LevelRing current={recycledCount} target={getNextGoal(recycledCount)} />
                    </div>
                    <div className="text-center mb-4">
                        Here's what I've achieved
                    </div>
                    <div>
                        <p className="text-center">Milestone: <span className="font-semibold  mb-4">{getCurretMilestone(recycledCount)}</span></p>
                    </div>
                    <p className="text-center text-gray-500 mb-4 font-semibold">
                        <Link to="/qr" className="text-center text-blue-500 hover:underline">Start recycling now!</Link>
                    </p>
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

export default Share;
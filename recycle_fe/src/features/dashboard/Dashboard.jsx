import ImgBackgroundHeader from "../../assets/dashboard_header_bg.jpg";
import CanSVG from "../../assets/cans.svg";
import BottleSVG from "../../assets/bottle.svg";
import EnergySVG from "../../assets/electric.svg";
import LightBulb from "../../assets/lightbulb.svg";
import TV from "../../assets/tv.svg";
import Process from "./components/Process";
import RecycleNumber from "./components/RecycleNumber";
import Conversion from "./components/Conversion";
import { useEffect, useState } from "react";
import { getNextGoal, getCurretMilestone } from "../../config/milestone";
import info from "../../config/information";
import { user } from "../../api/user"; // Import the user API function
import convertInfo from "../../component/DataInformation";

const Dashboard = function () {

    const [username, setUsername] = useState(""); // State to track the username
    const [cans, setCans] = useState(0); // State to track the number of cans scanned
    const [bottles, setBottles] = useState(0); // State to track the number of bottles scanned
    const [total, setTotal] = useState(0); // State to track the total number of cans and bottles scanned

    const getUser = async () => {
        try {
            const response = await user(); // Pass username to the socket connection
            setUsername(response.username); // Set the username in the state
            const accumulatedPoints = response.accumulatedPoints; // Get the accumulated points from the response
            console.log("Accumulated points:", accumulatedPoints); // Log the accumulated points
            
            let cans = 0; // Initialize cans count
            let bottles = 0; // Initialize bottles count
            const canInfo = accumulatedPoints.find(item => item.material === "cans" || item.material == "metal"); // Get the number of cans from the accumulated points
            const bottleInfo = accumulatedPoints.find(item => item.material === "bottle" || item.material == "plastic");; // Get the number of bottles from the accumulated points
            
            if (canInfo) { setCans(canInfo.count); cans = canInfo.count; } // Set the number of cans in the state
            if (bottleInfo) { setBottles(bottleInfo.count); bottles = bottleInfo.count } // Set the number of bottles in the state

            setTotal(cans + bottles); // Set the total number of cans and bottles in the state

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser(); // Call the function to fetch user data
    },[]);

    return (
        <>
            <div className="relative w-full h-screen">
                <div className="header absolute w-full">
                    <img src={ImgBackgroundHeader} alt="Background" className="w-full h-full object-cover rounded-b-xl" />
                </div>
                <div className="container mx-auto px-4 relative">
                    <div className="flex ">
                        <div className="w-1/2 flex p-4">
                            <Process username={username} title={getCurretMilestone(total)} current={total} target={getNextGoal(total)} />
                        </div>
                        <div className="w-1/2 flex p-4">
                            <div className="flex flex-col space-y-2">
                                <RecycleNumber text={"Can"} image={CanSVG} number={cans} />
                                <RecycleNumber text={"Bottle"} image={BottleSVG} number={bottles} />
                            </div>
                        </div>
                    </div>
                    <p className="font-bold text-center font-semibold">Total Co2 Prevented: {info.co2Save(cans,bottles)} kg</p>
                    <p className="mt-2 text-center">The number of cans and bottles you have recycled is equivalent</p>
                    <Conversion info={convertInfo.find(x => x.name == "water")} cans={cans} bottles={bottles}/>
                    <Conversion info={convertInfo.find(x => x.name == "electricity")} cans={cans} bottles={bottles}/>
                    <Conversion info={convertInfo.find(x => x.name == "lightbulb")} cans={cans} bottles={bottles}/>
                    <Conversion info={convertInfo.find(x => x.name == "tv")} cans={cans} bottles={bottles}/>

                        
                    {/* <Conversion icon={BottleSVG} number={info.waterSave(cans,bottles)} unit={"Liter"}  description={"Water you have saved."} />
                    <Conversion icon={EnergySVG} number={info.electricitySave(cans,bottles)} unit={"kWh"} description={"Of electricity"} />
                    <Conversion icon={LightBulb} number={info.lightbulbSave(cans,bottles)} unit={"Hours"} description={"Of lighting a light bulb."} />
                    <Conversion icon={TV} number={info.tvOn(cans,bottles)} unit={"Hours"} description={"Of TV operation"} /> */}
                </div>
            </div>
        </>
    )
}

export default Dashboard;


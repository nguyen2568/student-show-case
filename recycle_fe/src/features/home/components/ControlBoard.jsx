import Button from "./Button"
import RecyleBin from "../../../assets/recycle-bin.png";
import PieChart from "../../../assets/pie-chart.png";

const ControlBoard = () => {
    //This component contains two buttons: Recycle Now and Dashboard
    return (
        <div className="flex justify-center items-center mt-20 space-x-10">
            <Button text={"Recycle Now"} image={RecyleBin} url={"/qr"}/>
            <Button text={"Dashboard"} image={PieChart} url={"/dashboard"}/>
        </div>
    )
}

export default ControlBoard
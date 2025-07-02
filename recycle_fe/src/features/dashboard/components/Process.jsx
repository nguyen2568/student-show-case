import LevelRing from "../../../component/LevelRing";
import { Link } from "react-router-dom";
const Process = ({ username, title, current, target }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center">
            <LevelRing  current={current} target={target} />
            <p className="mt-4 text-xl font-semibold">Hi, {username}</p>
            <p className="text-sm"><i>{title}</i></p>
        </div>
    )
}

export default Process;
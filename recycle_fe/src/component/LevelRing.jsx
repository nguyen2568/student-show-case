// LevelRing.jsx
import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Import your plant image (can be local asset or URL)
import plantIcon from "../assets/plant.gif"; // Adjust the path as necessary

export default function LevelRing({ current, target}) {

    const percent = (current * 100) / target; 
    
  return (
    <div style={{ width: "100%" }}>
      <CircularProgressbarWithChildren
        value={percent}               // 0-100
        strokeWidth={9}
        styles={buildStyles({
          pathColor: "#079CC0",       // green arc
          trailColor: "#e6eff1",      // light grey background ring
          strokeLinecap: "round",
        })}
      >
        {/* children are perfectly centered */}
        <img src={plantIcon} width={"50%"} alt="" style={{borderRadius: "50%" }} />
        <strong style={{ fontSize: 16 }}>{current}/{target}</strong>
      </CircularProgressbarWithChildren>
    </div>
  );
}


import styled from 'styled-components';
import HomeImg from '../../assets/dashboard_bg.png'; // Import the background image
import LevelRing from '../../component/LevelRing';
import ControlBoard from './components/ControlBoard';
import { user } from '../../api/user';
import { useEffect, useState } from 'react';
import { getNextGoal } from '../../config/milestone';
const HomePageContainer = styled.div`
  min-height: 100vh;
  background-color: #C4E8F6;
  background-image: url(${HomeImg}); /* Set the background image */
  background-size: cover; /* Ensure the image covers the entire page */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent repetition */
`;

const H2Styled = styled.h2`
  text-align: center;
  font-size: 40px;
  color: #fff;
  font-weight: 600;
  margin: 0; /* Remove margin to prevent parent movement */
  position: relative; /* Use relative positioning */
  top: 20px; /* Adjust the top position */
`;

const DivRing = styled.div`
display: flex
;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    background: #ffffffe3;
    padding: 30px;
    width: 240px;
    margin: auto;
    margin-top: 30px;
    border-radius: 50%;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;


const HomePage = () => {

  const [cans, setCans] = useState(0); // State to track the number of cans scanned
  const [bottles, setBottles] = useState(0); // State to track the number of bottles scanned
  const [total, setTotal] = useState(0); // State to track the total number of cans and bottles scanned

  const getUser = async () => {
    try {
      const response = await user(); // Pass username to the socket connection
      const accumulatedPoints = response.accumulatedPoints; // Get the accumulated points from the response
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
  }, []);

  return (
    <HomePageContainer>
      <H2Styled>WELCOME</H2Styled>
      <DivRing>
        <LevelRing current={total} target={getNextGoal(total)} />
      </DivRing>
      <ControlBoard />
    </HomePageContainer>
  );
};

export default HomePage;
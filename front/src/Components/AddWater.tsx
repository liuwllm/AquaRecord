import { useState, useEffect } from 'react';
import axios from 'axios';
import Water from "../Images/Water.png";
import Cup from "../Images/Cup.png";
import "../WaterButton.css";

const BASE_URL = 'http://localhost:5000/api';

const WaterButton = () => {
    const [ cupCount, setCupCount ] = useState(0);
    const [ height, setHeight ] = useState(0);
    const [ disable, setDisable ] = useState(false);

    useEffect(() => {
        axios.get(BASE_URL + '/daily_intake/get', {withCredentials: true})
        .then((res) => {
            setCupCount(res.data.cupCount); // set cupCount to what ever is stored in the database
            setHeight(res.data.cupCount * 12.5); // set height to the proper percentage based on cupCount
        });
    }, []);

    const addCup = async () => {
        setCupCount(cupCount + 1); // tracks cup count
        // Determine the height of the water level (as a percentage) assuming that the 
        //    person should drink 8 cups of water per day
        setHeight((cupCount + 1) * 12.5); // cupCount is not updated here so we have to use cupCount+1
        
        setDisable(true); // disable button after click

        // Update the IntakeAmount value in the database
        await axios.post(BASE_URL + '/daily_intake/post', {cups: cupCount+1}, {withCredentials: true});

        setTimeout(() => setDisable(false), 1000); // time out for 1 second then re-enable button
    }

    return (
        <>
        <div>
            <h4>Cups Drank Today: {cupCount}</h4>
            <button onClick={ addCup } disabled={disable}>
                <h4 className="text"> Add Cup </h4>

                <img 
                    className="water" src={Water} 
                    style={{clipPath: `inset(${100 - height}% 0 0 0)` /* clips off the image of water */ }}
                />
                
                <img className="cup" src={Cup} />
            </button>
        </div>
        </>
    )
}

export default WaterButton;
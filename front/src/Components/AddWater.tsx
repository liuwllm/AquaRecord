import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const WaterButton = () => {
    const [ cupCount, setCupCount ] = useState(0);

    useEffect(() => {
        axios.get(BASE_URL + '/daily_intake/get', {withCredentials: true})
        .then((res) => {
            setCupCount(res.data.cupCount);
        });
    }, []);

    const addCup = async () => {
        setCupCount(cupCount + 1)

        await axios.post(BASE_URL + '/daily_intake/post', {cups: cupCount+1}, {withCredentials: true});
    }

    return (
        <>
        <div>
            <h4>Cups Drank Today: {cupCount}</h4>
            <button onClick={ addCup }> Add Cup </button>
        </div>
        </>
    )
}

export default WaterButton;
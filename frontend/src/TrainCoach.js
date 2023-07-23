import React, { useEffect, useState } from 'react';
import './TrainCoach.css';
import axios from 'axios';

const TrainCoach = () => {
    // const totalSeats = 80;
    const rowsWith7Seats = 11;
    // const rowsWith3Seats = 1;

    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [noofSeats, setSeats] = useState(0);
    const [inalidinput, setinvalidinput] = useState(false);
    const fetchData = async () => {
        try {
            const response = await axios.get('/seats');
            console.log(response);
            setOccupiedSeats(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData(); // Call the function to fetch the data
    }, []);


    const handleSubmit = async () => {
        if (noofSeats > 0 && noofSeats <= 7) {
            let data = { numSeats: noofSeats };
            data.numSeats = parseInt(data.numSeats);
            // console.log(data)
            try {
                const response = await axios.post('/reserve', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(response);

                fetchData();
                if (response.data.error) {
                    alert(`${response.data.error}`);
                }
            } catch (error) {
                alert(`${error}`);
            }
        }
        else {
            setinvalidinput(true);
        }
    }

    const renderSeats = () => {
        const seats = [];
        let seatNumber = 1;

        // Rows with 7 seats
        for (let row = 1; row <= rowsWith7Seats; row++) {
            for (let seat = 1; seat <= 7; seat++) {
                const isOccupied = occupiedSeats.includes(seatNumber);
                seats.push(
                    <div
                        key={seatNumber}
                        className={`seat ${isOccupied ? 'occupied' : 'available'}`}
                    // onClick={() => handleSeatClick(seatNumber)}
                    >
                        {seatNumber}
                    </div>
                );
                seatNumber++;
            }
        }

        // Row with 3 seats
        for (let seat = 1; seat <= 3; seat++) {
            const isOccupied = occupiedSeats.includes(seatNumber);
            seats.push(
                <div
                    key={seatNumber}
                    className={`seat ${isOccupied ? 'occupied' : 'available'}`}
                // onClick={() => handleSeatClick(seatNumber)}
                >
                    {seatNumber}
                </div>
            );
            seatNumber++;
        }

        return seats;
    };

    return (
        <div className="train-coach">
            <div class="input-container">
                <input type="text" id="bookInput" placeholder="Enter number of seats" value={noofSeats} onChange={(e) => setSeats(e.target.value)} />
                <button id="submitButton" onClick={handleSubmit}>Book</button>
            </div>
            {inalidinput ? <p style={{ color: 'red' }}>Invalid input number of seats should be grater than 0 and less then equal to 7</p> : ''}
            <div className="seat-layout">{renderSeats()}</div>
            <div className="legend">
                <div className="available-seat"></div> Available
                <div className="occupied-seat"></div> Occupied
            </div>
        </div>
    );
};

export default TrainCoach;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Array to represent coach seats (initially all seats are available)
let coachSeats = Array(80).fill(false);

// Helper function to check if a row has enough consecutive seats available
// const hasEnoughConsecutiveSeats = (start, numSeats) => {
//     for (let i = start; i < start + numSeats; i++) {
//         if (!coachSeats[i]) {
//             return false;
//         }
//     }
//     return true;
// };

// // Helper function to book consecutive seats in a row
// const bookConsecutiveSeats = (start, numSeats) => {
//     for (let i = start; i < start + numSeats; i++) {
//         coachSeats[i] = false;
//     }
// };

// // Helper function to find and book seats in nearby rows if a complete row is not available
// const bookNearbySeats = (numSeats) => {
//     let startSeat = -1;
//     for (let i = 0; i < coachSeats.length - numSeats + 1; i++) {
//         if (hasEnoughConsecutiveSeats(i, numSeats)) {
//             startSeat = i;
//             break;
//         }
//     }
//     if (startSeat !== -1) {
//         bookConsecutiveSeats(startSeat, numSeats);
//         return true;
//     }
//     return false;
// };

// // API endpoint to reserve seats
// app.post('/reserve', (req, res) => {
//     const numSeats = req.body.numSeats;
//     if (numSeats > 0 && numSeats <= 7) {
//         if (numSeats <= coachSeats.filter((seat) => seat).length) {
//             if (!bookNearbySeats(numSeats)) {
//                 res.status(400).json({ message: 'Seats not available.' });
//             } else {
//                 res.json({ message: 'Seats reserved successfully.' });
//             }
//         } else {
//             res.status(400).json({ message: 'Not enough available seats.' });
//         }
//     } else {
//         res.status(400).json({ message: 'Invalid number of seats.' });
//     }
// });
const totalSeats = 80;
const seatsInRow = 7;
const lastRowSeats = 3;

app.post('/reserve', (req, res) => {
    const numSeats = req.body.numSeats;

    if (numSeats <= 0 || numSeats > totalSeats) {
        return res.status(400).json({ error: 'Invalid number of seats requested.' });
    }

    let startSeat = 0;
    let endSeat = 0;
    let consecutiveSeats = 0;

    for (let i = 0; i < totalSeats; i++) {
        if (!coachSeats[i]) {
            if (consecutiveSeats === 0) {
                startSeat = i;
            }

            consecutiveSeats++;

            if (consecutiveSeats === numSeats) {
                endSeat = i;
                break;
            }
        } else {
            consecutiveSeats = 0;
        }
    }

    if (consecutiveSeats === numSeats) {
        for (let i = startSeat; i <= endSeat; i++) {
            coachSeats[i] = true;
        }

        return res.status(200).json({
            message: `${numSeats} seats successfully reserved from seat ${startSeat + 1} to ${endSeat + 1}.`,
        });
    } else {
        return res.status(200).json({ error: 'Seats not available for reservation.' });
    }
});
app.get('/seats', (req, res) => {
    const result = coachSeats.map((value, index) => ({ value, index }))
        .filter(item => item.value === true)
        .map(item => item.index);
    res.send(result);
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

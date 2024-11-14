const express = require('express');
const app = express();
app.use(express.json());

// Hardcoded credentials (for simplicity)
const USERNAME = 'admin';
const PASSWORD = 'password123';

// Middleware for Basic Authentication
function basicAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: Missing Authorization Header' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === USERNAME && password === PASSWORD) {
        return next(); // Proceed if authentication is successful
    } else {
        return res.status(401).json({ message: 'Unauthorized: Invalid Credentials' });
    }
}

// Sample data
const due_date = ["20241113", "20241020", "20240826", "20240322", "20241115", "20240619"];
const student_name = ["Asfaw Wossen", "Atsede Aweke", "Ayalew Belaynesh", "Biniam Endelkachew", "Frehiwot Fantu", "Gebremeskel Gemechu"];
const account_no = ["1000095047444", "1000034544578", "1000030382812", "1000092589930", "1000078673328", "1000054783756"];
const amount = [3251.23, 2368.78, 2980.84, 5064.94, 5881.48, 9902.29];
const penalty = [0.00, 50.00, 100.00, 25.00, 100.00, 0.00];
const SCHOOL_ACCOUNT = "1000453423451";

// Protected GET route
app.get('/api/CBE/schoolbill/:id', basicAuth, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "Invalid ID. Please provide a valid ID number." });
    }

    if (id % 7 > 5) {
        return res.status(406).json({ message: "ID Doesn't exist. Please make sure a correct ID number is inserted!" });
    }

    res.json({
        id: id,
        due_date: due_date[id % 7],
        student_name: student_name[id % 7],
        amount: amount[id % 7],
        penalty: penalty[id % 7],
        total: amount[id % 7] + penalty[id % 7],
    });
});

// Protected POST route
app.post('/api/CBE/schoolbill', basicAuth, (req, res) => {
    const id = parseInt(req.body.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid input: 'id' is required and must be an integer." });
    }

    const amount = parseFloat(req.body.amount);
    if (isNaN(amount)) {
        return res.status(400).json({ message: "Invalid input: 'amount' is required and must be a number." });
    }

    const penalty = req.body.penalty ? parseFloat(req.body.penalty) : 0;
    if (req.body.penalty && isNaN(penalty)) {
        return res.status(400).json({ message: "Invalid input: 'penalty' must be a number if provided." });
    }

    if (id % 7 > 5) {
        return res.status(406).json({ message: "ID Doesn't exist. Please make sure a correct ID number is inserted!" });
    }

    const today = new Date();

    function generateReferenceCode() {
        const length = 10;
        const max = Math.pow(10, length) - 1;
        const min = Math.pow(10, length - 1);
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber.toString();
    }

    res.json({
        payment_status: "done",
        date: today,
        reference_code: generateReferenceCode(),
        student_name: student_name[id % 7],
        amount: amount,
        penalty: penalty,
        total: amount + penalty,
        debit_account: account_no[id % 7],
        credit_account: SCHOOL_ACCOUNT,
    });
});

const PORT = 4500;
app.listen(PORT, () => {
    console.log("Server Listening at port 4500");
});

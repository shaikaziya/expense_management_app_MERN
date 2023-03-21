const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(401).send("Invalid credentials");
        }
        const storedPassword = user.password;
        const isPasswordMatch = await bcrypt.compare(password, storedPassword)
        if (!isPasswordMatch) {
            response.status(401).send("Invalid credentials");
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)
        res.status(200).json({ id: user._id, name: user.name, email: user.email, token: token })
    } catch (error) {
        res.status(400).json(error);
    }
};

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (user) {
            return res.status(404).send("Email already exists");
        }
        const salt = await bcrypt.genSalt(10); //bcrypt.gensalt(no of rounds)        
        const encryptedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: encryptedPassword });
        await newUser.save();
        res.status(201).json({
            success: true,
            newUser
        });
    } catch (error) {
        res.status(400).json(error);
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email })

    if (!user) {
        res.status(400).send({ message: "Invalid Email" })
        return;
    }

    try {
        const secret = process.env.SECRET_KEY + user.password
        const payload = {
            email: user.email,
            id: user._id
        }
        //User exist and now create a one time link valid for 15 minutes
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });
        var mailOptions = {
            from: process.env.EMAIL,
            to: `${user.email}`,
            subject: 'Password reset link from Expense management application',
            html: `We have received your request for reset password. Click this link to reset your password.<br>
                  <a href = ${link}>Click Here</a><br>
                  <p>This link is valid for 15 minutes from your request initiation for password recovery.</p>`
        };

        await transporter.sendMail(mailOptions).then((response) => console.log(response)).catch((error) => console.log(error));
        res.send({ message: "Email sent successfully" })
    }
    catch (error) {
        res.send({ error })
    }
};

const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    //check if this id exist in database
    const user = await userModel.findById(id)

    if (!user) {
        res.status(400).send({ message: "User not exists!!" })
        return;
    }
    const secret = process.env.SECRET_KEY + user.password;
    try {
        const verify = jwt.verify(token, secret)
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt)
        await userModel.findByIdAndUpdate({ _id: id }, { $set: { password: encryptedPassword } })
        res.send({ message: "Password updated" })
    }
    catch (error) {
        res.send({ message: "Something went wrong" })
    }
};

module.exports = { loginController, registerController, forgotPassword, resetPassword }
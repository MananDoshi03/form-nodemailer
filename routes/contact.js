const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config(); 

router.post("/contactform", async (req, res) => {
  const { name, company, phone, email, companysel, comments } = req.body;

  if (!name || !email || !comments) {
    return res.status(400).json({ message: "Name, Email, and Comments are required." });
  }

  try {
    res.status(200).json({ message: "Form submitted successfully!" });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company Select:</strong> ${companysel}</p>
        <p><strong>Comments:</strong> ${comments}</p>
      `,
    };

    const userMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Thank You for Contacting Us!",
      html: `
        <h3>Thank You, ${name}!</h3>
        <p>We have received your message and will get back to you shortly.</p>
        <p><strong>Your Submission:</strong></p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Comments:</strong> ${comments}</p>
        <p><strong>Company Selected:</strong> ${companysel}</p>
        <p>Best regards,</p>
        <p>Your Company Name</p>
      `,
    };

    Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]).catch((err) => console.error("Error sending emails:", err));

  } catch (error) {
    console.error("Error processing request:", error);
  }
});


module.exports = router;

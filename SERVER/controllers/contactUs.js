
const mailSender = require("../utils/mailSender");

exports.contactUs = async (req, res) => {
  const { firstname, lastname, email, message, phoneNo } = req.body;
  if (!firstname || !email || !message) {
    return res.status(403).send({
      success: false,
      message: "All Fields are required",
    });
  }
  try {
    const data = {
      firstname,
      lastname: `${lastname ? lastname : "null"}`,
      email,
      message,
      phoneNo: `${phoneNo ? phoneNo : "null"}`,
    };
    const info = await mailSender(
      process.env.MAIL_USER,
      "Enquery",
      `<html><body>${Object.keys(data).map((key) => {
        return `<p>${key} : ${data[key]}</p>`;
      })}</body></html>`
    );
    if (info) {
      return res.status(200).send({
        success: true,
        message: "Your message has been sent successfully",
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

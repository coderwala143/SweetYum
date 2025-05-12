const validatePhoneNum = (phone) => {
    let phoneRegx = /^\d{10}$/;
    if (!phoneRegx.test(phone)) {
      return res.status(400).json({ message: "Invalid Phone Number Format." });
    }
}

module.exports = {
    validatePhoneNum
}
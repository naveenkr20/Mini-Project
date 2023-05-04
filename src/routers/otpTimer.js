const express = new require('express');
const router = new express.Router()

router.get('/otpTimer', function(req, res) {
  // Render the OTP Timer page using EJS template engine
  res.render('otpTimer', {otpError: false, otpExpired: false, otp: null});
});

router.post('/otpTimer', function(req, res) {
  const enteredOTP = req.body.otp;
  const otp = '123456'; // hardcoded OTP, replace with your own OTP generation logic

  if (enteredOTP === otp) {
    // Redirect to the new password page
    res.redirect('/newPassword');
  } else {
    // Render the OTP Timer page with error message
    res.render('otpimer', {otpError: true, otpExpired: false, otp: otp});
  }
});

module.exports = router;

const express = require('express')
const User = require('../models/user')
const unauth = require('../middlewares/unauth')

const router = new express.Router()

router.get('/login', unauth, (req, res) => {
    res.render('login', {type: "user", error: req.query.error})
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.redirect('/')
    } 
    catch (e) {
        res.redirect('/login?error=1')
    }
    
})
// //Editor naveen

// // Render forgot password form
// router.get('/forgot-password', unauth, (req, res) => {
//   res.render('forgot-password', { error: req.query.error });
// });

// // Handle forgot password form submission
// router.post('/forgot-password', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       throw new Error('No user with that email address exists');
//     }

//     // Generate a password reset token and save it to the user's record in the database
//     const resetToken = await user.generatePasswordResetToken();
//     await user.save();

//     // Send an email to the user with the password reset link
//     const resetLink = `http://${req.headers.host}/reset-password/${resetToken}`;
//     // Implement your own email sending functionality here
//     console.log(`Password reset link: ${resetLink}`);

//     // Redirect the user to a confirmation page
//     res.redirect('/forgot-password/confirmation');
//   } catch (e) {
//     res.redirect('/forgot-password?error=' + encodeURIComponent(e.message));
//   }
// });

// // Render password reset form
// router.get('/reset-password/:token', unauth, async (req, res) => {
//   try {
//     const user = await User.findOne({ passwordResetToken: req.params.token });

//     if (!user) {
//       throw new Error('Invalid password reset token');
//     }

//     res.render('reset-password', { token: req.params.token, error: req.query.error });
//   } catch (e) {
//     res.redirect('/forgot-password?error=' + encodeURIComponent(e.message));
//   }
// });

// // Handle password reset form submission
// router.post('/reset-password/:token', async (req, res) => {
//   try {
//     const user = await User.findOne({ passwordResetToken: req.params.token });

//     if (!user) {
//       throw new Error('Invalid password reset token');
//     }

//     // Set the new password for the user
//     user.password = req.body.password;

//     // Clear the password reset token
//     user.passwordResetToken = undefined;

//     // Save the updated user record to the database
//     await user.save();

//     // Redirect the user to the login page
//     res.redirect('/login');
//   } catch (e) {
//     res.redirect('/reset-password/' + req.params.token + '?error=' + encodeURIComponent(e.message));
//   }
// });

// module.exports = router;


module.exports = router;
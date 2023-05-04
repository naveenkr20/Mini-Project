require('./db/mongoose')
const express = require("express")
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')
const cron = require('node-cron')
const User = require('./models/user')
const Leave = require('./models/leave')
const homeRouter = require('./routers/home')
const registerRouter = require('./routers/register')
const loginRouter = require('./routers/login')
const midadminLoginRouter = require('./routers/midadminLogin')
const midadminRouter = require('./routers/midadmin')
const adminLoginRouter = require('./routers/adminLogin')
const logoutRouter = require('./routers/logout')
const userRouter = require('./routers/user')
const leaveFormRouter = require('./routers/leaveForm')
const adminRouter = require('./routers/admin')
const forgotPasswordRouter = require('./routers/forgotPassword')
const otpTimerRouter = require('./routers/otpTimer')

const app = express()
app.set('view engine', 'ejs')

//views folder
app.set('views', path.join(__dirname, '../templates/views'))

//public folder
app.use(express.static(path.join(__dirname, '../public')))

//cookie parser
app.use(cookieParser())

app.get('/profile', function(req, res) {
    res.render('profile');
  });

//body parser
app.use(express.urlencoded({ extended: false }))

app.use(homeRouter)
app.use(registerRouter)
app.use(loginRouter)
app.use(adminLoginRouter)
app.use(logoutRouter)
app.use(userRouter)
app.use(leaveFormRouter)
app.use(midadminLoginRouter)
app.use(midadminRouter)
app.use(adminRouter)
app.use(forgotPasswordRouter)
app.use(otpTimerRouter)

app.get('/delete/:id',async(req,res)=>{

    const {id}=req.params
   // console.log(id);
    const deletedUser=await User.deleteOne({_id:id})
    const users=await User.find({});


   res.redirect("/admin")
    
})


// Scheduled tasks
cron.schedule('1 0 0 * * *', async () => {
    var currentTimestamp = new Date().getTime()
    currentTimestamp += (330 * 60 * 1000)
    const today = new Date(currentTimestamp)

    const users = await User.find({})

    for (var user of users) {

        const leaves = await Leave.find({userID: user._id, status: 'approved', startTime: {$lte: today}, endTime: {$gte: today}})
        if (leaves.length > 0) {
            user.isOnLeave = true
        }
        else {
            user.isOnLeave = false
        }
        
        await user.save()
    }

    const allLeaves = await Leave.find({status: {$in: ['recommended', 'pending']}, startTime: {$lte: today}})
    for (var leave of allLeaves) {

        leave.status = 'rejected'
        await leave.save()
    }

}, {
    scheduled: true
    // timezone: "Asia/Kolkata"
})

app.listen(process.env.PORT, () => {
    console.log('Server is up!~')
})
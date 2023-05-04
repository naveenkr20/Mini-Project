const express = require('express');
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define the team members data
const teamMembers = [
  {
    name: 'John Doe',
    position: 'CEO',
    email: 'john@example.com',
    phone: '123-456-7890',
    avatar: '/images/john-doe.jpg'
  },
  {
    name: 'Jane Smith',
    position: 'CTO',
    email: 'jane@example.com',
    phone: '123-456-7890',
    avatar: '/images/jane-smith.jpg'
  },
  {
    name: 'Bob Johnson',
    position: 'CFO',
    email: 'bob@example.com',
    phone: '123-456-7890',
    avatar: '/images/bob-johnson.jpg'
  },
  {
    name: 'Mary Davis',
    position: 'COO',
    email: 'mary@example.com',
    phone: '123-456-7890',
    avatar: '/images/mary-davis.jpg'
  }
];

// Define a route for the team members profile page
app.get('/team-members', function(req, res) {
  res.render('team-members', { teamMembers: teamMembers });
});

// Define a route for the profile page
 


// Start the server
app.listen(3000, function() {
  console.log('Server started on port 3000');
});


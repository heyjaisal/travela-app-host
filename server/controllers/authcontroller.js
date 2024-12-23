exports.googleAuth = (req, res) => {
    res.redirect('/api/auth/google');
  };
  
  exports.googleAuthCallback = (req, res) => {
    res.redirect('http://localhost:5173/dashboard');
  };
  
  exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).send('Logout Failed');
      res.send('Logged out successfully');
    });
  };
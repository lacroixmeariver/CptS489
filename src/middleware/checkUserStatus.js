// middleware that runs every request to verify a user is not banned or suspended 
function checkUserStatus(req, res, next) {
    if (!req.user) return next(); // no user logged in yet
    
    if (req.user.Status === '1') {
        return req.logout((err) => {
            if (err) return next(err);
            res.redirect('/login?reason=banned');
        })
    }

    // TODO: Make route + view for this page - if we want partial view
    // if (req.user.Status === '2') { // suspended
    //     return req.logout((err) => {
    //         if (err) return next(err);
    //         res.redirect('/suspended-view');
    //     })
    // }

    next();
}

module.exports = { checkUserStatus }
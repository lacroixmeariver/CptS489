// middleware for verifying a vendor's status (therefore ability to sell food)
function checkVendorStatus(req, res, next){
    if(!req.user) return next(); 
    if (req.user.Verified === 'Pending' || req.user.Verified === 'Rejected') {
        return req.logout((err) => {
            if (err) return next(err);
            //res.redirect('/');
            // TODO: Partial vendors page 
        })
    }
    next();
}
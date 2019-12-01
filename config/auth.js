module.exports = {
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }

        res.send('Not autherized to see this page.')
    }
}
export const SelfGuard = (req, res, next) => {
    try {
        const user = req?.user;
        console.log(user);
        
        if(user || user?.role == 'superAdmin' || user?.id == req.params?.id) {
            next();
        } else {
            return res.status(403).json({
                statusCode: 403,
                message: 'Forbidder user'
            })
        }
    } catch (e) {
        catchError(e, res)
    }
}
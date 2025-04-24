import jwt from 'jsonwebtoken'
import { catchError } from '../utils/error-response.js'

export const JwtAuthGuard = (req, res, next) => {
    try {
        const auth = req.headers?.authorization;

        
        
        if(!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({
                statusCode: 401,
                message: "Authorization error"
            });
        }
        console.log(1111);

        const token = auth.split(' ')[1];
        if(!token) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Token not found'
            })
        }

        const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        if(!decodedData) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Token expire'
            });
        }

        req.user = decodedData;
        next();
    } catch (e) {
        catchError(e, res)
    }
}
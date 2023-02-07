import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const auth = async(req,res,next) => {
    console.log("Passed auth.");
    // const headers = req.headers
    const token = req.cookies.token 
    // console.log(req.cookies)

    // const authHeader = req.headers.authorization
    // console.log(headers);//all headers
    // console.log(authHeader); //barear token from postman or frontend
    // if(!authHeader || !authHeader.startsWith('Bearer')){
    //     throw new UnAuthenticatedError('authentication invalid.')
    // }
    // const token = authHeader.split(' ')[1];

    if(!token){
        throw new UnAuthenticatedError('authentication invalid.')
    }

    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        // console.log(payload);
        // req.user = payload
        req.user = {userId: payload.userId}
        next()
    } catch (error) {
        throw new UnAuthenticatedError('authentication invalid.')
    }
}

export default auth

const attachCookie = ({res, token }) => {

    const oneDay = 1000 *60*60*24
    
    res.cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV
    })//ONCE cookies expire the cookie will finish jwt will not be located over there 

}

export default attachCookie
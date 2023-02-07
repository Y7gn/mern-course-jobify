const notFoundMiddleware = (req,res) => res.status(404).send("Rotue doesn't exist")

export default notFoundMiddleware;
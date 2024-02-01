module.exports = theFunc => (req, res, next) => {
  //try and catch
    Promise.resolve(theFunc(req, res, next)).catch(next)
}
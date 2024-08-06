// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    if (err.status === 404) {
      res.status(404).render("404", { error: "Page not found" });
    } else {
      res.status(500).render("error", { error: err.message || "Something went wrong" });
    }
  }
  
  module.exports = errorHandler;
  
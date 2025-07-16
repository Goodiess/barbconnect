const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

module.exports = upload;
// This middleware uses Multer with Cloudinary storage to handle file uploads.
// It configures Multer to use Cloudinary for storing uploaded files, allowing for image uploads in routes.
// The `upload` middleware can be used in routes to handle file uploads, such as when creating or updating a barbershop with an image.
// To use this middleware, you can import it in your route files and apply it to the desired routes, like so:
// const upload = require('../middleware/uploadMiddleware');
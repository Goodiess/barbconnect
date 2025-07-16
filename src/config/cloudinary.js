const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'barbconnect',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

module.exports = {
  cloudinary,
  storage
};
// This code configures Cloudinary for image uploads in a Node.js application.
// It sets up the Cloudinary client with credentials from environment variables and defines a storage configuration for Multer, specifying the folder and allowed image formats.
// The `cloudinary` object can be used to upload images, while the `storage` object can be used with Multer to handle file uploads in Express routes.
// The `cloudinary` and `storage` objects are exported for use in other parts of the application, such as in routes or controllers where image uploads are handled.
// Make sure to install the necessary packages: `cloudinary`, `multer`, and `
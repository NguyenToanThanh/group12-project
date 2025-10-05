const cloudinary = require("./utils/cloudinary");

cloudinary.api.ping((error, result) => {
  console.log(error || result);
});

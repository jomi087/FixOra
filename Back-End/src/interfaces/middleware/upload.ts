import multer from "multer";

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

export default upload;

/* Using .any() allows accepting multiple files from multiple fields:
e.g. image, subcategories[0][image], subcategories[1][image], etc. */
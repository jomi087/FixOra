export const validateFName = (fname:string):string|null => {
    const name = fname.trim();
    if (!name) return "Name required";
    if (name.length < 4) return "Name must have least 4+ charectors" ;
    return null ;
} ;

export const validateLName = (lname:string):string|null => {
    const name = lname.trim();
    if (!name) return "Name required" ;
    if (name.length < 2) return "Name must have at least 2+ charectors" ;
    return null ;
} ;

export const validateMobileNo= (phone:string):string|null => {
    phone = phone.trim();
    if (!phone) return "Phone required";
    if (!/^\d+$/.test(phone)) return "Only digits allowed";
    if (phone.length !== 10) return "Phone must be 10 digits";
    return null;
} ;

// export const validateImage = (image:string) => {
//     if (!image) return "Image required";
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//     if (!allowedTypes.includes(image.type)) return "Only JPG, PNG";
//     const maxSize = 5 * 1024 * 1024;
//     if (image.size > maxSize) return "Max 5MB size";
//     return null;
// };

export const validateEmail = (email:string):string|null => {
    email = email.trim();
    if (!email) return "Email field cannot be empty";
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!isEmailValid) return "Email is not valid";
    return null;
} ;

export const validatePassword = (password:string):string|null => {
    password = password.trim();
    if (!password) return "Password field cannot be empty";
    // const isPasswordValid = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    // if (!isPasswordValid) return "Password is not valid";
    if(password.length < 10)return "Password must be at least 10 characters"
    return null;
};

export const validateCPassword = (cPassword:string , password:string):string|null => {
    cPassword = cPassword.trim();
    if (!cPassword) return "Confirm Password required";
    if(cPassword != password) return "password didnt match"
    return null;
} ;



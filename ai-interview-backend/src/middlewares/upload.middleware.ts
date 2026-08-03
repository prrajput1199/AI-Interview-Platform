import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/"); // save files to upload folder
    },
    filename: (req,file,cb)=>{
        const uniqueSuffix = Date.now() + Math.round(Math.random()* 1E9);
        cb(null,file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req: any, file:any, cb: any)=>{
    if(file.mimetype === "application/pdf"){
        cb(null,true);
    }else{
        cb(new Error("Only PDF files are allowed"),false);
    }
}

export const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
})
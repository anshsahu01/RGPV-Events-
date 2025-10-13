// import ImageKit from 'imagekit'
// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs'


// const imageKit = new ImageKit({
//      publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
//     privateKey :process.env.IMAGE_KIT_PRIVATE_KEY,
//     urlEndpoint : process.env.IMAGE_KIT_ENDPOINT
// })


// export const uploadOnImageKit = async (localFilePath) => {
//     try {

//         if(!localFilePath){
//             return null;
//             console.log("No file path received");
//         }
//        const res = await imageKit.upload({
//     file: fs.readFileSync(localFilePath), 
//     fileName: `banner_${uuidv4()}.jpg`,   
//     folder: "/event_banners/"             
// });
        

//         fs.unlinkSync(localFilePath);

//         return res;
//     } catch (error) {

//         console.log("Image Kit upload Error", error);
//         return null;
        
//     }
// }



// for deployed code 
// Your ImageKit uploader utility file

import ImageKit from 'imagekit';
import { v4 as uuidv4 } from 'uuid';


const imageKit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT
});

// Update the function to accept a file buffer and original filename
export const uploadOnImageKit = async (fileBuffer, originalFileName) => {
    try {
        if (!fileBuffer) {
            console.log("No file buffer received");
            return null;
        }

        const res = await imageKit.upload({
            file: fileBuffer, // 👈 Pass the buffer directly here
            fileName: `${uuidv4()}_${originalFileName}`, // Create a unique filename
            folder: "/event_banners/"
        });
        
      
        return res;

    } catch (error) {
        console.log("Image Kit upload Error", error);
        return null;
    }
}
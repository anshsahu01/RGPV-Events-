import ImageKit from 'imagekit'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'


const imageKit = new ImageKit({
     publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey :process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGE_KIT_ENDPOINT
})


export const uploadOnImageKit = async (localFilePath) => {
    try {

        if(!localFilePath){
            return null;
            console.log("No file path received");
        }
       const res = await imageKit.upload({
    file: fs.readFileSync(localFilePath), 
    fileName: `banner_${uuidv4()}.jpg`,   
    folder: "/event_banners/"             
});
        

        fs.unlinkSync(localFilePath);

        return res;
    } catch (error) {

        console.log("Image Kit upload Error", error);
        return null;
        
    }
}
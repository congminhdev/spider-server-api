import prodConfig from "./prod.config";
import ciConfig from "./ci.config";
import devConfig from './dev.config';
//

export const env = process.env.NODE_ENV || "develop";
// 
const config = () => {
    console.log(`App is running with env: ${env}`);

    switch (env) {
        case "production":
            return prodConfig;
            
        case "ci":
            return ciConfig;

        default:
            return devConfig;
    }
};

export default config();

//Config send mail.
export const mail_config = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    emailTo: "jsteamdev@gmail.com",
    auth: {
        user: "jsteamdev@gmail.com",
        pass: "Abc@123456"
    }
};

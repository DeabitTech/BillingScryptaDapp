import {useState} from 'react';
import emailjs from 'emailjs-com';
import sign from '../libs/sign';


export const EmailControllerSendEVerify = () => {
    const [res,setRes] = useState()
    const [objResponse,setSign] = useState({success:{identity:"",fingerprint:"",gateway:""},status:0})  
    let low = 0
    let high = 9999999
    
    const sendEmail= () =>{
        localStorage.setItem("code",parseInt(Math.random() * (high - low) + low)) 
       
        emailjs.send('smtp_server', 'template_uH9dhDOz', {user_email:localStorage.getItem("email"),message:localStorage.getItem("code")}, 'user_Ym9WKlUqiSNAT5raiRoeC')
      .then((result) => {
        
          console.log(result.text);
      }, (error) => {
          
          console.log(error.text);
      });
    }

    const verify = async (codVerifica,prv) =>{
        
        if(codVerifica === localStorage.getItem("code")){
            let emailID = {
                method: 'email',
                username: localStorage.getItem("email"),
                created_at: Date.now()
            }

            await sign.signWithKey(prv, JSON.stringify(emailID)).then(signature => {
                    localStorage.setItem("sign",JSON.stringify({
                        success: {
                            identity: emailID,
                            fingerprint: signature.signature,
                            gateway: signature.pubKey
                        },
                        status: 200
                    })) 
                    /*setSign({
                        success: {
                            identity: emailID,
                            fingerprint: signature.signature,
                            gateway: signature.pubKey
                        },
                        status: 200
                    })*/
                })
        }
        return localStorage.getItem("sign");
    }

    const condizionalFunc = (condizione, codiceVerifica,prv)=>{
        switch(condizione){
            case "send":
                return sendEmail()
               
            case "verify":
                return verify(codiceVerifica,prv)
                
        }
    }
   
 return [res,setRes,condizionalFunc];
}



export default EmailControllerSendEVerify;


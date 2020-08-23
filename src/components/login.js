import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import EmailControllerSendEVerify from './emailController';
import {Typography,Button, makeStyles, Collapse,Dialog,DialogTitle,TextField, IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import ScryptaCore from '@scrypta/core';
import ScryptaLogin from '@scrypta/login';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '90%',
        marginLeft: '5%'
        

    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: theme.typography.fontWeightRegular,
    },
    button: {
        margin: theme.spacing(1),
    },
    fieldCss: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
          }
    },
    input: {
        display: 'none',
    }
}));

const Login = ()=> {
    const classes = useStyles();
    const [openModal,setOpenModal] = useState(false);
    const [createWL,setCreateWL] = useState(false);
    const [retriveWL,setRetriveWL] = useState(false);
    const [showToast,setShow] = useState(false);
    const [verification,setverification] = useState(false);
    const [seeMail,setSeeMail] = useState(false);
    const [seeCode,setSeeCode] = useState(false);
    const [seeBillingSetup,setSeeBillingSetup] = useState(false);
    const [seeVerificationModule, setVerificationModule] = useState(false);
    const [messageToast,setMessageToast] = useState("");
    const [pass,setPass] = useState();
    const [prvKey,setprvKey] = useState();
    const [codiceVerifica,setCodiceVerifica] = useState();
    const [res,setRes,condizionalFunc] = EmailControllerSendEVerify();
    const scryptaCore = new ScryptaCore(true);
    const scryptaLogin = new ScryptaLogin(true);


    const handleClose = async () => {
        setOpenModal(false);
        if(pass !== undefined){
            await getKeyWallet(pass); 
            await login()
        }
        
    }
    const handleOpen = () => {
        setOpenModal(true)
        setCreateWL(true)
    }

    const createWallet = async () =>{  
        let wallet;
        scryptaCore.testnet = false;
        if (pass !== undefined) {
            console.log("ma entro??")
            wallet = await scryptaCore.createAddress(pass)
            console.log(wallet)
            localStorage.setItem("SID", wallet.walletstore)
            let data = new Blob([wallet.walletstore], {type: 'text/plain'});
            let file = window.URL.createObjectURL(data);
            let tempLink = document.createElement('a');
            tempLink.href = file;
            tempLink.setAttribute('download',wallet.pub+'.sid');
            tempLink.click();
            await getKeyWallet(pass); 
            await login()
            setOpenModal(false)   
        }    
    }

    const login = async () =>{
        scryptaLogin.scrypta.staticnodes=true;
        let listen = await scryptaLogin.listen((connected)=>{console.log("Callback::: ", connected)})
        console.log(listen)
        let login = await scryptaLogin.login(listen.address,localStorage.getItem("SID"), pass )
        setMessageToast("Login effettuato con successo!")
        setShow(true)
        setVerificationModule(true)
        setSeeMail(true)
      
        
    }
    
    const getKeyWallet = async (pswd) =>{
        let sid = localStorage.getItem("SID");
        let wallet = await scryptaCore.readKey(pswd, sid);
        setprvKey(wallet.prv);
        let pub = await scryptaCore.getPublicKey(wallet.prv);
        let address = await scryptaCore.getAddressFromPubKey(pub);
       
    }

    const setVerify = async () =>{
        const respo = await condizionalFunc("verify",codiceVerifica,prvKey);
        let signWithKey = JSON.parse(respo);
        let messageSign = {identity:signWithKey.success.identity,fingerprint:signWithKey.success.fingerprint };
        let signed = await scryptaCore.signMessage(prvKey,JSON.stringify(messageSign));
        console.log(signed)
        let msgWritingOnBlockchain = {signature:signed.signature,gateway:signWithKey.success.gateway,fingerprint:signWithKey.success.fingerprint}
        let msgWrited = await scryptaCore.write(localStorage.getItem("SID"),pass,JSON.stringify(msgWritingOnBlockchain),'',"email".toUpperCase(),'I://')
        console.log( msgWrited)
        localStorage.setItem("uuid", msgWrited.uuid)
        setMessageToast("Verifica effettuata con successo!")
        setShow(true)
        setVerificationModule(false)
        setSeeBillingSetup(true)
        
    }

    const send = () =>{
        condizionalFunc("send");
        setSeeMail(false)
        setSeeCode(true)
    }

    const verifyCode = event =>{
        setCodiceVerifica(event.target.value);
    }

    const passinput = event =>{
        setPass(event.target.value);    
    }

    const email = event =>{
        localStorage.setItem("email", event.target.value)
    }

    const setSid = event =>{
        let file = event.target.files[0]
        let read = new FileReader();
        read.readAsText(file)
        read.onload = () =>{localStorage.setItem("SID",read.result)}
        setRetriveWL(true)
        setOpenModal(true)
        
    }

    return(
        
        <div style={{marginTop:'30px', textAlign:'center'}}>
        <Collapse in={showToast}>
            <Alert variant="filled" severity="success" action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={() => {setShow(false);}}><CloseIcon fontSize="inherit" /></IconButton>}> 
                {messageToast}
            </Alert>
        </Collapse>
        <Typography color="textSecondary" variant="h2">Bevenuto nella billing factory targata DeaBit</Typography>
        <div style={{marginTop:'60px', textAlign:'center'}}>
        <input accept="text" className={classes.input} id="contained-button-file" multiple type="file" onChange={setSid}/>
            <label htmlFor="contained-button-file">
                <Button variant="contained" style={{color:'green'}} component="span">
                    Upload SID
                </Button>
            </label>
            <Typography color="textSecondary" variant="h6">Oppure</Typography>
            <Button  color="primary" variant="contained" onClick={handleOpen}>Crea il tuo wallet</Button>
            </div>
            <Collapse in={verification}>
                <Button  color="primary" variant="contained" onClick={send}>Crea il tuo wallet</Button>
                <Button  color="primary" variant="contained" onClick={setVerify}>Crea il tuo wallet</Button>
                </Collapse>
                <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={openModal}>
                    <DialogTitle id="simple-dialog-title">Inserisci la password</DialogTitle>
                    <div style={{marginBottom:'20px', textAlign:'center'}}>
                        <TextField onChange={passinput} id="outlined-password-input" label="Password" type="password" autoComplete="current-password" variant="outlined" />
                        </div>
                        <Collapse in={createWL}>
                            <div style={{marginBottom:'20px', textAlign:'center'}}>
                                <Button  color="primary" variant="contained" onClick={createWallet}>Avanti</Button>
                                </div>
                                </Collapse>
                                <Collapse in={retriveWL}>
                                    <div style={{marginBottom:'20px', textAlign:'center'}}>
                                        <Button  color="primary" variant="contained" onClick={handleClose}>Avanti</Button>
                                        </div>
                                        </Collapse>
                                        </Dialog>
                                        <div style={{marginTop:'80px', textAlign:'center'}}>
                                        <Collapse in={seeVerificationModule}>
                                            <Typography color="textPrimary" variant="h6">Avvia la procedura di verifica della tua identità</Typography>
                                            <Collapse in={seeMail}>
                                                <Typography color="textSecondary" variant="h6" >Email</Typography>
                                                <TextField id="email" type="text" onChange={email} name="email" variant="outlined"/>
                                                <div>
                                                <Button color="secondary" variant="outlined" onClick={send}>Invia Mail</Button>
                                                </div>
                                            </Collapse>
                                            <Collapse in={seeCode}>
                                                <Typography color="textSecondary" variant="h6">Codice di Verifica</Typography>
                                                <TextField id="verify" type="text" onChange={verifyCode} name="codice verifica" variant="outlined"/>
                                                <div>
                                                    
                                                    <Button color="secondary" variant="outlined" onClick={setVerify}>Verifica Codice</Button>
                                                    
                                                </div>
                                            </Collapse>
                                                
                                        </Collapse>
                                        </div>
                                        <Collapse in={seeBillingSetup}>
                                        <Link to="/billingSetup">
                                            <Button color="secondary" variant="contained">Prosegui con la fatturazione</Button>
                                        </Link>
                                        </Collapse>
                                        <Typography variant="h6" >Powered by <a href="https://scrypta.foundation/">Scrypta Foundation</a></Typography>
                                                </div>

    );

}

export default Login;

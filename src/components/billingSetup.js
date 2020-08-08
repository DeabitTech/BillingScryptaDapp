import React, {useState, useEffect} from 'react';
import { Typography, Paper,makeStyles, TextField, Button,InputLabel,Select,MenuItem, FormControl,DialogTitle,Dialog } from '@material-ui/core';
import html2pdf from 'html2pdf.js';
import ScryptaCore from '@scrypta/core';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      
      '& > *': {
        margin: theme.spacing(1),
        width: theme.spacing(200),
        height: '100%',
      },
    },
    field:{
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
            align:'center'
          },
    },
    picklist:{
        margin: theme.spacing(1),
        width: '25ch',
    }
  }));

const BillingSetup = ()=> {
    const scryptaCore = new ScryptaCore(true);
    const classes = useStyles();
    const [pswd,setPaswd] = useState();
    const [openModal,setOpenModal] = useState(false)
    const [disableFieldsAccount,setDisableFieldsAccount] = useState(false)
    const [disableFieldsProd,setDisableFieldsProd] = useState(false)
    const [disableFieldsOpt,setDisableFieldsOpt] = useState(false)
    const [disableFieldsPag,setDisableFieldspag] = useState(false)
    const [valueBilling,setValueBilling] = useState({quantita:"",ragSociale:"",pIVA:"",sede:"",nomeAmm:"",nomeProd:"",valore:"",IVA:"",desc:"",datiSAL:"",IBAN:"",intA:""})
    const [valueBillingOpt,setValueBillingOpt] = useState({esigi:"",cassa:"",metodo:"",condizione:""})

    const getValueBilling = event =>{
        let value = event.target.value
        
        if(value.includes("Esigibilità")){
            setValueBillingOpt({...valueBillingOpt,esigi:value})
        }
        if(value.includes("Cassa")){
            setValueBillingOpt({...valueBillingOpt,cassa:value})
        }   
        if(value.includes("Scissione")){
            setValueBillingOpt({...valueBillingOpt,esigi:value})
        } 
        if(value.includes("Bonifico")){
            setValueBillingOpt({...valueBillingOpt,metodo:value})
        }
        if(value.includes("Carta")){
            setValueBillingOpt({...valueBillingOpt,metodo:value})
        }
        if(value.includes("Assegno")){
            setValueBillingOpt({...valueBillingOpt,metodo:value})
        }
        if(value.includes("Anticipo")){
            setValueBillingOpt({...valueBillingOpt,condizione:value})
        }
        if(value.includes("Completo")){
            setValueBillingOpt({...valueBillingOpt,condizione:value})
        }
        if(value.includes("Rate")){
            setValueBillingOpt({...valueBillingOpt,condizione:value})
        }
        else{
            setValueBilling({...valueBilling,[event.target.id]:value})
        }
       
    }

    const passinput = event =>{
        setPaswd(event.target.valore)
    }

    const handleClose = () =>{
        setOpenModal(false)
    }
    const handleOpen = () =>{
        console.log(localStorage.getItem("SID"))
        setOpenModal(true)
    }

    const getWallet = async () =>{
        let sid = localStorage.getItem("SID")
        let WL = await scryptaCore.readKey(pswd,sid)
        return WL.prv;
    }

    const sendBilling = async () =>{
        let totalBillingValues = {...valueBilling, ...valueBillingOpt}
        let prv = await getWallet()
        let cryptData = await scryptaCore.cryptData(JSON.stringify(totalBillingValues),prv)
        console.log(cryptData)
        setOpenModal(false)
        await printBilling(cryptData)
    }

    const printBilling = async (cryptData) =>{
        setDisableFieldsAccount(true)
        setDisableFieldsOpt(true)
        setDisableFieldsProd(true)
        setDisableFieldspag(true)    
        document.getElementById("invFattura").style.visibility="hidden";
        let fattura = document.getElementById("fattura")
        html2pdf(fattura)
        let data = new Blob([cryptData], {type: 'text/plain'});
        let csvURL = window.URL.createObjectURL(data);
        let tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', localStorage.getItem("uuid")+'.txt');
        tempLink.click();
        
    } 
    return(
        <div style={{textAlign:'center', marginTop:'30px'}} >
            <Typography variant="h3" color="textSecondary">Compila i campi per inviare la fattura!</Typography>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={openModal}>
                    <DialogTitle id="simple-dialog-title">Inserisci la password</DialogTitle>
                    <div style={{marginBottom:'20px', textAlign:'center'}}>
                        <TextField onChange={passinput} id="outlined-password-input" label="Password" type="password" autoComplete="current-password" variant="outlined" />
                        </div>
                        <div style={{marginBottom:'20px', textAlign:'center'}}>
                            <Button  color="primary" variant="contained" onClick={sendBilling}>Avanti</Button>
                            </div>
                        </Dialog>
                        
            <div className={classes.root} id="fattura" >
                <Paper elevation={3} >
                    <form className={classes.field} style={{marginTop:'25px'}} onChange={getValueBilling}>
                        <div>
                            <Typography color="textSecondary" variant="h6">Inserisci Dati Cliente</Typography>
                            <TextField  id="ragSociale" disabled={disableFieldsAccount} type="text" label="Ragione Sociale" variant="outlined"/>
                            <TextField  id="pIVA" disabled={disableFieldsAccount} type="text" label="Partita IVA" variant="outlined"/>
                            <TextField   id="sede"disabled={disableFieldsAccount} type="text" label="Sede Amministrativa" variant="outlined"/>
                            <TextField   id="nomeAmm" disabled={disableFieldsAccount} type="text" label="Nome Amministratore" variant="outlined"/>
                             </div>
                        <div style={{marginTop:'25px'}}>
                            <Typography color="textSecondary" variant="h6">Inserisci Dati Prodotto o Servizio</Typography>
                            <TextField id="nomeProd" disabled={disableFieldsProd} type="text" label="Nome Prodotto o Servizio" variant="outlined"/>
                            <TextField  id="valore"disabled={disableFieldsProd} type="text" label="Valore" variant="outlined"/>
                            <TextField  id="IVA" disabled={disableFieldsProd} type="text" label="IVA" variant="outlined"/>
                            <TextField  id="desc" disabled={disableFieldsProd} type="text" label="Descrizione" variant="outlined"/>
                            <TextField  id="quantita" disabled={disableFieldsProd} type="text" label="Quantità" variant="outlined"/>
                             </div>
                        <div style={{marginTop:'25px'}}>
                            <Typography color="textSecondary" variant="h6">Opzioni Aggiuntive</Typography>
                            <br/>
                            <FormControl  disabled={disableFieldsOpt} variant="outlined" className={classes.picklist}>
                            <InputLabel>Esigibilità IVA</InputLabel>
                            <Select onChange={getValueBilling}>
                                    <MenuItem value={"Esigibilità Immediata"}>Esigibilità Immediata</MenuItem>
                                    <MenuItem value={"Esigibilità Differita"}>Esigibilità Differita</MenuItem>
                                    <MenuItem value={"Scissione dei pagamenti"}>Scissione dei pagamenti</MenuItem>
                                    </Select>
                                    </FormControl>
                                    
                                    <FormControl  disabled={disableFieldsOpt} variant="outlined" className={classes.picklist}>
                                        <InputLabel >Cassa Prev.</InputLabel>
                                        <Select  onChange={getValueBilling} >
                                            <MenuItem value={"Cassa Prev Edile"}>Cassa Prev Edile</MenuItem>
                                            <MenuItem value={"Cassa Prev Commercialista"}>Cassa Prev Commercialista</MenuItem>
                                            <MenuItem value={"Cassa Prev Medica"}>Cassa Prev Medica</MenuItem>
                                            </Select>
                                    </FormControl>
                                    
                                    <TextField  id="datiSAL" disabled={disableFieldsOpt} type="text" label="Dati SAL" variant="outlined"/> 
                                    
                        </div>
                        <div style={{marginTop:'25px'}}>
                            <Typography color="textSecondary" variant="h6">Inserisci dati per il pagamento</Typography>
                            <br/>
                            <FormControl  disabled={disableFieldsPag} variant="outlined" className={classes.picklist}>
                                        <InputLabel>Metodo</InputLabel>
                                        <Select onChange={getValueBilling}>
                                            <MenuItem value={"Bonifico"}>Bonifico</MenuItem>
                                            <MenuItem value={"Carta di credito"}>Carta di credito</MenuItem>
                                            <MenuItem value={"Assegno circolare"}>Assegno circolare</MenuItem>
                                            </Select>
                                    </FormControl>
                                    <FormControl  disabled={disableFieldsPag} variant="outlined" className={classes.picklist}>
                                        <InputLabel>Condizione</InputLabel>
                                        <Select onChange={getValueBilling} >
                                            <MenuItem value={"Anticipo"}>Anticipo</MenuItem>
                                            <MenuItem value={"Completo"}>Completo</MenuItem>
                                            <MenuItem value={"Rate"}>Rata</MenuItem>
                                            </Select>
                                    </FormControl>
                                    <TextField  id="IBAN" disabled={disableFieldsPag} type="text" label="IBAN" variant="outlined"/>
                                    <TextField   id="intA" disabled={disableFieldsPag} type="text" label="Intestato a" variant="outlined"/>

                                    </div>
                                    <div style={{marginTop:'30px'}}>
                                    <Button onClick={handleOpen} id="invFattura" color="secondary" variant="contained">Invia Fattura</Button>
                                    </div>
                    </form>                            
                </Paper>
            </div>
        </div>
    )

}

export default BillingSetup;
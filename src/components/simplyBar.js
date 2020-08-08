import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar,Toolbar,Typography,IconButton,Menu,MenuItem} from '@material-ui/core/';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Tooltip from "@material-ui/core/Tooltip";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));





const SimplyBar = () => {
     const classes = useStyles();
     const [anchorEl, setAnchorEl] = useState(null);
     const [uuid,setUuid] = useState();
     const open = Boolean(anchorEl);
     

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleConnect = () =>{
        setUuid(localStorage.getItem("uuid"))
        setAnchorEl(false)
    }

    

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <img style={{width:140}} src="https://deabit.net/wp-content/uploads/2020/03/logoDeaBit-e1585610189252.png"/>
                    <Typography variant="h6" className={classes.title}>
                        Billing Factory
                    </Typography>
                    <Typography variant="subtitle1" >
                       {uuid}
                    </Typography>

                    { (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Tooltip title="Visualizza il tuo ScryptaID " interactive>
                                <AccountCircle />
                                </Tooltip>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleConnect}
                            >
                                <MenuItem onClick={handleConnect}>Visualizza il tuo ScryptaID</MenuItem>

                            </Menu>

                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
export default SimplyBar;
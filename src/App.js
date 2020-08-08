import React, {useState, useEffect} from 'react';
import {Route} from 'react-router-dom';
import SimplyBar from './components/simplyBar';
import Login from './components/login';
import BillingSetup from './components/billingSetup';

const App = ()=> {
  
  useEffect(()=>{
    localStorage.clear()
  },[])

  
 
  return (
    <div >
      <div id="bar">
      <SimplyBar/>
      </div>
      <Route exact path="/" render={()=>(
        <div>
        
        <Login/>
        </div>  
      )}/>
      
      <Route path="/billingSetup" render={()=>(
        <div>
           <BillingSetup/> 
        </div>
      )}/>
     
    </div>
  );
}

export default App;

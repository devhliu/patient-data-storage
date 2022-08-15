import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import Register from './Auth/Register';
import Login from './Auth/Login';
import Home from './Home/Home';
import CreateNewPatient from './Data/CreateNewPatient';
import Patient from './Data/Patient';
import EditPatient from './Data/EditPatient';
import CreateSession from './Data/CreateSession';
import Session from './Data/Session';
import EditSession from './Data/EditSession';

import './Styles/main.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/home" element={<Home />}></Route>
        <Route exact path="/create_new_patient" element={<CreateNewPatient />}></Route>
        <Route exact path="/patient/:id" element={<Patient />}></Route>
        <Route exact path="/edit_patient/:id" element={<EditPatient />}></Route>
        <Route exact path="/create_session/:id" element={<CreateSession />}></Route>
        <Route exact path="/patient/:patientId/session/:id" element={<Session />}></Route>
        <Route exact path="/patient/:patientId/edit_session/:id" element={<EditSession />}></Route>
      </Routes>
    </Router>
  )
}

export default App;
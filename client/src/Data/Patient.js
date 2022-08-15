import React from 'react';
import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {isMobile} from 'react-device-detect';

import useIsLogged from '../Hooks/useIsLogged';
import BeatLoader from 'react-spinners/BeatLoader';
import {createTheme,ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';

const theme = createTheme();

function Patient() {
    useEffect(() => {
        document.title = 'Paciente';
    },[])
    useIsLogged();
    const id = useParams().id;
    const [patient,setPatient] = useState(null);
    const [birthDate,setBirthDate] = useState(null);
    const [sessions,setSessions] = useState(null);
    const [loading,setLoading] = useState(true);
    const [displayPersonalInfo,setDisplayPersonalInfo] = useState('');
    const [edit,setEdit] = useState(false);
    const [addSession,setAddSession] = useState(false);
    const [showSessions,setShowSessions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/search_patient', {
            method: 'POST',
            body: JSON.stringify({id: id}),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })
        .then(response => response.json())
        .then(data => {
            if (data.patient !== null) {
                setPatient(data.patient);
                setBirthDate(new Date(data.patient.birth_date));
            }
        })
    },[id])

    useEffect(() => {
        if (patient !== null) {
            fetch('/api/search_session', {
                method: 'POST',
                body: JSON.stringify({id: patient.id}),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.length !== undefined) {
                    setSessions(data);
                }
                setLoading(false);
            })
        }
    },[patient])

    useEffect(() => {
        if (edit) {
            return navigate(`/edit_patient/${patient.id}`)
        }
    },[patient,edit,navigate])

    useEffect(() => {
        if (addSession) {
            return navigate(`/create_session/${patient.id}`)
        }
    },[patient,addSession,navigate])

    return (
        <>
        {loading === true ? (
            <div className="loading">
                <BeatLoader size={25} color="#000000" style={{margin: "0 auto"}} loading={loading} />
            </div>
        ) : (
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <CssBaseline />
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
                        <Typography variant="h1" noWrap={isMobile === true ? false : true}  sx={{fontSize: "50px", marginTop: "20px", marginBottom: "50px"}}>{patient.name}</Typography>
                        <Typography variant="p">Data de aniversário: {birthDate !== null ? `${birthDate.getDate()}/${birthDate.getMonth() < 10 ? '0' + (birthDate.getMonth()+1).toString() : birthDate.getMonth()+1}/${birthDate.getFullYear()}` : 'Não definido'}</Typography>
                        <Typography variant="p">Idade: {patient.age !== '' ? patient.age : 'Não definido'}</Typography>
                        <Typography variant="p">Gênero: {patient.gender !== '' ? patient.gender : 'Não definido'}</Typography>
                        <Typography variant="p">Informações adicionais: {patient.additional_info !== '' ? patient.additional_info : 'Não definido'}</Typography>
                        <InputLabel sx={{marginTop: "25px"}}>Mostrar informações pessoais</InputLabel>
                        <Switch label="Mostrar informações pessoais" labelPlacement="top" onChange={(event) => setDisplayPersonalInfo(event.target.checked)} />
                        {displayPersonalInfo === true ? (
                            <>
                            <Typography variant="p">Endereço: {patient.address !== '' ? patient.address : 'Não definido'}</Typography>
                            <Typography variant="p">CPF: {patient.cpf !== '' ? patient.cpf : 'Não definido'}</Typography>
                            <Typography variant="p">Filiação: {patient.filiation !== '' ? patient.filiation : 'Não definido'}</Typography>
                            <Typography variant="p">{patient.is_worker === true ? 'Trabalho': 'Escola'}: {patient.ocupation_place ? patient.ocupation_place : 'Não definido'}</Typography>
                            </>
                        ) : ''}
                        <Button variant="contained" sx={{marginTop: "50px"}} onClick={() => setEdit(true)}>Editar informações</Button>
                        <Button variant="contained" onClick={() => setAddSession(true)}>Adicionar sessão</Button>
                        {sessions === null ? '' : (
                            <>
                            <Typography variant="h2" sx={{marginTop: "40px"}}>Sessões</Typography>
                            <List sx={{width: '100%', maxWidth: 360, bgcolor: '#181818'}}>
                                <ListItemButton onClick={() => setShowSessions(!showSessions)}>
                                    <ListItemText sx={{color: "white"}}>Mostrar sessões</ListItemText>
                                    {showSessions ? <ExpandLess sx={{color: "white"}} /> : <ExpandMore sx={{color: "white"}} />}
                                </ListItemButton>
                                <Collapse in={showSessions} timeout="auto" unmountOnExit>
                                    <List component="div">
                                    {sessions.map((session,index) => {
                                    const date = new Date(session.date);

                                    return (
                                        <ListItem key={index}>
                                            <Link href={`/patient/${patient.id}/session/${session.id}`} sx={{color: "white", textDecorationColor: "white"}}>
                                            <ListItemText primary={`${date.getDate()}/${date.getMonth() < 10 ? '0' + (date.getMonth()+1).toString() : date.getMonth()+1}/${date.getFullYear()}`} />
                                            </Link>
                                        </ListItem>
                                        )
                                    })}
                                    </List>
                                </Collapse>
                            </List>
                            </>
                        )}
                        <Link href="/home" sx={{marginBottom: "20px"}}>Voltar ao início</Link>
                    </Box>
                </Container>
            </ThemeProvider>
        )}
        </>
    )
}

export default Patient;
import React from 'react';
import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {isMobile} from 'react-device-detect';

import useIsLogged from '../Hooks/useIsLogged';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme,ThemeProvider} from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ptBR from 'date-fns/locale/pt-BR';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';

const theme = createTheme();

function CreateSession() {
    useEffect(() => {
        document.title = 'Criar sessão';
    },[])
    useIsLogged();
    const id = useParams().id;
    const [date,setDate] = useState(null);
    const [notes,setNotes] = useState('');
    const [diagnosis,setDiagnosis] = useState('');
    const [logoBrand,setLogoBrand] = useState(null);
    const [created,setCreated] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/save_session', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                date: date,
                notes: notes,
                diagnosis: diagnosis
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })
        .then(response => response.json())
        .then(() => setCreated(true))
    }

    useEffect(() => {
        fetch('/api/image_check')
        .then(response => response.json())
        .then(image => setLogoBrand(image.image))
    },[navigate])

    useEffect(() => {
        if (created) {
            return navigate(`/patient/${id}`);
        }
    },[id,created,navigate])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main">
                <CssBaseline />
                <form onSubmit={handleSubmit}>
                    <Box sx={{display: 'flex',alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', gap: "20px", flexDirection: 'column', marginTop: '30px'}}>
                        <Typography variant="h1" fontSize="50px" noWrap={isMobile === true ? false : true}>Criar Sessão</Typography>
                        {logoBrand === null ? '' : (
                            <Box component="img" alt="Logo brand" src="/api/show_image" sx={{width: '200px', height: '200px', borderRadius: "100px", objectFit: 'cover', margin: '0 auto'}} />
                        )}
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DesktopDatePicker label="Data da sessão" inputFormat="dd/MM/yyyy" openTo="day" value={date} onChange={(newValue) => setDate(newValue)} renderInput={(params) => <TextField {...params} />} />
                        </LocalizationProvider>
                        <TextField required fullWidth multiline label="Anotações" onChange={(event) => setNotes(event.target.value)} value={notes}></TextField>
                        <TextField required fullWidth multiline label="Diagnóstico" onChange={(event) => setDiagnosis(event.target.value)} value={diagnosis}></TextField>
                        <Button type="submit" variant="contained">Salvar sessão</Button>
                        <Link href={`/patient/${id}`}>Voltar à página do paciente</Link>
                    </Box>
                </form>
            </Container>
        </ThemeProvider>
    )
}

export default CreateSession;
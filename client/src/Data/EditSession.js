import React from 'react';
import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {isMobile} from 'react-device-detect';

import useIsLogged from '../Hooks/useIsLogged';
import BeatLoader from 'react-spinners/BeatLoader';
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

function EditSession() {
    useEffect(() => {
        document.title = 'Editar sessão';
    },[])
    useIsLogged();
    const id = useParams().id;
    const patientId = useParams().patientId;
    const [date,setDate] = useState(null);
    const [notes,setNotes] = useState(null);
    const [diagnosis,setDiagnosis] = useState(null);
    const [logoBrand,setLogoBrand] = useState(null);
    const [edited,setEdited] = useState(false);
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/edit_session', {
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
        .then(() => setEdited(true))
    }

    useEffect(() => {
        fetch('/api/display_session', {
            method: 'POST',
            body: JSON.stringify({id: id}),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.session !== null) {
                console.log(data)
                setDate(new Date(data.session.date));
                setNotes(data.session.notes);
                setDiagnosis(data.session.diagnosis);
                setLoading(false);
            }
            else {
                return navigate('/home')
            }
        })
    },[id,navigate])

    useEffect(() => {
        fetch('/api/image_check')
        .then(response => response.json())
        .then(image => setLogoBrand(image.image))
    },[navigate])

    useEffect(() => {
        if (edited) {
            return navigate(`/patient/${patientId}`);
        }
    },[patientId,edited,navigate])

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
                        <Link href={`/patient/${patientId}`}>Voltar à página do paciente</Link>
                    </Box>
                </form>
            </Container>
        </ThemeProvider>
        )}
        </>
    )
}

export default EditSession;
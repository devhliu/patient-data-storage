import React from 'react';
import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';

import useIsLogged from '../Hooks/useIsLogged';
import BeatLoader from 'react-spinners/BeatLoader';
import {createTheme,ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const theme = createTheme();

function Session() {
    useEffect(() => {
        document.title = 'Sessão';
    },[])
    useIsLogged();
    const id = useParams().id;
    const patientId = useParams().patientId;
    const [date,setDate] = useState(null);
    const [notes,setNotes] = useState(null);
    const [diagnosis,setDiagnosis] = useState(null);
    const [logoBrand,setLogoBrand] = useState(null);
    const [loading,setLoading] = useState(true);
    const [edit,setEdit] = useState(false);
    const [erase,setErase] = useState(false);
    const navigate = useNavigate();

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
        if (edit) {
            return navigate(`/patient/${patientId}/edit_session/${id}`);
        }
        if (erase) {
            fetch('/api/erase_session', {
                method: 'POST',
                body: JSON.stringify({id: id}),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(() => {
                return navigate(`/patient/${patientId}`);
            })
        }
    },[id,patientId,edit,erase,navigate])

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
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '0 auto', marginTop: '50px'}}>
                        {logoBrand === null ? '' : (
                            <Box component="img" alt={logoBrand.name} src="/api/show_image" sx={{width: '200px', height: '200px', borderRadius: "100px", objectFit: 'cover'}} />
                        )}
                        <Typography variant="p" sx={{fontWeight: 'bold', marginBottom: '30px'}}>{`${date.getDate()}/${date.getMonth() < 10 ? '0' + (date.getMonth()+1).toString() : date.getMonth()+1}/${date.getFullYear()}`}</Typography>
                        <Typography variant="h6">Anotações</Typography>
                        <Typography variant="p" sx={{marginBottom: "30px"}}>{notes}</Typography>
                        <Typography variant="h6">Diagnóstico</Typography>
                        <Typography variant="p">{diagnosis}</Typography>
                        <Button variant="contained" onClick={() => setEdit(true)}>Editar sessão</Button>
                        <Button variant="contained" onClick={() => setErase(true)}>Apagar sessão</Button>
                        <Link href={`/patient/${patientId}`}>Voltar à página do paciente</Link>
                    </Box>
                </Container>
            </ThemeProvider>
        )}
        </>
    )
}

export default Session;
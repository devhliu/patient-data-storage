import React from 'react';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {isMobile} from 'react-device-detect';
import axios from 'axios';

import useIsLogged from '../Hooks/useIsLogged';
import BeatLoader from 'react-spinners/BeatLoader';
import Psicology from '../Images/psicology.png';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme,ThemeProvider} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Input from '@mui/material/Input';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';

const theme = createTheme();
const allowedMimeTypes = ['image/png','image/jpeg']

function Home() {
    useEffect(() => {
        document.title = 'Início';
    },[])
    useIsLogged();

    const [patients,setPatients] = useState(null);
    const [newPatient,setNewPatient] = useState(false);
    const [file,setFile] = useState(null);
    const [displayAlert,setDisplayAlert] = useState(false);
    const [image,setImage] = useState(null);
    const [loading,setLoading] = useState(true);
    const [goToPatient,setGoToPatient] = useState(null);
    const navigate = useNavigate();

    const handleClick = () => {
        setNewPatient(true); // redirects to a page to register a new patient
    }

    const fileChange = (event) => {
        let image = event.target.files[0];

        if (allowedMimeTypes.includes(image.type)) {
            setFile(image);
            setDisplayAlert(false);
        }
        else {
            setFile(null);
            setDisplayAlert(true);
        }
    }

    const deleteImage = () => {
        setImage(null);
        fetch('/api/delete_image')
        .then(response => response.json())
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (file !== null) {
            const formData = new FormData();
            formData.append('file',file);

            let configRequest = {
                url: '/api/upload_image',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: formData
            }

            axios.request(configRequest)
            .then(() => window.location.reload())
        }
    }

    const handleChange = (event,newValue,reason) => {
        if (reason === "selectOption") {
            setGoToPatient(newValue);
        }
    }

    useEffect(() => {
        fetch('/api/image_check')
        .then(response => response.json())
        .then(data => setImage(data.image))
    })

    useEffect(() => {
        fetch('/api/get_patients')
        .then(response => response.json())
        .then(data => {
            if (data.length !== undefined) {
                setPatients(data);
            }
            setLoading(false);
        })
    },[])

    useEffect(() => {
        if (newPatient) {
            return navigate('/create_new_patient')
        }
    },[newPatient,navigate])

    useEffect(() => {
        if (goToPatient !== null) {
            return navigate(`/patient/${goToPatient.id}`)
        }
    },[goToPatient,navigate])

    return (
        <>
        {loading === true ? (
            <div className="loading">
                <BeatLoader size={25} color="#000000" style={{margin: "0 auto"}} loading={loading} />
            </div>
        ): (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box sx={{display: 'flex',alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', gap: "20px", flexDirection: 'column', marginTop: '30px'}}>
                        <Typography variant="h1" fontSize="50px" noWrap={isMobile === true ? false : true}>Armazém de dados de pacientes</Typography>
                        <Typography variant="p" paragraph={true}>Aqui você pode organizar e editar informações sobre seus pacientes e ter acesso a cada anotação por data</Typography>
                        <Box component="img" alt="Psicologia" src={Psicology} sx={{width: '300px', height: '300px', objectFit: 'cover', margin: '0 auto'}} />
                        <Box sx={{display: 'flex',alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', gap: "20px", flexDirection: isMobile === true ? 'column' : 'row'}}>
                            {patients === null ? '' : (
                                <Autocomplete disablePortal options={patients} sx={{width: 300 }} onChange={handleChange} renderInput={(params) => <TextField {...params} label="Pacientes" />} />
                            )}
                            <Button variant="contained" onClick={handleClick}>Novo paciente</Button>
                        </Box>
                        <form style={{display: "flex", flexDirection: "column", gap: "20px"}} onSubmit={handleSubmit}>
                            <Input name="upload-file" type="file" onChange={fileChange}></Input>
                            {displayAlert === true ? <Alert severity="error">As únicas extensões de imagem suportadas são .png e .jpeg</Alert> : ''}
                            <Button type="submit" variant="contained">{image === null ? "Adicionar" : "Editar"} logo marca</Button>
                            {image === null ? '' : (
                                <>
                                <Button variant="contained" onClick={deleteImage}>Deletar logo marca</Button>
                                <Typography variant="p" textAlign="center">Sua logomarca atual</Typography>
                                <Box component="img" alt="Logo brand" src="/api/show_image" sx={{width: '300px', height: '300px', objectFit: 'cover', borderRadius: '150px', margin: '0 auto', marginBottom: '20px'}} />
                                </>
                            )}
                        </form>
                    </Box>
                </Container>
            </ThemeProvider>
        )}
        </>
    )
}

export default Home;

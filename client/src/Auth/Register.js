import React from 'react';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import {createTheme,ThemeProvider} from '@mui/material/styles';

const theme = createTheme();

function Register() {
    useEffect(() => {
        document.title = 'Entrar';
    })

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [registered,setRegistered] = useState(false);
    const [displayAlert,setDisplayAlert] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password1: password,
                password2: confirmPassword
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(message => {
            if (message.auth) {
                setRegistered(true);
            }
            else {
                setDisplayAlert(true);
            }
        })

    };

    useEffect(() => {
        if (registered) {
            return navigate('/login');
        }
    },[registered,navigate])

    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{marginTop: 8,display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">Registrar</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="username" label="Nome de usuário" name="username" onChange={(event) => setUsername(event.target.value)} value={username} autoFocus />
                    <TextField margin="normal" required fullWidth name="password1" label="Senha" type="password" id="password2" onChange={(event) => setPassword(event.target.value)} value={password}
                     autoFocus />
                     <TextField margin="normal" required fullWidth name="password2" label="Confirmar senha" type="password" id="password2" onChange={(event) => setConfirmPassword(event.target.value)} value={confirmPassword} autoFocus />
                    {displayAlert === true ? <Alert severity="error">Houve um erro ao registrar sua conta</Alert> : ''}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
                    <Link href="/login">Já possui uma conta? Clique aqui</Link>
                </Box>
            </Box>
        </Container>
        </ThemeProvider>
    )
}

export default Register;
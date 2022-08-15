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

function Login() {
    useEffect(() => {
        document.title = 'Entrar';
    })

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [logged,setLogged] = useState(false);
    const [displayAlert,setDisplayAlert] = useState(false);
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(message => {
            if (message.auth) {
                setLogged(true);
            }
            else {
                setDisplayAlert(true);
            }
        })

    };

    useEffect(() => {
        if (logged) {
            return navigate('/home');
        }
    },[logged,navigate])

    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{marginTop: 8,display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">Entrar</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="username" label="Nome de usuário" name="username" onChange={handleUsernameChange} value={username} autoFocus />
                    <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" onChange={handlePasswordChange} value={password} autoFocus />
                    {displayAlert === true ? <Alert severity="error">Houve um erro ao entrar</Alert> : ''}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
                    <Link href="/">Ainda não possui uma conta? Clique aqui</Link>
                </Box>
            </Box>
        </Container>
        </ThemeProvider>
    )
}

export default Login;
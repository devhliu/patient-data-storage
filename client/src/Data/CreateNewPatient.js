import React from 'react';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {isMobile} from 'react-device-detect';

import useIsLogged from '../Hooks/useIsLogged';

import CssBaseline from '@mui/material/CssBaseline';
import {createTheme,ThemeProvider} from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import InputMask from 'react-input-mask';
import ptBR from 'date-fns/locale/pt-BR';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';

const theme = createTheme();

function CreateNewPatient() {
  useEffect(() => {
    document.title = 'Criar novo paciente';
  },[])
  useIsLogged();

  const [patientId,setPatientId] = useState(null);
  const [patientName,setPatientName] = useState('');
  const [birthDate,setBirthDate] = useState(null);
  const [age,setAge] = useState('');
  const [gender,setGender] = useState('');

  const [address,setAddress] = useState('');
  const [cpf,setCpf] = useState('');
  const [filiation,setFiliation] = useState('');
  const [isWorker,setIsWorker] = useState('');
  const [work,setWork] = useState('');
  const [school,setSchool] = useState('');
  const [additionalInfo,setAdditionalInfo] = useState('');

  const [redirect,setRedirect] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/register_patient', {
      method: 'POST',
      body: JSON.stringify({
        name: patientName,
        age: age,
        birth_date: birthDate,
        gender: gender,
        address: address,
        cpf: cpf,
        filiation: filiation,
        is_worker: isWorker,
        ocupation_place: isWorker === true ? work : school,
        additional_info: additionalInfo
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then((id) => {
      setPatientId(id.id);
      setRedirect(true);
    })
  }

  useEffect(() => {
    if (redirect) {
      return navigate(`/patient/${patientId}`)
    }
  },[patientId,redirect,navigate])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Typography variant="h1" noWrap={isMobile === true ? false : true}  sx={{fontSize: "50px", marginTop: "20px", marginBottom: "50px", textAlign: "center"}}>Registre seu paciente</Typography>
        <form style={{display: 'flex', gap: '20px', justifyContent: 'center'}} onSubmit={handleSubmit}>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <TextField label="Nome do paciente" value={patientName} onChange={((event) => setPatientName(event.target.value))} required autoFocus></TextField>
              <InputLabel>Idade</InputLabel>
              <Input type="number" label="Idade" value={age} onChange={(event) => setAge(event.target.value)} autoFocus></Input>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DesktopDatePicker label="Data de nascimento" inputFormat="dd/MM/yyyy" openTo="day" value={birthDate} onChange={(newValue) => setBirthDate(newValue)} renderInput={(params) => <TextField {...params} />} />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel id="gender_label">Gênero</InputLabel>
                <Select labelId="gender_label" id="gender" value={gender} label="Gênero" onChange={(event) => setGender(event.target.value)}>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Outro">Outro</MenuItem>
                </Select>
              </FormControl>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center'}}>
            <TextField label="Endereço" value={address} onChange={((event) => setAddress(event.target.value))} autoFocus></TextField>
            <InputMask mask="999.999.999-99" value={cpf} disabled={false} onChange={(event) => setCpf(event.target.value)} maskChar=" ">{() => <TextField label="CPF" />}</InputMask>
            <TextField label="Filiação" value={filiation} onChange={((event) => setFiliation(event.target.value))} autoFocus></TextField>
            <FormControl fullWidth>
                <InputLabel id="ocupation_label">Ocupação</InputLabel>
                <Select labelId="ocupation_label" id="ocupation" value={isWorker} label="Ocupação" onChange={(event) => setIsWorker(event.target.value)} required>
                  <MenuItem value={true}>Empregado</MenuItem>
                  <MenuItem value={false}>Estudante</MenuItem>
                </Select>
              </FormControl>
              {isWorker === true ? (
                <TextField label="Local de trabalho" value={work} onChange={((event) => setWork(event.target.value))} autoFocus></TextField>
              ) : (
                <>
                {isWorker === false ? (
                  <TextField label="Escola" value={school} onChange={((event) => setSchool(event.target.value))} autoFocus></TextField>
                ) : ''}
                </>
              )}
          </Box>
          <Box sx={{display: "flex", flexDirection: "column", gap: "20px"}}>
            <TextField id="standard-textarea" label="Anotações adicionais" maxRows={4} placeholder="Acrescente algo" multiline variant="standard" value={additionalInfo} onChange={(event) => setAdditionalInfo(event.target.value)} />
            <Button type="submit" fullWidth variant="contained">Registrar paciente</Button>
            <Link href="/home">Voltar ao início</Link>
          </Box>
        </form>
      </Container>
    </ThemeProvider>
    )
}

export default CreateNewPatient;
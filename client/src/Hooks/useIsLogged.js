import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

function useIsLogged() {
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/is_logged')
        .then(response => response.json())
        .then((message) => {
            if (message.auth === false) {
                return navigate('/')
            }
        })
    },[navigate])
}

export default useIsLogged;
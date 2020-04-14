import axios from 'axios';

const monetizzeapi = axios.create({
  baseURL: 'https://api.monetizze.com.br/2.1',
});

export default monetizzeapi;

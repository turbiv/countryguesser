import axios from 'axios'
const url = 'https://restcountries.eu/rest/v2';

const getCountries = () =>{
  const makerequest = axios.get(`${url}/all`);
  return makerequest.then(response => response.data)
};

export default {getCountries}
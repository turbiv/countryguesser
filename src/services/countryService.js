import axios from 'axios'
const url = 'https://restcountries.eu/rest/v2';
const mongourl = '/api/scores'

const getCountries = () =>{
  const makerequest = axios.get(`${url}/all`);
  return makerequest.then(response => response.data)
};

const addScore = score =>{
  const addscore = axios.post(mongourl, score);
  return addscore.then(response => response.data)
};

export default {getCountries, addScore}
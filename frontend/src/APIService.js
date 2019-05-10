import axios from 'axios';
const API_URL = 'http://localhost:4000';

export default {    
    getSchedule() {
        const url = `${API_URL}/api/schedule/`;
        
        return axios.get(url).then(response => response.data);
    }
}
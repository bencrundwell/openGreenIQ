import axios from 'axios';
const API_URL = 'http://ogiq:4000';

export default {
    getAPI(table) {
        const url = `${API_URL}/api/${table}/`;
        return axios.get(url).then(response => response.data);
    }
}
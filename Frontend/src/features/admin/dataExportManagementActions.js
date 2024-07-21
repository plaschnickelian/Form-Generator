import axios from 'axios'
import apiConfig from '../../config/config'

export async function getDBData(token) {
    const config = getConfig(token);
    return axios.get(`${apiConfig.rest}/admin/api/export`, config)
}

export async function exportData(token, dataType) {
    const config = getConfig(token);
    return axios.post(`${apiConfig.rest}/admin/api/export`, {'exportType': dataType}, config)
}

function getConfig(userToken) {
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    };

    return config;
}
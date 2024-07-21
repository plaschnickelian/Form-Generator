import axios from 'axios'
import apiConfig from '../../config/config'

export async function getOfferTypes(token) {
    const config = getConfig(token);
    return axios.get(`${apiConfig.rest}/admin/api/projectOfferType`, config);
}

export async function createOfferType(offerType, token) {
    const config = getConfig(token);
    return axios.post(`${apiConfig.rest}/admin/api/projectOfferType/`, { offerType }, config);
}

export async function deleteOfferType(id, token) {
    const config = getConfig(token);
    return axios.delete(`${apiConfig.rest}/admin/api/projectOfferType/` + id, config);
}

export async function updateOfferType(offertype, token) {
    const config = getConfig(token);
    return axios.put(`${apiConfig.rest}/admin/api/projectOfferType/` + offertype._id, { offertype }, config);
}

function getConfig(userToken) {
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    };

    return config;
}
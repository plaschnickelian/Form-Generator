import axios from 'axios'
import apiConfig from '../../config/config'

export async function getUsers(token) {
    const config = getConfig(token);
    return axios.get(`${apiConfig.rest}/admin/api/users`, config)
}

export async function updateUser(user, token) {
    const config = getConfig(token);
    return axios.put(`${apiConfig.rest}/admin/api/users/` + user._id, { user }, config);
}

export async function updateUserPassword(id, user) {
    return axios.put(`${apiConfig.rest}/user/reset-password/` + id, { user });
}

export async function deleteUser(user, token) {
    const config = getConfig(token);
    return axios.delete(`${apiConfig.rest}/admin/api/users/` + user._id, config)
}

export async function createUser(user, token) {
    const config = getConfig(token);
    return axios.post(`${apiConfig.rest}/admin/api/users/`, { user }, config);
}

function getConfig(userToken) {
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    };

    return config;
}
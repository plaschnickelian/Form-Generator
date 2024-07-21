import axios from 'axios'
import apiConfig from '../../config/config'

export async function getProjectTypes(token) {
    const config = getConfig(token);
    return axios.get(`${apiConfig.rest}/admin/api/projecttypes`, config)
}

export async function getProjects(token) {
    const config = getConfig(token);
    return axios.get(`${apiConfig.rest}/admin/api/projects`, config)
}

export async function updateProject(project, token) {
    const config = getConfig(token);
    return axios.put(`${apiConfig.rest}/admin/api/projects/` + project._id, { project }, config);
}

export async function updateUserProject(project, token, formConfig) {
    const config = getConfig(token, formConfig);
    return axios.put(`${apiConfig.rest}/user/projects`, { project }, config);
}

export async function deleteProject(project, token) {
    const config = getConfig(token);
    return axios.delete(`${apiConfig.rest}/admin/api/projects/` + project._id, config)
}

export async function createProject(project, token) {
    const config = getConfig(token);
    return axios.post(`${apiConfig.rest}/admin/api/projects/`, { project }, config)
}

function getConfig(userToken, formConfig) {
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    };

    if(formConfig) {
        config.params = {
            formConfig: formConfig
        }
    }

    return config;
}
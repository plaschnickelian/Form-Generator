import axios from 'axios'
import { responseNotifyHandling } from '../../components/Error'
import apiConfig from '../../config/config'

//==========================Client==========================\\
export async function updateObject(object, config, formConfig) {
    const objects = {object: object, formConfig: formConfig }
    return axios.put(`${apiConfig.rest}/user/data/object/` + object._id, { objects }, config);
}
export async function deleteObject(object, config, formConfig) {
    config.data = {
        objects: { formConfig: formConfig }
    }
    return axios.delete(`${apiConfig.rest}/user/data/object/` + object._id, config)
}

export async function createObject(object, config, formConfig) {
    const objects = {object: object, formConfig: formConfig }
    return axios.post(`${apiConfig.rest}/user/data/object/`, { objects }, config)
}
import axios from 'axios'
import { responseNotifyHandling } from '../../components/Error'
import apiConfig from '../../config/config'

export async function getEvents(token) {
    const config = getConfig(token);
    return axios.get(`${apiConfig.rest}/user/data/listEventsBH/`, config)
}

export async function getEventStats(token) {
    const config = getConfig(token);
    return axios.get(`${apiConfig.rest}/user/data/listEventStatsBH/`, config)
}

export async function updateEvent(event, token) {
    const config = getConfig(token);
    return axios.post(`${apiConfig.rest}/user/data/updateEventsBH/` + event._id, { event }, config);
}

export async function updateEventStat(eventStat, event_id, token) {
    console.log(event_id)
    const config = getConfig(token);
    return axios.post(`${apiConfig.rest}/user/data/updateEventStatsBH/` + eventStat._id, { event: event_id }, config);
}

export async function deleteEvent(event, token) {
    const config = getConfig(token);
    return axios.delete(`${apiConfig.rest}/user/data/deleteEventsBH/` + event._id, config)
}

export async function deleteEventStat(event, token) {
    const config = getConfig(token);
    return axios.delete(`${apiConfig.rest}/user/data/deleteEventStatsBH/` + event._id, config)
}

export async function createEvent(event, token) {
    const config = getConfig(token);
    return axios.post(`${apiConfig.rest}/user/data/createEventsBH/`, { event }, config)
}

export async function createEventStat(event, token) {
    const config = getConfig(token);
    return axios.post(`${apiConfig.rest}/user/data/createEventStatsBH/`, { event }, config)
}

function getConfig(userToken) {
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    };

    return config;
}
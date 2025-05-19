import axios from "axios";

import { urlWeather } from './url'
import { keyUser } from './keys'

export const apiGetWeather = async (idArg) => {
    try {
        const url = `${urlWeather}?id=${idArg}&appid=${keyUser}`;
        console.log('url de services -> ',url)
        // const url = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=5a79d7b93447cbf0478214cb63bd1839'
        const response = await axios.get(url)
        return response;

    } catch (error) {
        console.log('error en servico getAll')
        throw error;
    }
};
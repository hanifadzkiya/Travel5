const axios = require('axios');

const end = process.env.OPEN_WEATHER_ENDPOINT_API

const getWeatherByCity = async (city)=>{
    const parameter = {
        q : city,
        appid : process.env.OPEN_WEATHER_KEY
    }
    const data = await axios.get(end+'/weather',{params:parameter});
    
    return (data.data);
}

const getForecastWeatherBandung = async ()=>{
    const parameter = {
        lon: 107.62,
        lat: -6.9,
        appid : process.env.OPEN_WEATHER_KEY,
        exclude : 'current,minutely,hourly'

    }
    const data = await axios.get(end+'/onecall',{params:parameter});
    return (data.data);
}

module.exports = {
    getWeatherByCity,
    getForecastWeatherBandung
}

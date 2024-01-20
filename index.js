import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', './views');

const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;

app.get('/', (req, res) =>{
    res.render('index.ejs');
});

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

app.get('/weather', async (req, res) => {
    try {
        const place = req.query.place;
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${openWeatherMapApiKey}`);
        const image = `https://openweathermap.org/img/w/${result.data.weather[0].icon}.png`
        
        res.render('client.ejs', {
            temperature: Math.round(kelvinToCelsius(result.data.main.temp)),
            city: result.data.name,
            lat: result.data.coord.lat,
            lon: result.data.coord.lon,
            description: result.data.weather[0].description,
            wind: result.data.wind.speed,
            pressure: result.data.main.pressure,
            humidity: result.data.main.humidity,
            image: image
        });
    } catch (error) {
        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error("Error without a response");
        }
        res.status(500).render('error.ejs');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

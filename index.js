import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) =>{
    res.render('index.ejs');
});

function kelvinToCelsius(kelvin) {
    return  kelvin - 273.15;
}

app.get('/weather', async (req, res) => {
    try {
        const place = req.query.place;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=f639a87a41a0a73d788bc7c50ff92ada`);
        
        // Check for successful response status
        if (response.status === 200) {
            const result = response.data;
            const image = `https://openweathermap.org/img/w/${result.weather[0].icon}.png`
            
            res.render('client.ejs', {
                temperature: Math.round(kelvinToCelsius(result.main.temp)),
                city: result.name,
                lat: result.coord.lat,
                lon: result.coord.lon,
                description: result.weather[0].description,
                wind: result.wind.speed,
                pressure: result.main.pressure,
                humidity: result.main.humidity,
                image: image
            });
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            res.status(response.status).render('error.ejs');
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).render('error.ejs');
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});






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

app.get('/weather', async (req, res) => {
    try {
        const place = req.query.place;
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=f639a87a41a0a73d788bc7c50ff92ada`);
        const image = `https://openweathermap.org/img/w/${result.data.weather[0].icon}.png`
        res.render('client.ejs', {
            temperature: result.data.main.temp,
            city: result.data.name,
            description: result.data.weather[0].description,
            minTemperature: result.data.main.temp_min,
            maxTemperature: result.data.main.temp_max,
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
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});






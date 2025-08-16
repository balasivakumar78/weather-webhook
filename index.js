const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

// ✅ Health check route for Render
app.get('/', (req, res) => {
  res.send('OK');
});

app.post('/webhook', async (req, res) => {
  const city = req.body.queryResult.parameters.location;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) {
    return res.json({
      fulfillmentText: 'I couldn’t detect your location. Can you tell me your city?'
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
    const response = await axios.get(url);
    const weather = response.data.weather[0].description;
    const temp = response.data.main.temp;

    res.json({
      fulfillmentText: `The weather in ${city} is ${weather} with a temperature of ${temp}°F.`
    });
  } catch (error) {
    res.json({
      fulfillmentText: `Sorry, I couldn't get the weather for ${city}.`
    });
  }
});

app.listen(3000, () => console.log('Webhook server is running'));

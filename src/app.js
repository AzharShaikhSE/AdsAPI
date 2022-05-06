// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { startDatabase } = require('./database/mongodb');
const { insertAds, getAd, getAds, deleteAd, updateAd } = require('./database/ads');
const {expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');

// creating the express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining the API endpoints

// get all ads
app.get('/ads', async (req, res) => {
  const ads = await getAds();
  res.send(ads);
});

// allow only authenticated users to access the following below endpoints
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-xwvfswmj.us.auth0.com/.well-known/jwks.json',
  }),
    audience: 'https://az-test-ads',
    issuer: 'https://dev-xwvfswmj.us.auth0.com/',
    algorithms: ['RS256'],
});

app.use(jwtCheck);

// get an ad by id
app.get('/ads/:id', async (req, res) => {
  const ad = await getAd(req.params.id);
  res.json(ad);
});

// create an ad
app.post('/ads', async (req, res) => {
  const ad = req.body;
  await insertAds(ad);
  res.send({ message: 'New add inserted', ad });
});

// update an ad
app.put('/ads/:id', async (req, res) => {
  const id = req.params.id;
  const ad = req.body;
  await updateAd(id, ad);
  res.send({ message: 'Ad updated', ad });
});

// delete an ad
app.delete('/ads/:id', async (req, res) => {
  const id = req.params.id;
  await deleteAd(id);
  res.send({ message: 'Ad deleted' });
});

// start the server after the database is started
startDatabase()
  .then(async () => {
    // insert ads into the database
    await insertAds([{ title: 'Hello, world (again)!' }]);

    app.listen(process.env.PORT || 3001, () => {
      console.log('Server started on port 3001!');
    });
  })
  .catch((error) => {
    console.log('Error starting the database:', error);
  });

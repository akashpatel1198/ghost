const express = require('express');
const app = express();

app.use(express.json());

//import routes
const mainRouter = require('./routes/mainRouter')
const metricRouter = require('./routes/metricRouter')
const priceRouter = require('./routes/priceRouter')
const permissionRouter = require('./routes/permissionRouter')
const logRouter = require('./routes/logRouter')

//set up configuration
const regionController = require('./controllers/regionController')
process.env.accessKey ? 
regionController.currentRegion.accessKeyId = process.env.accessKey : 
null;
process.env.secretKey ? 
regionController.currentRegion.secretAccessKey = process.env.secretKey : 
null;

//log the process.env
console.log('The process.env is: ')
console.log(process.env)

//define routes
app.get('/', 
  (req, res) => {
    res.status(200).send('Cloud Server Online')
  }
)

app.use('/main', mainRouter)

app.use('/metric', metricRouter)

app.use('/price', priceRouter)

app.use('/permission', permissionRouter)

app.use('/log', logRouter)

//undefined route handler
app.use('/', (req, res) => {
  res.status(404).send('Invalid route endpoint');
})

//global error handler
app.use((err, req, res, next) => {
  const errObj = {
    log: 'global error handler invoked',
    status: 400,
    message: err,
  };
  if (err.name === 'InvalidParameterCombinationException') {
    errObj.tooManyDatapoints = true;
  }
  return res.status(errObj.status).json(errObj);
})

//listen on port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('listening on ' + PORT)
})
const express = require('express')
const path = require('path')

const dotenv = require("dotenv").config()

const feeRoutes = require("./api/fees")
const computeFee = require("./api/computeFee")

const PORT = process.env.PORT || 5000

const app = express();
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

app.use(express.json())
// fees 
app.use("/fees", feeRoutes);
app.use("/compute-transaction-fee", computeFee);


app.listen(PORT, () => console.log(`Listening on ${PORT}`))

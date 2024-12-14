require('dotenv/config')

const express = require('express')
, app = express()
, port = process.env.SERVER_PORT || 5001
, morgan = require('morgan')


, userRoutes = require('./src/routes/users.routes')
, productsRoutes = require('./src/routes/products.routes')


app.use('./src/public/uploads/', express.static('uploads'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1', userRoutes)
app.use('/api/v1', productsRoutes)

//app.use('/', (req, res) => {res.status(200).send({message: 'Funcionou a home!!!'})})


app.listen(port, () => console.log(`Server is running port: ${port}!!!`))

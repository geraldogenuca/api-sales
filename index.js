require('dotenv/config')

const express = require('express')
, app = express()
, port = process.env.SERVER_PORT || 5001
, morgan = require('morgan')


//
, userRoutes = require('./src/routes/users.routes')
, productsRoutes = require('./src/routes/products.routes')
, ordersRoutes = require('./src/routes/orders.routes')


//
app.use('/public/', express.static('public'))
app.use('/public/uploads/', express.static('uploads'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(morgan('dev'))

//
app.use('/api/', userRoutes)
app.use('/api/', productsRoutes)
app.use('/api/', ordersRoutes)


app.listen(port, () => console.log(`Server is running port: ${port}!!!`))

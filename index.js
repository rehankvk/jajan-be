import express, { urlencoded } from "express"
import cors from "cors"
import productRouter from "./src/router/products.js"
import userRouter from "./src/router/users.js"
import cartRouter from "./src/router/carts.js"


const app = express()
const port = 3000

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
    res.send("halo dek, ini api")
})

var corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://jajan-fe.vercel.app/'],
    optionsSuccessStatus: 200
}

app.use('/products', productRouter)
app.use('/users', cors(corsOptions), userRouter)
app.use('/carts', cartRouter)

app.use('*', (req, res) => {
    res.send("gaada url nya dek")
})

app.listen(port, () => {
    console.log(`App Berjalan di port ${port}`)
})

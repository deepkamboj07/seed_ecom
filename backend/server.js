const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
const categoryRoutes = require("./routes/categoryRoutes")
const orderRoutes = require("./routes/orderRoutes")
const productRoutes = require("./routes/productRoutes");
const {dbconnection} = require('./config/db');
const extraRoutes =  require("./routes/extraRoutes")
const discountRoutes = require("./routes/discountCoupenRoutes")
const morgan = require("morgan")

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.use("/category", categoryRoutes)
app.use("/products", productRoutes)
app.use("/order",orderRoutes)
app.use("/extra",extraRoutes)
app.use("/discount",discountRoutes)

const port = process.env.PORT || 3001;

dbconnection.then(()=>{
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
})


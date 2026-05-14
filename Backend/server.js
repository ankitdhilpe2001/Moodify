require("dotenv").config();
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB();

app.listen(8080,()=>{console.log("server running at port 8080")})
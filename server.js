const express = require('express')
const multer = require('multer')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const db = require('./database')
const app = express()
const upload = multer({dest: 'images/'})
const port = 8080

app.use(cors())
app.use(express.static(path.join(__dirname, "build")))


app.get('/home', async (req,res) => {
    console.log('working')
    try{
        const images = await db.getImages()
        res.send(images)
    }catch(error){
        console.error(error)
    }
})

app.post('/api/images', upload.single('image'), async (req, res) => {
    const imgPath = req.file.path
    const desc = req.file.destination
    console.log('upload')
    try{
        const uploaded = await db.addImage(imgPath, desc)
        res.send(uploaded)
    }catch(error){
        console.error(error)
    }

})

app.get('/images/:imageName', (req, res) => {
    const imgName = req.params.imageName
    const readStream = fs.createReadStream(`images/${imgName}`)
    readStream.pipe(res)
})

app.get('/images/id/:id', async (req, res) => {
    const imgName = req.params.id
    try{
        const image = await db.getImage(imgName)
        res.send(image)
    }catch(error){
        console.error(error)
    }
})


app.listen(port, () => {
    console.log(`App is ruuning on port:${port}`)
})
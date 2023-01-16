const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const collection = require("./mongo")
const multer = require('multer')
// 887018788719-ioup39o5nklaj6f8tr6i5dsrplkeam1b.apps.googleusercontent.com
const tempelatePath = path.join(__dirname, '../tempelates')
app.use(express.static(path.join(__dirname, './Images')));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
let ff
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/Images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        ff = file
        cb(null, ff.originalname)
    }
})

const upload = multer({ storage: storage })
app.set("view engine", "hbs")
app.set("views", tempelatePath)

let finalarr = []

async function render() {
    const getMsg = await collection.find()
    let arr = []

    // (getMsg[0]).path
    for (i = 0; i < getMsg.length; i++) {

        if ((getMsg[i]).type == 'image') {

            obj = {
                path: (getMsg[i]).path,
                img: true,
                vid: false
            }

            arr.push(obj)

        }
        if ((getMsg[i]).type == 'video') {

            obj = {
                path: (getMsg[i]).path,
                img: false,
                vid: true
            }
            arr.push(obj)

        }

    }

    finalarr=arr

}



app.get("/", async (req, res) => {
    // const getMsg = await collection.find()
    await render()
    res.render("home", { arr: finalarr })

})



app.post("/", upload.single("image"), async (req, res) => {

    try {
        const check = await collection.findOne({ path: ff.originalname })
        if (check) {
            res.send("already exist")
        }
        else {

            if ((ff.mimetype).split('/').pop() == "png" || (ff.mimetype).split('/').pop() == "jpg" || (ff.mimetype).split('/').pop() == "jpeg") {
                data = {
                    path: ff.originalname,
                    type: 'image'
                }

                // console.log("image");
                await collection.insertMany([data])
            }

            else if ((ff.mimetype).split('/').pop() == "mp4" || (ff.mimetype).split('/').pop() == "x-matroska") {
                data = {
                    path: ff.originalname,
                    type: 'video'
                }
                // console.log("video");
                await collection.insertMany([data])
            }

            else {

                res.send("cannot")
            }


            // const getMsg = await collection.find()
            // console.log('lol',getMsg.type);

            await render()
            res.render("home", { arr: finalarr })


        }
    }
    catch (e) {
        res.send("no file")
    }


})




app.listen(3000, () => {
    console.log("port connected");
})
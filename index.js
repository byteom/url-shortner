// const express = require("express")
// const server = express()

// const PORT = 4000

 
// server.get("/api/v1/greet",(request,response)=>{
//     console.log("Request Recieved")
//     response.send({
//         success:true,
//         message:"Hello students"
//     })
// })


// server.listen(PORT,()=>{
//     console.log("Server is connected")
// })



// URL SHORTNER WEBSITE 

const express = require("express");
const server = express();

const PORT = 4000;
server.use(express.json());
const DATABASE = new Map();

server.get("/api/v1/short-url/new", (request, response) => {
    response.status(200).json({
        success: true,
        message: "This is a GET endpoint for testing"
    });
});

server.post("/api/v1/short-url/new", (request, response) => {
    console.log(request.body)
    const { url } = request.body;

    if (!url) {
        return response.status(400).json({
            success: false,
            message: "Url not found"
        });
    }

    //generate 6 cahr unique id
    const uniqueId = generateUniqeId(6);
    // we will link url -> with uniqe id
    // write code to save the url database and how many time it is clicked in object form
    DATABASE.set(uniqueId, {
        CraetionTime: new Date(),
        cliked: 0,
        url: url
    });
    //we will close the request
    response.status(200).json({
        success: true,
        message: "Url is shortened",
        data: {
            url: `http://localhost:4000/${uniqueId}`
        }

         

         


    });

    server.get("/:keyid", (request, response) => {
        const { keyid } = request.params;
        console.log(keyid);
        // find the url with keyid
        const isKeyPresent = DATABASE.has(keyid);
        if (!isKeyPresent) {
            return response.status(404).json({
                success: false,
                message: "Url not found"
            });
        }
        // redirect the user to that url
        const {cliked,url:Originalurl}= DATABASE.get(keyid);
        if(cliked>=5){
            return response.status(400).json({
                success:false,
                message:"Limit Exceeded < please update the url to get more clicks"
            })
        }
        const { CraetionTime } = DATABASE.get(keyid);
        if (CraetionTime + 1000 * 60 * 2 < new Date().getTime()) {
            return response.status(400).json({
            success: false,
            message: " Time Limit Exceeded < please update the url to get more clicks"
            });
        }


        const updatedValue = {
            cliked:cliked+1,
            url:Originalurl,
            CraetionTime:CraetionTime
        }
        DATABASE.set(keyid,updatedValue);

        response.redirect(Originalurl);
    });

     
});

server.listen(PORT, () => {
    console.log("Server is connected");
});

function generateUniqeId(charCount){
    const possibleCharString = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm741852963"
    let result =""
    for(let i =0;i<charCount;i++){
        let uniqueIndex= parseInt(Math.random()*(possibleCharString.length-1))
        result += possibleCharString[uniqueIndex]
    }
    return result
}

console.log(generateUniqeId(6))
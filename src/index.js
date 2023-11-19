const express = require("express") ;
const app = express() ;
const cheers = require("cheerio") ;
const ax = require("axios")

const PORT = 3001 ;

const newsPapers = [
    {
        name : "theguardian" ,
        address : "https://www.theguardian.com/uk/technology"
    } ,
    {
        name : "thetimes" ,
        address : "https://www.thetimes.co.uk/topic/technology"
    } ,
    {
        name : "thesun" ,
        address : "https://www.thesun.co.uk/tech/"
    } ,
    {
        name : "mirror" ,
        address : "https://www.mirror.co.uk/tech/"
    } ,
    {
        name : "nytimes" ,
        address : "https://www.nytimes.com/international/section/technology"
    } ,
    {
        name : "usatoday" ,
        address : "https://www.usatoday.com/tech/"
    } ,
    {
        name : "Chicago Sun-Times" ,
        address : "https://chicago.suntimes.com/technology"
    } ,
    {
        name : "techmeme" ,
        address : "https://www.techmeme.com/"
    } ,
    {
        name : "techcrunch" ,
        address : "https://techcrunch.com/"
    } ,
    {
        name : "engadget" ,
        address : "https://www.engadget.com/"
    }
]

let techNews = [

] ;

let techNewsByFiltering = [

] ;

for(let i = 0 ; i < newsPapers.length ; i++) {

    ax.get(
        newsPapers[i].address , {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
            }
        }
        )
        .then((res) => {
            const html = res.data ;
            const $ = cheers.load(html) ;
            $("a:contains('AI')" , html).each(function() {
                const title = $(this).text() ;
                const url = $(this).attr("href") ;
                techNews.push({
                    title ,
                    url
                })
            })
        })
        .catch((error) => {
            console.log(`An error occured ${error}`) ;
        })
} ;

app.get("/" , (request , response) => {
    response.send("Welcome To You In Our API Your Absolute Guide To Find AI News .") ;
})

app.get("/news" , (request , response) => {

    console.log("All newspapers are logged out successfuly !") ;
    response.json(techNews) ;

})

app.get("/news/:newspaper" , (request, response) => {

    techNewsByFiltering = [] ;
    const { newspaper } = request.params ;
    const filteredNewsPaper = newsPapers.find((np) => np.name.toLowerCase() == newspaper.toLowerCase()) ;
    if (filteredNewsPaper) {

        ax( filteredNewsPaper.address , {
            headers : {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
            }
        }
        ).then((res) => {
            const html = res.data ;
            const $ = cheers.load(html) ;
            $("a:contains('AI')" , html).each(function() {
                const title = $(this).text() ;
                const url = $(this).attr("href") ;
                techNewsByFiltering.push({
                    title ,
                    url
                })
            })
            response.json(techNewsByFiltering) ;
        })
        .catch((error) => {
            console.log(`An error occured ${error}`) ;
            response.send(401) ;
        })

    } else {

        response.status(400).send("There is no newspaper called like that in our API .") ;

    }

})

app.listen(process.env.PORT || PORT , (request , response) => {
    console.log(`You are Connecting to the Server on port ${PORT}`) ;
})
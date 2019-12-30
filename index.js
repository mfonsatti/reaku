const express = require('express')
const app = express()
const port = 5000
const path = require('path')
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
app.get('/hello', (req, res) => res.json({test:'Hello World!'}))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

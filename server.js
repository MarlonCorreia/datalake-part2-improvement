const express = require('express')
const path = require('path')

const app = express()
const port = 4567

app.use(express.json())

app.get('/images/:img', (req, res) => {
  console.log(req.originalUrl);
  const check = path.parse(req.params.img).name % 5

  if (check == 0) { res.status(404).send("not nice") }
  else { res.status(200).send("nice") }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
const data = require('../data/data.json');
const axios = require('axios');

const router = express.Router();
let animals = []
for (let i = 0; i< 100; i++) {
  animals.push(data[i]);
}

/* GET home page. */
router.get('/', async function(req, res, next) {

  const animalsPromises = animals.map(() => {
    return new Promise((resolve, reject) => {
      axios.get('https://api.thecatapi.com/v1/images/search')
      .then(function({data}) {
        const [cat] = data;
        const {url} = cat;
        resolve(url);
      }).catch(function(error) {
        reject(error);
      });
    });
  });

  Promise.all(animalsPromises)
    .then(function(urls) {
      const animalsWithImage = animals.map((animal, index) => ({...animal, image: urls[index]}));
      res.render('index', { animalsWithImage });
    })
    .catch(function(errors) {
      res.send(`${errors}`)
    });
});

router.get('/:id', (req, res) => {
  const {id} = req.params;
  const {url} = req.query;
  const animal = animals.find(animal => animal.id == id);
  const properties = Object.keys(animal).map(property => animal[property])
  res.render('animal', {animalname: animal.animalname, properties, image: url})
});

module.exports = router;

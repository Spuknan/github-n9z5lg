const express = require('express');
const { Router } = express
const router = new Router()

router.get('/', (req, res) => {
   res.send('Hello world main');
});

module.exports = router;
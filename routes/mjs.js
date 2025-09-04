import express from "express";
import data from "../resources/data.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.ejs",  {data,  title: "Mi Página Principal"});
});

router.get('/new-pc', (req, res) => {
   res.render('add-recorts.ejs', {data, title: 'Nuevo PC'});

});
router.post('/new', (req, res) => {
  const {id, marca, valor} = req.body;
  const aux = {id: parseInt(id), marca, valor: parseFloat(valor)};
  
  data.push(aux);
  res.redirect('/test');
    
});
export default router;
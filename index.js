import express from "express";
import 'dotenv/config';
import routs from "./routes/mjs.js";
import path from 'path';

const app = new express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));

//console.log(path.resolve('index.js'));
app.set('views',path.resolve('./views'));
app.set('view engine','ejs');
app.set('PORT', process.env.PORT || 3000);

//middleware 
app.use('/test',routs);

app.listen(app.get('PORT'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('PORT')}`);
});

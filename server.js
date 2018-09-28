var express = require('express');
var app = express();
var port = 7000;

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/google', (request, response) => {
    response.render('google/index', {
        'title':'Google',
    });
});

app.get('/sketch', (request, response) => {
    response.render('sketch/index', {
        'title':'sketch',
        'grid_height':16,
        'grid_width':16
    });
});

app.listen(port, () => console.log('Gator app listening on port 7000!'));

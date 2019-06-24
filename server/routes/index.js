
import express from 'express';
import Uploader from './uploader';


export default () => {
    const router = new express.Router();

    router.get('/',  function(req, res){
        res.render('index', { title: '' });
    });
    router.get('/list', Uploader.list);
    router.post('/upload', Uploader.Upload);
    router.get('/listing', Uploader.listing);
    return router;
}
const router=require('express').Router();

router.get('/',(req,res)=>{
    res.send('Render All Post');
})
router.post('/',(req,res)=>{
    res.send('create new post');
    
})
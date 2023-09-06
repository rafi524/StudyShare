function toStr(n)
{
    let am='AM';

    let hr=Math.floor(n/60);
    if(hr>=12) hr=hr-12;
    am='PM';
    if(hr==0) hr=12;
    if(hr<10) hr='0'+hr.toString(10);
    else hr=hr.toString(10);
    let mnt=n%60;
    if(mnt<10) mnt='0'+mnt.toString(10);
    else mnt=mnt.toString(10);
    return hr+':'+mnt+' '+am;
}
module.exports = {
    toStr,
    
}
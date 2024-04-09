const sharp = require('sharp');

module.exports = async (req, res, next) => {
    if(req.file){
        const { buffer, originalname } = req.file;
        const name = `${originalname.split(' ').join('_').split('.').slice(0,-1).join('.')}`;
        const extension = `wepb`;
        const image = name + Date.now() + '.' + extension;
        req.filepath = image;
        await sharp(buffer)
            .webp({ quality: 20 })
            .toFile("./images/" + image);
    }
    next();
  };
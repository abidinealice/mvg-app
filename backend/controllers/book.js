const { error } = require('console');
const Book = require('../models/book');
const fs = require('fs');
const range = require('../functions/function').range
const average = require('../functions/function').average

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.ratings;
  delete bookObject.averageRating;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.filepath}`
  });
  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then((books) => {res.status(200).json(books);})
  .catch((error) => {res.status(400).json({error: error});});
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then((book) => {res.status(200).json(book);})
  .catch((error) => {res.status(404).json({error: error});});
};

exports.bestThreeBooks = (req, res, next) => {
  Book.find()
  .sort({averageRating: -1})
  .limit(3)
  .then((books) => {res.status(200).json(books);})
  .catch((error) => {
    console.error(error);
    res.status(400).json({error: error});});
};

exports.modifyBook = (req, res, next) => {
  delete req.body.imageUrl;
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.filepath}`
  } : { ...req.body };
  delete bookObject._userId;
  delete bookObject._id;
  delete bookObject.ratings;
  delete bookObject.averageRating;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message : 'Non authorisé !'});
          } else {
            //suppression ancienne image
            const filename = book.imageUrl.split('/images/')[1];
            if(req.file){
              fs.unlinkSync(`images/${filename}`);
            } 

            Book.updateOne({ _id: req.params.id}, { ...bookObject})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({ error });
      });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(403).json({message: 'Not authorized !'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlinkSync(`images/${filename}`);
              Book.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));

          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.ratingBook = (req, res, next) => {
  const newGrade = req.body.rating;
  if(!range(newGrade,0,5)){
    res.status(400).json({message:`Error rating`});
  }else{
    const ratingObject = {...req.body, grade: req.body.rating};
    delete ratingObject._id;
    Book.findOne({ _id: req.params.id})
    .then(book => {
      const newRatings = book.ratings;
      const userIds = newRatings.map(rating=>rating.userId);
      if(userIds.includes(req.auth.userId)){
        res.status(403).json({message: 'Not authorized !'});
      }else{
        newRatings.push(ratingObject);
        const grades = newRatings.map(rating=>rating.grade);
        const newAverageGrades = average(grades);
        book.averageRating = newAverageGrades;
        Book.updateOne({ _id: req.params.id}, { ratings: newRatings, averageRating: newAverageGrades})
          .then(() => {res.status(201).json(book);})
          .catch((error) => {res.status(404).json({error: error});});
      }})
    .catch((error) => {
      console.error(error);
      res.status(400).json({ error });
    });
  }
};
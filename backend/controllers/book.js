const { error } = require('console');
const Book = require('../models/book');
const fs = require('fs');
const range = require('../utils/functions').range
const average = require('../utils/functions').average

//USER CREATE A BOOK

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

//DISPLAY ALL BOOKS

exports.getAllBooks = (req, res, next) => {
  Book.find()
  //Returns all books from database
  .then((books) => {res.status(200).json(books);})
  .catch((error) => {res.status(400).json({error: error});});
};

//DISPLAY OND BOOK

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  //Returns the book from id provided
  .then((book) => {res.status(200).json(book);})
  .catch((error) => {res.status(404).json({error: error});});
};

//DISPLAY BEST 3 BOOKS

exports.bestThreeBooks = (req, res, next) => {
  //Sort average ratings by descending order, select 3
  Book.find()
  .sort({averageRating: -1})
  .limit(3)
  //Display best 3 books
  .then((books) => {res.status(200).json(books);})
  .catch((error) => {
    console.error(error);
    res.status(400).json({error: error});});
};

//USER MODIFY A BOOK

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
          //Verification user
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message : 'Non authorisé !'});
          } else {
            //Delete old file if new file added
            const filename = book.imageUrl.split('/images/')[1];
            if(req.file){
              fs.unlinkSync(`images/${filename}`);
            } 
            //Update book with new data in database
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

//USER DELETE A BOOK

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          //Verification user
          if (book.userId != req.auth.userId) {
              res.status(403).json({message: 'Not authorized !'});
          } else {
              //Delete file in folder
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlinkSync(`images/${filename}`);
              //Delete book from database
              Book.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));

          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

//USER RATE A BOOK

exports.ratingBook = (req, res, next) => {
  const newGrade = req.body.rating;
  //Check if rating is between 0 and 5
  if(!range(newGrade,0,5)){
    res.status(400).json({message:`Error rating`});
  }else{
    const ratingObject = {...req.body, grade: req.body.rating};
    delete ratingObject._id;
    Book.findOne({ _id: req.params.id})
    .then(book => {
      const newRatings = book.ratings;
      const userIds = newRatings.map(rating=>rating.userId);
      //Check if user has already rate the book
      if(userIds.includes(req.auth.userId)){
        res.status(403).json({message: 'Not authorized !'});
      }else{
        //New rating added to ratings array
        newRatings.push(ratingObject);
        //Update average rating
        const grades = newRatings.map(rating=>rating.grade);
        const newAverageGrades = average(grades);
        book.averageRating = newAverageGrades;
        //Update book's ratings and average ratings in database
        Book.updateOne({ _id: req.params.id}, { ratings: newRatings, averageRating: newAverageGrades})
          //Returns update book
          .then(() => {res.status(201).json(book);})
          .catch((error) => {res.status(404).json({error: error});});
      }})
    .catch((error) => {
      console.error(error);
      res.status(400).json({ error });
    });
  }
};
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: {type: mongoose.Schema.Types.ObjectId, required: true},
        grade: {type: Number, required: true}
    }],
    averageRating: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Book', bookSchema);
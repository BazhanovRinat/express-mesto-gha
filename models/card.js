const mongoose = require('mongoose')
const validator = require('validator');


const cardSchema = new mongoose.Schema({ 
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
      validate: {
        validator: (v) => validator.isUrl(v),
        message: "Некорректный URL",
      }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  }, { versionKey: false })

  module.exports = mongoose.model('card', cardSchema); 
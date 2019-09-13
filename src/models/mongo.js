const mongoose = require('mongoose');

const password = "df478444"; //Either have a env variable with a password or manually type it in
const url = `mongodb+srv://fullstack:${password}@cluster0-vgh1b.mongodb.net/fullstack?retryWrites=true&w=majority`;
console.log(url);

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => console.log("Sucesfilly connected to the database"))
  .catch(error => console.log("Could not connect to the database", error.message));

mongoose.set('useFindAndModify', false);

const scoreSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3
  },
  results:{
    correct: {
      type: Number
    },
    wrong:{
      type: Number
    }
  }

});

scoreSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Score', scoreSchema);
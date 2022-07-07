const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const FeedbackSchema = new mongoose.Schema({
rating: {
    type: String,
    trim: true,
    required: true,
        },
comment: {
    type: String,
    trim: true,
    required: true,
        },
user:  {
    type: Schema.Types.ObjectId, ref: 'user', 
    required: true,
},
organizationCode:{
    type: String,
    trim: true,
    required: true,
  }
},
  {
    timestamps: true,
  },
);

const Feedback = mongoose.model("feedback", FeedbackSchema);

module.exports = Feedback;
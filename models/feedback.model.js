const mongoose = require("mongoose");

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
}
},
  {
    timestamps: true,
  },
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = Feedback;
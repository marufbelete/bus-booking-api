const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const OrganizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  organizationNameAmharic: {
    type: String,
    required: true,
  },
  organizationCode:{
    type: String,
    required: true,
    unique: [true,"this organization tin already exist"]
     },
    logo: {
      type: String,
    },
    branch:{
      type:[String],
    },
    rulesAndRegulation: {
      funding:{
        type: String,
      },
    }
},
  {
    timestamps: true,
  },
);

const Organization = mongoose.model("organization", OrganizationSchema);

module.exports = Organization;
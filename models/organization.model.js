const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const OrganizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    trim: true,
    required: true,
    unique: [true,"this organization name already exist"]
  },
  organizationCode:{
    type: String,
    trim: true,
    required: true,
    unique: [true,"this organization code already exist"]
}
},
  {
    timestamps: true,
  },
);

const Organization = mongoose.model("organization", OrganizationSchema);

module.exports = Organization;
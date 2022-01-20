const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    trim: true,
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

const Organization = mongoose.model("organization", OrganizationSchema);

module.exports = Organization;
const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  roleType: {
    type: String,
    trim: true,
    required: true,
  },
  rolePrivilage: {
    type: String,
    trim: true,
    required: true,
}

},
  {
    timestamps: true,
  },
);

const Role = mongoose.model("role", RoleSchema);

module.exports = Role;
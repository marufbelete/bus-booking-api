const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  roleType: {
    type: String,
    trim: true,
    enum: ['firstadmin','admin','casher','driver','agent'],
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
RoleSchema.index({roleType: 1},{unique: true, partialFilterExpression: { "roleType" : "firstadmin" }});

const Role = mongoose.model("role", RoleSchema);

module.exports = Role;
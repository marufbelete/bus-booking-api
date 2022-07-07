const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const RoleSchema = new mongoose.Schema({
  roleType: {
    type: String,
    trim: true,
    enum: ['firstadmin','admin','casher','driver','agent','redat'],
    required: true,
    unique: true
  }

},
  {
    timestamps: true,
  },
);
RoleSchema.index({roleType: 1},{unique: true, partialFilterExpression: { "roleType" : "firstadmin" }});

const Role = mongoose.model("role", RoleSchema);

module.exports = Role;
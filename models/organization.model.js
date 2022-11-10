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
  },
  organizationCode:{
    type: String,
    required: true,
    unique: [true,"this organization tin already exist"]
     },
    logo: {
      type: String,
    },
    branch:[{
      description:{
        type: String,
        },
        location:{
          type: String,
        },
        responsiblePerson:{
          type: mongoose.Schema.Types.ObjectId, ref: 'user', 
        },
        contactInfo:{
          type: String,
        },
     }],
    offering:[{
      title:{
        type:String
      },
      description:{
        type:String
      } 
     }],
  setting:{
      funding:[{
        settingDescription:{
          type: String,
        },
        settingValue:{
          type: mongoose.Schema.Types.Mixed,
        },
      }],
        bank:[{
          settingDescription:{
            type: String,
          },
          settingValue:{
            type: mongoose.Schema.Types.Mixed,
          },
        }],
        schedule:[{
          settingDescription:{
            type: String,
          },
          settingValue:{
            type: mongoose.Schema.Types.Mixed,
          },
        }],
        user:[{
          settingDescription:{
            type: String,
          },
          settingValue:{
            type: mongoose.Schema.Types.Mixed,
          },
        }],
        route:[{
          settingDescription:{
            type: String,
          },
          settingValue:{
            type: mongoose.Schema.Types.Mixed,
          },
        }]
     },
    rulesAndRegulation: [{
      ruleTitle:{
        type: String,
      },
      ruleDescription:{
        type: String,
      },
    }]
},
  {
    timestamps: true,
  },
);

const Organization = mongoose.model("organization", OrganizationSchema);

module.exports = Organization;
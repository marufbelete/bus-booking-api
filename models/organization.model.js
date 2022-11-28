const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const OrganizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    unique:true
  },
  organizationNameAmharic: {
    type: String,
  },
  lastTicket:{
    type:Number,
    default:0
  },
  lastSchedule:{
    type:Number,
    default:0
  },
  tin:{
    type:String,
    required: true,
    unique:true
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
        settingType:{
          type: String,
          enum:{
            values:["list","bool","single"],
            message: '{VALUE} is not supported'
          },
        }
      }],
        bank:[{
          settingDescription:{
            type: String,
          },
          settingValue:{
            type: mongoose.Schema.Types.Mixed,
          },
          settingType:{
            type: String,
            enum:{
              values:["list","bool","single"],
              message: '{VALUE} is not supported'
            },
          }
        }],
        schedule:[{
          settingDescription:{
            type: String,
          },
          settingValue:{
            type: mongoose.Schema.Types.Mixed,
          },
          settingType:{
            type: String,
            enum:{
              values:["list","bool","single"],
              message: '{VALUE} is not supported'
            },
          }
        }],
        user:[{
          settingDescription:{
            type: String,
          },
          settingValue:{
            type: mongoose.Schema.Types.Mixed,
          },
          settingType:{
            type: String,
            enum:{
              values:["list","bool","single"],
              message: '{VALUE} is not supported'
            },
          }
        }],
        route:[{
          settingDescription:{
            type: String,
          },
          settingValue:{
            type: mongoose.Schema.Types.Mixed,
          },
          settingType:{
            type: String,
            enum:{
              values:["list","bool","single"],
              message: '{VALUE} is not supported'
            },
          }
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
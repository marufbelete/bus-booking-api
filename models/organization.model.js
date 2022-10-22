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
     offering:{
        type:[String]
     },
  setting:{
      funding:{
        returnPercent:{
          type: String,
        },
        maxReturnDate:{
          type: String,
        },
    },
        bank:{
          isSeparateBank:{
            type:Boolean
          },
        },
        schedule:{
          isBusMandatoryForSchedule:{
            type:Boolean
          },
          isCasherCreateSchedule:{
            type:Boolean
          }
        },
        user:{
          isDriverOnlyHasOneBus:{
            type:Boolean
          },
          isBusOnlyHasOneDriver:{
            type:Boolean
          }
        },
        route:{
          isBusOnlyForOneRoute:{
            type:Boolean
          },
    }
     },
    rulesAndRegulation: {
      fundingInfo:{
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
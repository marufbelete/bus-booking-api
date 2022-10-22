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
        location:{
          type: String,
        },
        responsiblePerson:{
          type: String,
        },
        contactInfo:{
          type: String,
        },
     }],
     offering:{
        type:[String]
     },
     setting:{
      returnPercent:{
        type: String,
      },
      maxReturnDate:{
        type: String,
      },
      isSeparateBank:{
        type: String,
      },
      prepareScheduleBefore:{
        type:String
      },
      prepareScheduleBefore:{
        type:String
      },
      isBusOnlyForOneRoute:{
        type:Boolean
      },
      isDriverOnlyHasOneBus:{
        type:Boolean
      },
      isBusOnlyHasOneDriver:{
        type:Boolean
      },
      isBusMandatoryForSchedule:{
        type:Boolean
      },
      isCasherCreateSchedule:{
        type:Boolean
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
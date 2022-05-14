const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
source: {
    type: String,
    trim: true,
    required: true,
  },
destination: {
    type: String,
    trim: true,
    required: true,
},
tarif: {
    type: Number,
    trim: true,
    required: true,
},
distance:{
  type: Number,
  trim: true,
},
description:{
  type: String,
  trim: true,
  required:true
},

estimatedHour:{
  type: Number,
  trim: true,
},
departureDateAndTime:{
  type:Date,
  trim: true,
  required: true,
},
// departureTime:{
//   type:String,
//   trim: true,
//   required: true,
// },
departurePlace:{
  type: String,
  trim: true,
},
organizationCode:{
  type: String,
  trim: true,
  required: true,
},
totalNoOfSit: {
  type: Number,
  default:49,
  required: true,
},
createdBy:{
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'user',
},
//changes during ticket creation
passangerInfo:[{
  passangerName: {
      type: Array,
      trim: true,
        },
    passangerPhone: {
        type: String,
        trim: true,
        },
    passangerOccupiedSitNo:{
      type: [Number],
      trim: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'user', 
      },
    isTiacketCanceled: {
      type: Boolean,  
      default:false,
      },
    isPassangerTransfered: {
      type: Boolean,  
      default:false,
      },
    isPassangerPostponed: {
      type: Boolean,  
      default:false,
      },
    uniqueId: {
      type: String, 
      trim:true,
      },
  }],
  occupiedSitNo:{
    type: [Number],
    trim: true,
  },
//change during assignment
assignedBus:{
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'bus', 
},
driverUserName: {
  type:String, 
  trim: true,
},
isTripCanceled:{
type:Boolean,
default:false,
},
isTransfered:{
  type:Boolean,
  default:false,
  },
canceledBy:{
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'user', 
  },
  transfredBy:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    }
    
},
  {
    timestamps: true,
  },
);
ScheduleSchema.index( { "source": 1, "destination": 1 })

const Schedule = mongoose.model("schedule", ScheduleSchema);

module.exports = Schedule;
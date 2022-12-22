const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
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
      type: String,
      trim: true,
        },
    passangerPhone: {
        type: String,
        trim: true,
        },
    passangerOccupiedSitNo:{
      type: Number,
      trim: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'user', 
      },
    isTicketCanceled: {
      type: Boolean,  
      default:false,
      },
    isTicketRefunded: {
      type: Boolean,  
      default:false,
      },
    isPassangerDeparted: {
      type: Boolean,  
      default:false,
      },
    canceledBy: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'user', 
      },
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'user', 
      },
    sitCanceled: {
      type: Number,
      trim: true,
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
      confirmationNumber:{
       type:Number,
      },
    bookedAt: { 
      type : Date, 
      default: Date.now }
  }],
  occupiedSitNo:{
    type: [Number],
    trim: true,
  },
  tempOccupiedSitNo:{
    type: [Number],
    trim: true,
  },
//change during assignment
assignedBus:{
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'bus', 
},
scheduleId:{
  type:String,
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
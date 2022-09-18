import mongoose from 'mongoose';

const MatchModel = mongoose.Schema({
  difficulty: {
    type: String,
    required: true,
  },
  userOne: {
    type: String,
    required: true,
  },
  userOneSocketId: {
    type: String,
    required: true,
  },
  userTwo: {
    type: String
  },
  userTwoSocketId: {
    type: String
  },
  status: {
    type: String,
    required: true
  }
});

export default mongoose.model('MatchModel', MatchModel);

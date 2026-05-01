const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type: { type: String, required: true, enum: ['student-council', 'sports', 'clubs', 'faculty', 'academic', 'library', 'departmental', 'hostel'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
  positions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }],
  totalVoters: { type: Number, default: 10000 },
  totalVotes: { type: Number, default: 0 },
  turnoutPercentage: { type: Number, default: 0 }
}, { timestamps: true });

electionSchema.pre('save', function(next) {
  const now = new Date();
  if (now < this.startDate) this.status = 'upcoming';
  else if (now >= this.startDate && now <= this.endDate) this.status = 'active';
  else this.status = 'completed';
  if (this.totalVoters > 0) this.turnoutPercentage = Number(((this.totalVotes / this.totalVoters) * 100).toFixed(2));
  next();
});

module.exports = mongoose.model('Election', electionSchema);
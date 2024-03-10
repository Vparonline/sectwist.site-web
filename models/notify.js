const mongoose = require('mongoose');
const Schema = mongoose.Schema;

bildirimSchema = new Schema( {

	total: Number,
	notifications: String

})
Notify = mongoose.model('Notify', bildirimSchema);

module.exports = Notify;
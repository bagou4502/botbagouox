const {model, Schema} = require('mongoose');

module.exports = model(
    'Transcripts',
    new Schema({
        TicketID: String,
        URL: String
    })
);
const { format: quickReplies } = require('./quick-replies')
const carousel = require('./carousel')
const gif = require('./gif')
const image = require('./image')
const { format: buttons } = require('./buttons')
const markdown = require('./markdown')
const video = require('./video')
const contact = require('./contact')
const location = require('./location')

module.exports = { 
    quickReplies, 
    carousel, 
    gif, 
    buttons, 
    markdown, 
    image, 
    video, 
    contact,
    location
}
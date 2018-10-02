const builder = require('botbuilder')
const Utils = require('../utils')
const _ = require('lodash')
const rp = require('request-promise')

module.exports = async (text, [contentUrl, contentType, name, {
    thumbnail,
    duration,
    size
} = {}], {
    session
}, user) => {
    if (!name) {
        name = _.last(contentUrl.split('/'))
    }
    if (!contentType) {
        let ext = _.last(name.split('.'))
        ext = ext.toLowerCase()
        if (['mp4'].indexOf(ext)) {
            contentType = 'image/' + ext
        }
    }

    if (Utils.isWebSite(session)) {
        return {
            text,
            video: contentUrl
        }
    }

    if (Utils.isBottenderViber(session)) {
        const {
            headers
        } = await rp({
            url: contentUrl,
            method: 'GET',
            resolveWithFullResponse: true
        })
        return [
            text,
            {
                method: 'sendVideo',
                params: [{
                    media: contentUrl,
                    thumbnail,
                    duration,
                    size: size || headers['content-length']
                }]
            }
        ]
    }

    if (Utils.isGactions(session)) {
        return [
            text,
            {
                method: 'BasicCard',
                params: [{
                    text: name,
                    buttons: {
                        title: Utils.toByLang({
                            fr_FR: 'Voir la vidéo',
                            en_EN: 'View video'
                        }, user),
                        url: contentUrl
                    }
                }]
            }
        ]
    }

    if (Utils.isBottenderLine(session)) {
        return [
            text,
            {
                method: 'replyVideo',
                params: [contentUrl, thumbnail]
            }
        ]
    }

    if (Utils.isBottenderTelegram(session)) {
        return {
            method: 'sendVideo',
            params: [
                contentUrl,
                {
                    thumb: thumbnail,
                    duration,
                    caption: text
                }
            ]
        }
    }

    if (Utils.isBottenderFacebook(session)) {
        return [{
            method: 'sendText',
            params: [
                text
            ]
        }, {
            method: 'sendVideo',
            params: [
                contentUrl
            ]
        }]
    }

    if (Utils.isBottenderLine(session)) {
        return {
            method: 'replyImage',
            params: [contentUrl]
        }
    }

    if (Utils.isFacebook(session) && !Utils.isBotBuilderFacebook(session)) {
        return facebook
    }

    if (Utils.isBotBuilder(session)) {
        return new builder.Message(session)
            .text(text)
            .addAttachment({
                contentUrl,
                contentType,
                name
            })
    }

    return text
}

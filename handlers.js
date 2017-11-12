/**
 * This skill only supports two intents:
 *
 * - LatestPodcast: get information about the latest episode of a podcast
 * - PlayLatestPodcast: play the latest episode of a podcast
 *
 * The podcasts file holds the dictionary of all podcasts that Alexa should
 * know about.
 */
const parser = require('rss-parser');
const podcasts = require('./podcasts.json');

// Taken from: https://twitter.com/rauchg/status/712799807073419264?lang=en
const leftPad = (v, n, c = '0') =>
    String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n);

/**
 * Retrieves the latest episode of a podcast
 *
 * @param {string} rssURL - URL of the RSS feed
 * @param {function} callback - callback(err, latestEpisode)
 */
const getLatestEpisode = (rssURL, callback) => {
    parser.parseURL(rssURL, (err, parsed) =>
        callback(err, parsed && parsed.feed.entries[0])
    );
};

/**
 * Creates a text response for the LatestPodcast intent
 *
 * @param {string} podcastName - Name of the podcast
 * @param {string} episode - Episode object
 */
const episodeResponse = (podcastName, episode) => {
    let pubDate = new Date(episode.pubDate);

    pubDate =
        leftPad(pubDate.getMonth() + 1, 2) + leftPad(pubDate.getDate() + 1, 2);
    const pubDateText = `<say-as interpret-as="date">????${pubDate}</say-as>`;

    return `The latest episode from ${podcastName} is titled: ${episode.title}.
            The description says: ${episode.contentSnippet
                .trim()
                .replace(
                    /[|&;$%@"<>()+,]/g,
                    ''
                )}. It was released on ${pubDateText}`.replace(/\n/gm, '');
};

/**
 * LatestPodcast intent handler
 *
 * Emits a ':tell' response
 */
function latestIntent() {
    const podcastName = this.event.request.intent.slots.PodcastName.value;
    const rssURL = podcasts[podcastName];

    if (!rssURL) {
        return this.emit(':tell', "I don't know about that podcast");
    }

    getLatestEpisode(rssURL, (err, episode) => {
        if (err) {
            console.log(err.message);
            return this.emit(':tell', "I'm sorry. Something went wrong.");
        }

        return this.emit(':tell', episodeResponse(podcastName, episode));
    });
}

/**
 * PlayLatestPodcast intent handler
 *
 * Emits a ':tell' resposne and returns a directive
 * to start playing audio from a URL
 */
function playIntent() {
    const podcastName = this.event.request.intent.slots.PodcastName.value;
    const rssURL = podcasts[podcastName];

    if (!rssURL) {
        return this.emit(':tell', "I don't know about that podcast");
    }

    getLatestEpisode(rssURL, (err, episode) => {
        if (err) {
            console.log(err.message);
            return this.emit(':tell', "I'm sorry. Something went wrong.");
        }

        this.response
            .speak(`Playing the latest episode of ${podcastName}`)
            .audioPlayerPlay(
                'REPLACE_ALL',
                episode.enclosure.url.replace('http', 'https'), // hack,
                episode.enclosure.url.replace('http', 'https'),
                null,
                0
            );
        return this.emit(':responseReady');
    });
}

/**
 * Tells Alexa to stop playing audio
 */
function stopIntent() {
    this.response.speak('Bye bye.').audioPlayerStop();
    this.emit(':responseReady');
}

/**
 * Intent -> Handlers definition
 */
module.exports = {
    LatestPodcast: latestIntent,
    PlayLatestPodcast: playIntent,
    'AMAZON.PauseIntent': stopIntent,
    'AMAZON.ResumeIntent': playIntent,
    'AMAZON.CancelIntent': stopIntent,
    'AMAZON.StopIntent': stopIntent,
    SessionEndedRequest: function() {
        console.log('Session ended');
    },
    ExceptionEncountered: function() {
        console.log('\n******************* EXCEPTION **********************');
        console.log('\n' + JSON.stringify(this.event.request, null, 2));
        this.callback(null, null);
    },
    Unhandled: function() {
        this.response.speak(
            "Sorry, I could not understand what you've just said."
        );
        this.emit(':responseReady');
    }
};

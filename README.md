# Basic Podcast Player Alexa Skill

This skill teaches Alexa how to get latest episode information from a pre-configured list of podcasts. The example implementation integrates with the following podcast: https://headgum.com/dynamic-banter. The file `podcasts.json` defines a mapping between podcast names and RSS feed URLs.

This repo assumes you already know how to setup an Alexa skill and connect it to AWS Lambda. For more information, check the following two repos:

- https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
- https://github.com/alexa/skill-sample-nodejs-audio-player

`intents.json` holds the definition of the skill and intents you need to create on the Amazon developer portal. Make sure you enable the Audio Player directive for your skill.

## Intents

### LatestPodcast

Gets information about the latest episode of a podcast. Sample utterances:

"give me the latest episode from {PodcastName}"
"tell me about the latest episode from {PodcastName}"

### PlayLatestPodcast

Plays the latest episode of a podcast. Sample utterances:

"play {PodcastName}"
"play the latest episode of {PodcastName}"

## Requirements

- An Alexa enabled device (Echo, etc.)
- AWS Lambda
- Serverless (https://serverless.com/framework/docs/getting-started/)

## How to run and test

```
npm install

# First deployment:
serverless deploy -v

# On code changes:
serverless deploy -f podcast node

# Testing locally:
serverless invoke local -f podcast -p test/latest-episode.json
serverless invoke local -f podcast -p test/play-latest-episode.json
```


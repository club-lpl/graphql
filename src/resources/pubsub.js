'use strict'

const { RedisPubSub } = require('graphql-redis-subscriptions')

module.exports = new RedisPubSub({
  connection: 'redis://localhost:6379'
})

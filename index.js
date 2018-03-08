'use strict'

const chalk = require('chalk')
const path = require('path')
const moment = require('moment')
const { Crystal } = require('sylphy')

const config = require('./config/config')

require('longjohn')
require('dotenv-safe').config({
  path: path.join(__dirname, '.env'),
  allowEmptyValues: true
})

const cluster = new Crystal(path.join('src', 'desdemona.js'), parseInt(process.env.PROCESS_COUNT, 10))
const timestamp = () => `[${chalk.grey(moment().format('HH:mm:ss'))}]`

cluster.on('clusterCreate', id =>
  console.log(`${timestamp()} [MASTER]: CLUSTER ${chalk.cyan.bold(id)} ONLINE`)
)

cluster.createClusters().then(
  () => console.log(`${timestamp()} [MASTER]: ` + chalk.magenta('Live')),
  err => console.error(err)
)

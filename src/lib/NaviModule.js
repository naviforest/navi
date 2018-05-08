'use strict'

const path = require('path')
const fs = require('fs')

const { requireAll, isDir } = require('sylphy').utils

class NaviModule {
  constructor (client, options) {
    if (this.constructor === NaviModule) {
      throw new Error('Must extend abstract NaviModule')
    }

    this._client = client

    this._options = options
  }

  getModulePath () {
    throw new Error(`Must override method 'getModulePath' in '${this.constructor.name}'`)
  }

  set _options (args = {}) {
    const {
      name,
      description,
      commands = false,
      listeners = false,
      tasks = false,
      options = {}
    } = args

    this.name = name

    if (!this.name) {
      throw new Error(`${this.constructor.name} module is not named`)
    }

    this.description = description
    this.options = options

    this.commands = []
    this.listeners = []
    this.tasks = []

    this._resolveCommands(commands)
    this._resolveListeners(listeners)
    this._resolveTasks(tasks)
  }

  _resolveCommands (commands) {
    if (!commands) {
      return this
    }

    if (commands === true) {
      commands = 'commands'
    }

    switch (typeof commands) {
      case 'string': {
        const filepath = path.join(this.getModulePath(), commands)
        if (!fs.existsSync(filepath)) {
          throw new Error(`Folder path ${filepath} does not exist`)
        }
        const cmds = isDir(filepath) ? requireAll(filepath) : require(filepath)
        return this._resolveCommands(cmds)
      }
      case 'object': {
        if (Array.isArray(commands)) {
          for (const command of commands) {
            if (!command) {
              continue
            }
            this.commands.push(command)
          }
          return this
        }
        for (let command in commands) {
          if (!commands[command]) {
            continue
          }
          this.commands.push(commands[command])
        }
        return this
      }
      default: {
        throw new Error('Path supplied is not an object or string')
      }
    }
  }

  _resolveListeners (listeners) {
    if (!listeners) {
      return this
    }

    if (listeners === true) {
      listeners = 'listeners'
    }

    switch (typeof listeners) {
      case 'string': {
        const filepath = path.join(this.getModulePath(), listeners)
        if (!fs.existsSync(filepath)) {
          throw new Error(`Folder path ${filepath} does not exist`)
        }
        const lstnrs = isDir(filepath) ? requireAll(filepath) : require(filepath)
        return this._resolveListeners(lstnrs)
      }
      case 'object': {
        if (Array.isArray(listeners)) {
          for (const listener of listeners) {
            this.listeners.push(listener)
          }
          return this
        }
        for (let listener in listeners) {
          this.listeners.push(listeners[listener])
        }
        return this
      }
      default: {
        throw new Error('Path supplied is not an object or string')
      }
    }
  }

  _resolveTasks (tasks) {
    if (!tasks) {
      return this
    }

    if (tasks === true) {
      tasks = 'tasks'
    }

    switch (typeof tasks) {
      case 'string': {
        const filepath = path.join(this.getModulePath(), tasks)
        if (!fs.existsSync(filepath)) {
          throw new Error(`Folder path ${filepath} does not exist`)
        }
        const lstnrs = isDir(filepath) ? requireAll(filepath) : require(filepath)
        return this._resolveTasks(lstnrs)
      }
      case 'object': {
        if (Array.isArray(tasks)) {
          for (const task of tasks) {
            this.tasks.push(task)
          }
          return this
        }
        for (let task in tasks) {
          this.tasks.push(tasks[task])
        }
        return this
      }
      default: {
        throw new Error('Path supplied is not an object or string')
      }
    }
  }
}

module.exports = NaviModule

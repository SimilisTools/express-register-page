express-register-page
=====================

Simple Node.js Express webpage for registering in an event.

## Current features

* Register by email
* Confirmation / deletion from event
* OpenLayers integrated
* Structured data (http://shema.org) powered
* Easily customizable with [ejs](https://github.com/tj/ejs) templates (for website and mail messages)
* LESS enabled
* SQLite database

## Usage

Customize config.json and files in public, mail or views.

Execute with:

    node index.js

You can use programs such as [forever](https://www.npmjs.com/package/forever) for keeping the application always running.

## TODO

* Move more messages to configuration
  * Allow some degree of i18n 
* Include more frontend checks (Javascript)
* Add other plugins (e. g. Twitter)
* Allow other database options

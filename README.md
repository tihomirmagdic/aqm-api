Airduino REST API
=================
version 1.0

This is a Nodejs (TypeScript 3.x) implementation of REST API for Airduino project on PostgreSQL database.

It implements following resources:
* devices
* devicetypes
* owners
* firmwares
* configurations
* configurationitems
* regiontypes
* regions
* data
* telemetry

It uses cache for all enabled device's apikeys.

Also, the plan is to implement REST API for resources:
* events
* rules
* actions
* filters
* presettimeframes

Also, plan is to implement session based APIs, SSL and user privileges.

This is server side subproject of Airduino project - air quality measurement based on arduino MCU models.
Edge telemetry is on [Air Quality Monitor]:https://github.com/tihomirmagdic/air-quality-monitor

There are scripts in package.json for easy development.

First ensure clean .js, and .sql folders in /dist folder with clean script:

```
npm run clean
```


After cleaning, copy all .sql files:

```
npm run copy:assets
```


In development watch and copy in (/src) folder for any changes for .sql files:

```
npm run watch:assets
```


Finally, run transpiling on every change of .ts file from development folder (/src) into .js in distribution folder (/dist):

```
npm run dev
```

# Airduino REST API

version 1.0

This is a Nodejs (TypeScript 3.x) implementation of REST API for Airduino project on PostgreSQL database.

It implements following resources:

- devices
- devicetypes
- owners
- firmwares
- configurations
- configurationitems
- regiontypes
- regions
- data
- telemetry
- translations
- dictionary
- filters
- filter items

It uses cache for all enabled device's apikeys.

Also, the plan is to implement REST API for resources:

- events
- rules
- actions

Also, plan is to implement session based APIs, SSL and user privileges.

This is server side subproject of Airduino project - air quality measurement based on arduino MCU models.
Edge telemetry is on [Air Quality Monitor](https://github.com/tihomirmagdic/air-quality-monitor)

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

## For all resources there is standard (internal) with following rules:

### POST

#### Searching

Retrieves all objects with id in ids attribute.

JSON in body

```
{
  "ids": [
    { }, // id of object 1
    { }, // id of object 2
    { }, // id of object 3
  ]
}
```

![POST search](./common/images/post-search.png)

#### Creating new object

Request contains values to create an object with. Other values may be auto generated on back-end side.

JSON in body

```
{ // values of new object
  ...
}
```

There're three version for response type:

##### /full

The reponse contains all the values of the created object.

![POST create](./common/images/post-standard-full.png)

##### /id

The reponse contains only id value(s) of the created object.

![POST create](./common/images/post-standard-id.png)

##### /fast

The reponse contains only status of the created object ("success": true | false).

![POST create](./common/images/post-standard-fast.png)

##### Error during creating new object

If error occurs during creating new object, the response contains error message and false as "success" status.

![POST create](./common/images/post-standard-full-error.png)

#### Creating multiple object(s)

Create multiple objects with requested values.
Similary as in single object creation, request contains object values for creating multiple objects. Objects' values are in array of object's values.

JSON in body

```
[
  { }, // values of new object 1
  { }, // values of new object 2
  { }, // values of new object 3
  ...
]
```

There're three version for response type:

##### /multiple/full

The reponse contains values of created objects, also in array of values.

![POST create](./common/images/post-multiple-full.png)

##### /multiple/id

The reponse contains only id value(s) of the created objects in array.

![POST create](./common/images/post-multiple-id.png)

##### /multiple/fast

The reponse contains only status of the created object ("success": true | false) in array.

In the following example creation of the first object failed with false in "status" property and error object contains code, detail, and constraint.

![POST create](./common/images/post-multiple-fast.png)

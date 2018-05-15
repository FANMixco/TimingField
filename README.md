Timing Field
=================

A jquery plugin to transform a timestamp field into an hours/minutes/seconds selector.

![preview](Animation.gif)

Requirements
------------

 * jQuery
 * Twitter Bootstrap

Installation
------------

Installation with composer :

```json
    ...
    "require": {
        ...
        "fanmixco/timingfield": "1.2.2.1",
        ...
    },
    ...
```

Configuration
-------------

This is the current available configuration :

```javascript
$.fn.timingfield.defaults = {
    width:          263,
    hoursText:      'H',
    minutesText:    'M',
    secondsText:    'S',
    minutesInterval: 1,
    value:           0
};
```

Options
-------
- **width** is the default value for the controls.
- **hoursText** is the default text for the hours.
- **minutesText** is the default text for the minutes.
- **secondsText** is the default text for the seconds.
- **minutesInterval** is the possible interval that will increase or decrease the minutes by 1 minute, 5 minutes, etc.
- **value** is a initializer for the value, it can be between 0 and 86399 seconds, it's defined in seconds.

Usage
-----

```javascript
...
$('.timestamp').timingfield();
...
```

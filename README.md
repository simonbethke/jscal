# JSCal
_Javascript Calendar_
This is a project of mine, developing a universal calendar component. This is not meant to be or get production ready any time soon (or ever). This is rather meant to be a starting point for own implementation by extending classes.

## What this is not
This is no ready to use component. It is not stable and it is not finished. At this time, this is only a foundation of what can become a real calendar when implementing it on top of this.

## Features
* Multiple Calendars working as one
* Shared Event Pool
* Shared Event Layers
* One or Two direction event flow
* Support for Timezones and Daylight-Saving-Time
* Very flexible but also complex to implement

## Dependecies
As I didn't want to reinvent the wheel, this project obviously depends on a collection of other projects:
* RequireJS
* MomentJS (+ Timezone Data)
* JQuery
* QUnit
Furthermore it is heavily based on the class-model by John Resig to allow inheritance. http://ejohn.org/blog/simple-javascript-inheritance/
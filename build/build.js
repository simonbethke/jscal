({
  baseUrl: '../js',
  mainConfigFile: '../js/config.js',
  include: [
    'classes/jscal/ApiInterface',
    'classes/jscal/CalendarGenerator',
    'classes/jscal/EventCache',
    'classes/jscal/EventLayer',
    'classes/jscal/EventList',
    'classes/jscal/EventNode',
    'classes/jscal/EventRenderer',
    'classes/jscal/InputHandler',
    'classes/jscal/JSCal',
    'classes/jscal/LabelGenerator',
    'classes/jscal/Node',
    'classes/jscal/Period',
    'classes/jscal/TimeModel',
    'classes/jscal/TimezonePeriod',
    'classes/jscal/VisiblePeriodController'
  ],
  out: '../js/dist/jscal.min.js',
  preserveLicenseComments: false,
  paths: {
    'jquery'  : 'empty:',
    'hogan'   : 'empty:',
    'qunit'   : 'empty:',
    'moment'  : 'empty:',
    'moment-timezone': 'empty:'
  },
  shim: {
    'class': {
        deps: ['jquery'],
        exports: 'Class'
    },
    'hogan': {
        exports: 'Hogan'
    },
    'moment-timezone': {
       deps: ['moment']
    }
  }
})
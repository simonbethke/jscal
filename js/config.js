requirejs.config({
	paths: {
    'class'   : 'lib/class',
    'log'     : 'lib/loglevel',
    'jquery'  : 'lib/jquery',		    
    'hogan'   : 'lib/hogan-3.0.1',        
    'qunit'   : 'lib/qunit-1.18.0',
    'moment'  : 'lib/moment',
    'moment-timezone': 'lib/moment-timezone-with-data-2010-2020'
  },
  shim: {
    'class': {
      deps: ['jquery'],
      exports: 'Class'
    },
    'hogan': {
      exports: 'Hogan'
    },
    'qunit': {
      exports: 'QUnit'
    },
    'moment-timezone': {
      deps: ['moment']
    }
  }
});
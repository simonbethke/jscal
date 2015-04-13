requirejs.config({
	paths: {
    'class'   : 'lib/class',
    'log'     : 'lib/loglevel',
    'jquery'  : 'http://code.jquery.com/jquery-2.1.3.min',		    
    'hogan'   : 'http://twitter.github.com/hogan.js/builds/3.0.1/hogan-3.0.1',        
    'qunit'   : 'http://code.jquery.com/qunit/qunit-1.18.0',
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
define(['jquery', 'qunit', 
  'classes/test/jscal/PeriodSuite', 'classes/jscal/Period', 'classes/jscal/TimezonePeriod',
  'classes/test/jscal/NodeSuite', 'classes/jscal/Node', 'classes/jscal/EventNode'],
function($, QUnit, 
  PeriodSuite, Period, TimezonePeriod,
  NodeSuite, Node, EventNode){
  
  $(document).ready(function(){
    QUnit.module("PeriodSuite");
    QUnit.test("Period", function(assert) {
      PeriodSuite.run(Period, assert);
    });
    QUnit.test("TimezonePeriod", function(assert) {
      PeriodSuite.run(TimezonePeriod, assert);
    });
    
    QUnit.module("NodeSuite");
    QUnit.test("Node", function(assert) {
      NodeSuite.run(Node, assert);
    });
    QUnit.test("EventNode", function(assert) {
      NodeSuite.run(Node, assert);
    });
    
    QUnit.load();
    QUnit.done(function(details) {
      var output = "Total: " + details.total + " Failed: " + details.failed + " Passed: " + details.passed + " Runtime: " + details.runtime;
      if(details.failed == 0)
        console.log(output);
      else
        console.error(output);
    });
    QUnit.start();
  });
});


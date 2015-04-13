define(['jquery', 'qunit', 'classes/test/jscal/PeriodSuite', 'classes/jscal/Period', 'classes/jscal/TimezonePeriod'],
function($, QUnit, PeriodSuite, Period, TimezonePeriod){
  $(document).ready(function(){
    QUnit.module("PeriodSuite");
    QUnit.test("Period", function(assert) {
      PeriodSuite.run(Period, assert);
    });
    QUnit.test("TimezonePeriod", function(assert) {
      PeriodSuite.run(TimezonePeriod, assert);
    });
    QUnit.load();
    QUnit.start();
  });
});


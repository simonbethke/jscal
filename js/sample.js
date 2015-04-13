define([ 'jquery', 'moment-timezone', 'classes/jscal/Period', 'classes/jscal/EventList',
    'classes/jscal/VisiblePeriodController',  'classes/jscal/LabelGenerator', 'classes/jscal/EventCache',
    'classes/sample/SampleApiInterface', 'classes/jscal/CalendarGenerator'], 
  function($, moment, Period, EventList, 
    VisiblePeriodController, LabelGenerator, EventCache,
    SampleApiInterface, CalendarGenerator) {
  
        
  $(document).ready(function(){  
  
    var calendarRoot = $("#calendarCollection");
    
    var visiblePeriodController = new VisiblePeriodController(
      new Period(
        Date.UTC(2015, 2, 30), 
        Date.UTC(2015, 3, 6)))
    
    var eventList = new EventList();
    eventList.setEventCache(
      new EventCache(
        eventList, 
        new SampleApiInterface(200),
        $("#loadingInProgress")));
    
    var generator = new CalendarGenerator({
      events: eventList,
      controller: visiblePeriodController,
      granularityMillis: 60000
    });
    
    generator.generateCalendar({
      target: calendarRoot,
      layers: ["holiday", "resource1"],
      labels: {
        enable: {
          top: true,
          left: true
        },
        outterGrid:{
          dateProperty: "Hours"
        },
        outterSplit:{
          dateProperty: "Day",
          map: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        }
      }
    });
            
    visiblePeriodController.addNavigationClickEventHandler($("#perviousButton"), function(period){
      return period.shift(-7 * 1000 * 60 * 60 * 24);
    });        
    visiblePeriodController.addNavigationClickEventHandler($("#nextButton"), function(period){
      return period.shift(7 * 1000 * 60 * 60 * 24);
    });
    
    visiblePeriodController.addStatusLabel($("#statusLabel"), new LabelGenerator({}));
    visiblePeriodController.setTimezone("Europe/Berlin");
    
    var tzPicker = $("#timeZonePicker");
    tzPicker.change(function() {
      visiblePeriodController.setTimezone(tzPicker.val() == 'localeventtime' ? null : tzPicker.val());
    });
  });
});
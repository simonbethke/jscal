define([ "class" ], function(Class) {
  /*
   * This class shall be used to have a centralized control for the period which
   * is shown in (multiple) calendars. To make use of it, the calendars and the
   * relevant eventLayers have to be registered in it.
   */

  var VisiblePeriodController = Class.extend({
    inputPeriod : null,
    period : null,
    calendars : null,
    eventLists : null,
    statusLabels : null,
    isMonthView : true,

    /*
     * period : [period] Provide an initial period, which is used for this
     * controller.
     */
    init : function(period, isMonthView) {
      this.calendars = [];
      this.eventLists = [];
      this.statusLabels = [];
      this.setPeriod(period);
      this.isMonthView = isMonthView;
    },

    registerCalendar : function(calendar, offset) {      
      this.calendars[this.calendars.length] = {
        cal: calendar,
        offset: (offset ? offset : 0)
      };

      calendar.setPeriod(this.period.clone().shift(this.period.getDuration() * offset));
    },
    
    getBiggestOffset: function(){
      var result = 0;
      for(var i = 0; i < this.calendars.length; i++)
        if(this.calendars[i].offset > result) 
          result = this.calendars[i].offset;
        
      return result;
    },

    registerEventList : function(eventList) {
      this.eventLists.push(eventList);

      eventList.loadPeriod(this.period);
    },

    notifyCalendarsAndUpdateLocalPeriod : function() {
      var newPeriod, returnPeriod;

      newPeriod = this.period;

      for (var i = 0; i < this.calendars.length; i++) {
        this.calendars[i].cal.setPeriod(this.period.clone().shift(this.period.getDuration() * this.calendars[i].offset));
        
        if(this.calendars[i].offset == 0){
          returnPeriod = this.calendars[i].cal.getPeriod();
          if (newPeriod.getStart() > returnPeriod.getStart()
              || newPeriod.getEnd() < returnPeriod.getEnd())
            newPeriod = returnPeriod;
        }
      }

      this.period = newPeriod;
    },

    notifyEventLists : function() {
      var notifPeriod = this.period.clone();
      
      notifPeriod.setEnd(notifPeriod.getStart() + notifPeriod.getDuration() * (this.getBiggestOffset() + 1));
      
      for (var i = 0; i < this.eventLists.length; i++) {
        this.eventLists[i].loadPeriod(notifPeriod);
      }
    },

    setPeriod : function(period) {
      this.inputPeriod = period;
      this.period = period;
      this.refresh();

      return this.period;
    },
    
    refresh : function() {
      this.notifyCalendarsAndUpdateLocalPeriod();
      this.notifyEventLists();
      this.updateStatusAllLabels();
    },

    shiftPeriod : function(millis) {
      this.setPeriod(this.inputPeriod.shift(millis));
    },

    addStatusLabel : function(labelNode, labelGenerator) {
      var newStatusLabel = {
        node : labelNode,
        generator : labelGenerator
      };

      this.statusLabels[this.statusLabels.length] = newStatusLabel;
      this.updateStatusLabel(newStatusLabel);
    },

    updateStatusAllLabels : function() {
      for (var i = 0; i < this.statusLabels.length; i++) {
        this.updateStatusLabel(this.statusLabels[i]);
      }
    },

    updateStatusLabel : function(statusLabel) {     
      var startForGenerate = this.inputPeriod.getStart();  
     
     statusLabel.node.text(statusLabel.generator.generate(startForGenerate));
    },

    addNavigationClickEventHandler : function(buttonNode, modifyPeriodMethod) {
      buttonNode.click(this, function(event) {
        event.data.setPeriod(modifyPeriodMethod(event.data.inputPeriod));
      });
    },
    
    setTimezone: function(timezone){
      for (var i = 0; i < this.eventLists.length; i++) {
        this.eventLists[i].setTimezone(timezone);
      }
    }
  });
  return VisiblePeriodController;
});

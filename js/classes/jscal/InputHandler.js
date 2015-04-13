define([ "class" ], function(Class) {
  /*
   * The abstract InputHandler class provides methods which shall make it easy
   * to implement complex input event handlers. One instance of a class
   * extending this InputHandler can be used to register at any number of events
   * in the same calendar.
   */
  var InputHandler = Class.extend({
    init : function(calendar) {
      var data = {
        calendar: calendar
      };
      
      this.get = function(field){
        return data[field];
      };
    },

    input : function(inputEvent) {
      inputEvent.data.handler[inputEvent.type].apply(inputEvent.data, [inputEvent]);
    },

    register : function(data) {
      data.at.on(data.on, {
        calendar : this.get("calendar"),
        object : data.object,
        handler : this
      }, this.input);
    },

    afterEventEdit : function(event) {
      event.compilePeriodToUtc();
    }
  });
  return InputHandler;
});
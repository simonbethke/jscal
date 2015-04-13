define(["class"],
    function(Class) {
  /*
   * The label generator is a class for generating labels like day-numbers or
   * weekday names.
   */
  var LabelGenerator = Class.extend({
    /*
     * data = { generator: [function] You can pass a function, which takes a
     * millisecond timestamp as single parameter and returns a string default: a
     * function which uses the other settings
     * 
     * dateProperty: [string] Name of a Proptery of the Javascript Date object -
     * "Day" to use Date.getDay() default: undefined
     * 
     * map: [array of string] Strings which are picked based on the given
     * dateProperty default: undefined }
     */

    init : function(input) {
      if (input.generator){
        this.generate = input.generator;
        return;
      }
      var data = {
        methodName: input.dateProperty ? "getUTC" + input.dateProperty : "toLocaleString",
        map: input.map
      };
      
      this.get = function(field){
        return data[field];
      };
    },

    generate : function(timestamp) {
      var map = this.get("map");
      var dateValue = new Date(timestamp)[this.get("methodName")]();
      return map ? map[dateValue] : dateValue;
    }
  });

  return LabelGenerator;
});
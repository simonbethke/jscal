define([ "classes/jscal/Node", "classes/jscal/TimezonePeriod" ], function(Node, TimezonePeriod) {
  var Event = Node.extend({
    init : function(input) {
      this._super();
      var data = {
        mutable: {
          name: input.name,
          color: input.color,
          period: input.timezonePeriod ? input.timezonePeriod : new TimezonePeriod({
            start: input.start, 
            startTimezone: input.timezone,
            end: input.end
          }),
          properties: {},
          parallel: {}
        },
        immutable: {
          layerId: input.layerId,
          zIndex: input.zIndex,
          eventType: input.eventType,
          key: input.key
        }
      };
      
      this.get = function(property){
        if(data.immutable[property] != null)
          return data.immutable[property];
        return data.mutable[property];
      };
      
      this.set = function(property, value){
        data.mutable[property] = value;
      }
    },
    
    setTimezone: function(timezone){
      this.get("period").setTimezone(timezone);
    },
    
    getProperties: function(){
      return this.get("properties");
    },
    
    getPeriod: function(){
      return this.get("period");
    },

    equals: function(event) {
      return this.get("period").equals(event.get("period"))
          && this.get("name") == event.get("name")
          && this.get("eventType") == event.get("eventType")
          && this.get("color") == event.get("color");
    },
    
    clone: function(){
      var clone = new Event({
        name: this.get("name"),
        color: this.get("color"),
        timezonePeriod: this.get("period").clone(),
        layerId: this.get("layerId"),
        zIndex: this.get("zIndex"),
        eventType: this.get("eventType"),
        properties: {}
      });
      
      for(var key in this.getProperties())
        clone.properties[key] = this.getProperties()[key];
        
      return clone;
    }
  });
  return Event;
});

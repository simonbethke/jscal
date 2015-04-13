define([ "class" ], function(Class) {
  var Period = Class.extend({

    init: function(dataOrStart, end){
      if(isNaN(dataOrStart)){
        this.initObject(dataOrStart);
      }
      else{
        this.initObject({
          start: dataOrStart,
          end: end
        });
      }
    },
  
    initObject: function(input) {
      var data = {
        start: input.start,
        end: input.end,
        duration: input.duration
      };
      
      this.modify = function(modFunction){
        modFunction(data);
      };
      
      this.get = function(field, onNullFunction){
        if(data[field] == null){
          onNullFunction(data);
        }
          
        return data[field];
      };
    },
    
    getStart: function(){
      return this.get("start");
    },
    
    setStart: function(timestamp){
      this.modify(function(data){
        data.start = timestamp;        
        data.duration = null;
      });
    },
    
    setEnd: function(timestamp){
      this.modify(function(data){
        data.end = timestamp;        
        data.duration = null;
      });
    },
      
    getEnd: function(){
      return this.get("end", function(data){
        data.end = data.start + data.duration;
      });
    },
    
    getDuration: function(){
      return this.get("duration", function(data){
        data.duration = data.end - data.start;
      });
    },

    shift: function(millis) {
      this.modify(function(data){
        data.start += millis;        
        if(data.end) data.end += millis;
      });
      return this;
    },
    
    offset: function(startOffset, endOffset) {
      var end = this.getEnd();
      this.modify(function(data){
        data.start += startOffset;        
        data.end = end + endOffset;
        data.duration = null;
      });
      return this;
    },

    cage: function(cagePeriod, cuts) {
      var start = this.getStart();
      var end = this.getEnd();
      this.modify(function(data){
        data.start = Math.max(cagePeriod.getStart(), start);
        data.end = Math.min(cagePeriod.getEnd(), end);
        if(cuts){
          cuts.start = data.start != start;
          cuts.end = data.end != end;
        }
        data.duration = null;
      });
      return this;
    },

    clone: function() {
      return new Period({
        start: this.getStart(),
        end: this.getEnd()
      });
    },
    
    equals: function(period){
      return this.getStart() == period.getStart() && this.getEnd() == period.getEnd();
    }
  });
  
  return Period;
});
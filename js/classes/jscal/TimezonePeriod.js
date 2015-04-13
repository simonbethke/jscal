define([ "classes/jscal/Period", "moment-timezone", "log" ], function(Period, moment, log) {

  var TimezonePeriod = Period.extend({
    
    init: function(input) {      
      var superScope = this._super(input);
            
      var tz = input.tz ? input.tz : {
        start:{
          localTimezone: input.startTimezone,
          timezone: input.startTimezone,
          millis: null
        },
        end:{
          localTimezone: (input.endTimezone ? input.endTimezone : input.startTimezone),
          timezone: (input.endTimezone ? input.endTimezone : input.startTimezone),
          millis: null
        },
        duration:{
          millis: null
        }
      }
      
      this.getMomentStart = function(){
        return moment.tz(this.getStart(), tz.start.timezone);
      };
      
      this.getMomentEnd = function(){
        return moment.tz(this.getEnd(), tz.end.timezone);
      };
      
      this.getMomentDuration = function(){
        return moment.duration(this.getDuration());
      };
      
      var periodModify = this.modify;
      
      this.modify = function(modFunction){
        tz.start.millis = null;
        tz.end.millis = null;
        tz.duration.millis = null;        
        return periodModify(function(data){
          return modFunction(data, tz);
        });
      };
      
      this.getTz = function(field, onNullFunction){
        if(tz[field].millis == null)
          onNullFunction.apply(this, [tz]);
        return tz[field].millis;
      };
      
      this.clone = function(){
        var result = new TimezonePeriod({
          start: this.getStart(),
          end: this.getEnd(),
          tz: $.extend(true, {}, tz)
        });
        
        return result;
      }
    },
    
    getTzStart: function(){
      return this.getTz("start", function(tz){
        tz.start.millis = this.getStart() - moment.tz.zone(tz.start.timezone).offset(this.getStart()) * 60 * 1000;
      });
    },
    
    getTzEnd: function(){
      return this.getTz("end", function(tz){
        tz.end.millis = this.getEnd() - moment.tz.zone(tz.end.timezone).offset(this.getEnd()) * 60 * 1000;
      });
    },
    
    getTzDuration: function(){
      return this.getTz("duration", function(tz){
        tz.duration.millis = this.getTzEnd() - this.getTzStart();
      });
    },
    
    humanize: function(){
      var format = {
        date: "DD.MM.YYYY",
        time: "HH:mm",
        separator: " - "
      };
      var start = this.getMomentStart();
      var end = this.getMomentEnd();
      var longFormat = format.date + " " + format.time;
      
      if(this.displayTimezone){
        if(start.isSame(end, "day"))
          return start.format(format.date + " " + format.time) + format.separator + end.format(format.time);
        else if(start.format("HHmmssSSS") == "000000000" && end.format("HHmmssSSS") == "000000000")
          return start.format(format.date) + format.separator + end.format(format.date);
      }
      else{
        longFormat += " z";
      }
      
      return start.format(longFormat) + format.separator + end.format(longFormat);
    },
    
    tzCage: function(cagePeriod, cuts){
      var start = this.getStart();
      var end = this.getEnd();
      
      this.modify(function(data, tz){
        var cageTzStart = cagePeriod.getStart() + moment.tz.zone(tz.start.timezone).offset(cagePeriod.getStart()) * 60 * 1000;
        var cageTzEnd = cagePeriod.getEnd() + moment.tz.zone(tz.end.timezone).offset(cagePeriod.getEnd()) * 60 * 1000;
        data.start = Math.max(cageTzStart, start);
        data.end = Math.min(cageTzEnd, end);
        data.duration = null;
        if(cuts){
          cuts.start = data.start != start;
          cuts.end = data.end != end;
        }
      });
      return this;
    },
    
    setTimezone: function(timezone){
      this.displayTimezone = timezone;
      this.modify(function(data, tz){
        if(timezone == null){
          tz.start.timezone = tz.start.localTimezone;
          tz.end.timezone = tz.end.localTimezone;
        }
        else{
          tz.start.timezone = timezone;
          tz.end.timezone = timezone;
        }
      });
      log.trace("Displayed timezone was set to: " + timezone);
    }
  });

  return TimezonePeriod;

});
define([ "class", 'classes/jscal/Period' ],
  function(Class, Period) {
    /*
     * Defines the timeflow and nesting within this calendar. It allows to
     * create calendars with one or two axis. This class contains all methods
     * for the translation between x/y coordinates and a time.
     */
    var TimeModel = Class.extend({
      // second, minute, hour, day, week
      constDurations : [ 1000, 60000, 3600000, 86400000, 604800000 ],
      period : null,
      settings : {},
      splitCount : 1,

      /*
       * data = { horizontalEvents: [boolean] true to show events
       * horizontally, else they are shown vertically default: true
       * 
       * gridMillis: [number] milliseconds between gridlines and labels
       * default: 3600000 (an hour)
       * 
       * granularityMillis: [number] milliseconds of raster default: 1000
       * (a second)
       * 
       * splitDurationMillis: [number] set this number if you want to
       * create multiple splits of this duration default: undefined
       * 
       * startDayOfWeek: [number] index of the javascript Date-Object
       * weeekday to start the week with default: 1 (Monday) }
       */

      init: function(input, period) {
        var data = {
          period: period,
          splitDuration: input.splitDurationMillis,
          splitCount: null,
          gridMillis: input.gridMillis != undefined ? input.gridMillis : 3600000,
          gridCount: null,
          granularity: input.granularityMillis != undefined ? input.granularityMillis : 1000,
          horizontalEvents: input.horizontalEvents != undefined ? input.horizontalEvents : true,
          startDayOfWeek: input.startDayOfWeek != undefined ? input.startDayOfWeek : 1
        };
        
        this.get = function(property){
          return data[property];
        };
        
        this.set = function(property, value){
          data[property] = value;
        };
        
        if (period != undefined) {
          this.setPeriod(period);
        }
      },

      setPeriod: function(period) {
        this.set("period", period);                

        if(!this.get("splitDuration"))
          this.set("splitDuration", period.getDuration());
        
        this.set("splitCount", null);
      },

      snapTime: function(timestamp) {
        var relToStart = timestamp - this.get("period").getStart();
        return timestamp - (relToStart % this.get("granularity"));
      },

      getSplitCount: function() {
        var splitCount = this.get("splitCount");
        if(splitCount == null){
          splitCount = this.get("period").getDuration() / this.get("splitDuration");
          this.set("splitCount", splitCount);
        }
        return splitCount;
      },
      
      getGridCount: function() {
        var gridCount = this.get("gridCount");
        if(gridCount == null){
          gridCount = this.get("splitDuration") / this.get("gridMillis");
          this.set("gridCount", gridCount);
        }
        return gridCount;
      },

      getTimeForPosition: function(x, y) {              
        var isHorizontal = this.get("horizontalEvents");      
        
        var splitDirection = isHorizontal ? y : x;
        var flowDirection = isHorizontal ? x : y;

        var flowDuration = this.get("splitDuration");
        var splitIndex = Math.floor(splitDirection * this.getSplitCount());

        return this.get("period").getStart() + flowDuration * splitIndex + flowDuration * flowDirection;
      },

      getBoxes: function(period) {            
        var isHorizontal = this.get("horizontalEvents");               
        var modelPeriod = this.get("period");
        var result = [];
        var cuts = {};
        period = period.clone().tzCage(modelPeriod, cuts);
        
        if (period.getTzDuration() > 0) {
          var periodStartInSplits = (this.snapTime(period.getTzStart()) - modelPeriod.getStart()) / this.get("splitDuration");
          var periodEndInSplits   = (this.snapTime(period.getTzEnd()) - modelPeriod.getStart()) / this.get("splitDuration");

          var boxCount = Math.ceil(periodEndInSplits) - Math.floor(periodStartInSplits);
          var firstSplitIndex = Math.floor(periodStartInSplits);

          var logicData = {
            barIndexPosition: 0,
            barWidth: 1 / this.getSplitCount(),
            timePosition: periodStartInSplits - Math.floor(periodStartInSplits),
            timeLength: 0
          };
          
          for (var i = 0; i < boxCount; i++) {          
            if (i == (boxCount - 1) && periodEndInSplits != Math.floor(periodEndInSplits))
              logicData.timeLength = periodEndInSplits - Math.floor(periodEndInSplits);
            else
              logicData.timeLength = 1;

            logicData.timeLength -= logicData.timePosition;
            logicData.barIndexPosition = (i + firstSplitIndex) / this.getSplitCount();

            if(isHorizontal) result[i] = {
              x: logicData.timePosition,
              y: logicData.barIndexPosition,
              width : logicData.timeLength,
              height: logicData.barWidth
            };
            else result[i] = {
              x: logicData.barIndexPosition,
              y: logicData.timePosition,
              width : logicData.barWidth,
              height: logicData.timeLength
            };
            logicData.timePosition = 0;
          }
        }

        return {
          positions : result,
          cut :  cuts
        };
      }
    });

    TimeModel.MONTHLY = {
      granularityMillis : 3600000,
      horizontalEvents : true,
      gridMillis : 1000 * 60 * 60 * 24,
      splitDurationMillis : 24 * 7 * 3600000
    };
    TimeModel.WEEKLY = {
      granularityMillis : 60000,
      horizontalEvents : false,
      gridMillis : 1000 * 60 * 60,
      splitDurationMillis : 60 * 24 * 60000
    };
    TimeModel.DAILY = {
      granularityMillis : 60000,
      horizontalEvents : false,
      gridMillis : 1000 * 60 * 60
    };

    return TimeModel;
  });
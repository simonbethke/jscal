define(["class", "log"],
    function(Class, log) {
  var EventCache = Class.extend({
    eventList : null,
    cachedPeriodTimes : null,
    apiInterface: null,
    requestStack: null,
    processActive: null,
    throbberNode: null,
    maxStackSize: 3,

    init : function(eventList, apiInterface, throbberNode) {
      this.eventList = eventList;
      this.apiInterface = apiInterface;
      this.throbberNode = throbberNode;
      this.cachedPeriodTimes = [];
      this.requestPeriodStack = [];
      this.processActive = false;
    },

    /*
      request = {
        period             -> the period for which events are required
        refreshCache       -> TRUE will reload all events in the period
                              FALSE will not reload events which are already cached
        periodMarginFactor -> factor for calculating how much the period will be enlarged
                              to get earlier and later events. A factor 1 will add the
                              period duration * 1 to the start and the end
      }
    */
    
    setActive: function(processActive){
      this.processActive = processActive;
      if(this.throbberNode){
        if(processActive)
          this.throbberNode.show();
        else
          this.throbberNode.hide();
      }
    },
    
    /*
      Loads events in the requested period using a LIFO Stack for multiple requests
    */
    requestPeriod: function(request){
      this.requestPeriodStack.push(request);
      if(this.requestPeriodStack.length > this.maxStackSize)
        this.requestPeriodStack.shift();

      if(!this.processActive)
        this.processRequestPeriodStack();
    },
    
    processRequestPeriodStack : function() {
      this.setActive(true);
      var request = this.requestPeriodStack.pop();
    
      var period = request.period.clone();
      
      // Period augmentation to respect the margins
      if(!request.periodMarginFactor)
        request.periodMarginFactor = 1;
      var addition = period.getDuration() * request.periodMarginFactor;
      period.offset(-1 * addition, addition);
      log.debug("EventCache requested period is " + period.getStart() + " - " + period.getEnd());
      
      // Cut the period if part of it is already cached.
      if(!request.refreshCache){
        var cachePeriod;
        for(var i = 0; i < this.cachedPeriodTimes.length; i++){
          cachePeriod = this.cachedPeriodTimes[i];
          if(cachePeriod.getEnd() > period.getStart() || cachePeriod.getStart() < period.getEnd()){
            if(cachePeriod.getStart() <= period.getStart() && cachePeriod.getEnd() < period.getEnd()){
              period.setStart(cachePeriod.getEnd());
            }
            else if(cachePeriod.getStart() > period.getStart() && cachePeriod.getEnd() >= period.getEnd()){
              period.setEnd(cachePeriod.getStart());
            }
            else if(cachePeriod.getStart() <= period.getStart() && cachePeriod.getEnd() >= period.getEnd()){
              return; // All events were already present in the cache
            }
          }
        }
      }
      
      var thisCache = this;
      var request = {
         period: period,
         success: function(eventArray) {
          thisCache.requestComplete.apply(thisCache, [eventArray, period]);
        },
        error: function(errorMsg) {
          console.log("error: " + errorMsg);
        }
      };

      this.apiInterface.getEvents(request);
    },

    addPeriodToCachedPeriodTimes : function(period) {
      this.cachedPeriodTimes[this.cachedPeriodTimes.length] = period;
    
      var periodA, periodB;
      for(var a = this.cachedPeriodTimes.length - 1; a >= 0; a--){
        periodA = this.cachedPeriodTimes[a];
        for(var b = a - 1; b >= 0; b--){
          periodB = this.cachedPeriodTimes[b];          
          if(periodA.getEnd() >= periodB.getStart() && periodA.getStart() <= periodB.getEnd()){
            periodB.setStart(Math.min(periodA.getStart(), periodB.getStart()));
            periodB.setEnd(Math.max(periodA.getEnd(), periodB.getEnd()));
            this.cachedPeriodTimes.splice(a, 1);
          }
        }
      }
    },

    requestComplete : function(eventArray, period) {
      this.eventList.clearAndAddEvents(eventArray, period);      
      this.addPeriodToCachedPeriodTimes(period);
      
      if(this.requestPeriodStack.length > 0)
        this.processRequestPeriodStack();
      else{
        this.setActive(false);
        log.debug("EventCache requests have been finished");
      }
    }
  });
  return EventCache;

});
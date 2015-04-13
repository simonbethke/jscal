define([ "class", "classes/jscal/Period", "classes/jscal/EventNode", "classes/jscal/EventLayer"],
    function(Class, Period, EventNode, EventLayer) {
      /*
       * The event layer class is the the base of the data model for any
       * calendars. To get events into a calendar, the calendar has to register
       * at the event list.
       */
      var EventList = Class.extend({
        init : function() {
          var lists = {
            eventsByLayerId : [],
            eventLayers : []
          };
          var data = {
            eventCache : null,
            timezone : null
          };
          
          this.getData = function(field){
            return data[field];
          }
          this.setData = function(field, value){
            data[field] = value;
          }
          
          this.getListItem = function(list, key){                  
            return lists[list][key];
          };
          
          this.setListItem  = function(list, key, value){
            lists[list][key] = value;
          };
          
          this.addListItem  = function(list, item){
            lists[list].push(item);
          };
          
          this.forEachListItem = function(list, forEach){
            for(var key in lists[list]){
              forEach(lists[list][key]);
            }
          };              
        },
        
        getEventLayer : function(layerId){
          var layer = this.getListItem("eventLayers", layerId);
          if(!layer){
            layer = new EventLayer(layerId, this);
            this.setListItem("eventLayers", layerId, layer);
          }
          
          return layer;
        },
        
        getEventsByLayerId : function(layerId){
          var events = this.getListItem("eventsByLayerId", layerId);
          if(!events){
            events = [];
            this.setListItem("eventsByLayerId", layerId, events);
          }
          
          return events;
        },

        setEventCache : function(eventCache) {
          this.setData("eventCache", eventCache)
        },

        addEvent : function(event) {
          event.setTimezone(this.getData("timezone"));
          
          this.getEventsByLayerId(event.get("layerId")).push(event);
          
          return event;
        },
        
        addEvents : function(eventArray) {
          var layers = [];
          var event;
          for (var i = 0; i < eventArray.length; i++) {
            event = this.addEvent(new EventNode(eventArray[i]));
      
            layers[event.get("layerId")] = this.getEventLayer(event.get("layerId"));
          }
          
          for(var layerId in layers)
            layers[layerId].renderLayer();
        },

        clearAndAddEvents : function(eventArray, period) {
          // clear events
          var eventList = this;
          this.forEachListItem("eventsByLayerId", function(events){
            /*
              This one is tricky: The left side period clearly is UTC only. It is simply the horizon of the cache.
              The right side period again is the event. Here the displayed period is timezoned, but if we check against the timezoned event,
              it will change with the view timezone which could make the cache break...
              ... thus the save variant is, to leave the event period in UTC with the risk, to miss events near the horizon-borders
            */
            for(var i = events.length - 1; i >= 0; i--)
              if (period.getStart() < events[i].getPeriod().getEnd() && period.getEnd() > events[i].getPeriod().getStart())
                events.splice(i, 1);
          });
          // Add new events
          this.addEvents(eventArray);
        },
        
        setTimezone : function(timezone) {
          this.setData("timezone", timezone);
            
          this.forEachListItem("eventsByLayerId", function(events){
            for(var i = 0; i < events.length; i++)
              events[i].setTimezone(timezone);
          });

          this.renderList();
        },

        renderList : function() {
          this.forEachListItem("eventLayers", function(layer){
            layer.renderLayer();
          });
        },

        loadPeriod : function(period) {
          var cache = this.getData("eventCache");
          if(cache != null)
            cache.requestPeriod({
              period : period,
              refreshCache : true,
              periodMarginFactor : 1
            });
            
          this.forEachListItem("eventLayers", function(layer){
            layer.renderLayer();
          });
        }
      });
      
      return EventList;
    });
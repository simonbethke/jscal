define([ "class", "classes/jscal/Period"],
    function(Class, Period) {
      /*
       * The event layer class is the the base of the data model for any
       * calendars. To get events into a calendar, the calendar has to register
       * at the event list.
       */
      var EventLayer = Class.extend({

            init : function(layerId, eventList) {
              var data = {
                calendars : [],
                layerId : layerId,
                eventList : eventList
              };
              
              this.get = function(field){
                return data[field];
              };
            },

            getEvent : function(eventIndex) {
              return this.get("eventList").getEventsByLayerId(this.get("layerId"))[eventIndex];
            },

            getEvents : function() {
              return this.get("eventList").getEventsByLayerId(this.get("layerId"));
            },

            renderLayer : function() {
              this.checkOverlapping();

              for (var e = 0; e < this.getEvents().length; e++) {
                this.renderEvent(this.getEvent(e));
              }
            },

            renderToCalendar : function(calendar) {
              for (var e = 0; e < this.getEvents().length; e++) {
                calendar.renderEvent(this.getEvent(e));
              }
            },

            renderEvent : function(event) {
              var calendars = this.get("calendars");
              for (var c = 0; c < calendars.length; c++) {
                calendars[c].renderEvent(event);
              }
            },

            registerCalendar : function(calendar) {
              this.get("calendars").push(calendar);
              return this;
            },

            checkOverlapping : function() {
              
              this.getEvents().sort(function(a, b) {
                return a.get("period").getTzStart() - b.get("period").getTzStart();
              });

              var parallelGroupLanes = [];
              var parallelGroup = [];
              var currentTime, firstFreeLaneIndex;
              var startedCount = 0;
              
              for (var i = 0; i < this.getEvents().length; i++) {
                currentTime = this.getEvent(i).get("period").getTzStart();

                // Check if any lane got free
                for (var e = 0; e < parallelGroupLanes.length; e++) {
                  if (parallelGroupLanes[e]) {
                    if (parallelGroupLanes[e].get("period").getTzEnd() <= currentTime) {
                      parallelGroupLanes[e] = null;
                      startedCount--;
                    }
                  }
                }

                // If all lanes are free, set the count of parallel lanes to
                // all events of this parallelGroup.
                // Reset counters.
                if (startedCount == 0) {
                  for (var p = 0; p < parallelGroup.length; p++) {
                    parallelGroup[p].get("parallel").count = parallelGroup.length
                        - laneShares;
                  }
                  parallelGroup.length = 0;
                  parallelGroupLanes.length = 0;
                  laneShares = 0;
                }

                // Find the first lane which is free for this new event
                firstFreeLaneIndex = 0;
                while (parallelGroupLanes[firstFreeLaneIndex])
                  firstFreeLaneIndex++;

                // If the first free lane is not a new one, one more lane got
                // shared
                if (firstFreeLaneIndex < parallelGroupLanes.length)
                  laneShares++;
                this.getEvent(i).get("parallel").index = firstFreeLaneIndex;

                startedCount++;
                parallelGroupLanes[firstFreeLaneIndex] = this.getEvent(i);
                parallelGroup[parallelGroup.length] = this.getEvent(i);
              }

              // Finish the last parallel group
              for (var p = 0; p < parallelGroup.length; p++) {
                parallelGroup[p].get("parallel").count = parallelGroup.length - laneShares;
              }
            }
          });
      return EventLayer;
    });
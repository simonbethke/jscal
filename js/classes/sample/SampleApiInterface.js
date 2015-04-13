define(['moment-timezone', 'classes/jscal/ApiInterface' ], function(moment, ApiInterface) {
  
  var events = [
    //Holidays
    {
      name: "Karfreitag",
      start: moment.tz("2015-04-03 00:00", "Europe/Berlin").format("X") * 1000,
      end: moment.tz("2015-04-04 00:00", "Europe/Berlin").format("X") * 1000,
      color: "rgba(200,200,100,0.7)",
      key: 2001,
      zIndex: 2,
      layerId: 'holiday',
      eventType: 'holiday',
      timezone: 'Europe/Berlin'
    },
    {
      name: "Ostersonntag",
      start: moment.tz("2015-04-05 00:00", "Europe/Berlin").format("X") * 1000,
      end: moment.tz("2015-04-06 00:00", "Europe/Berlin").format("X") * 1000,
      color: "rgba(200,200,100,0.7)",
      key: 2002,
      zIndex: 2,
      layerId: 'holiday',
      eventType: 'holiday',
      timezone: 'Europe/Berlin'
    },
    {
      name: "Ostermontag",
      start: moment.tz("2015-04-06 00:00", "Europe/Berlin").format("X") * 1000,
      end: moment.tz("2015-04-07 00:00", "Europe/Berlin").format("X") * 1000,
      color: "rgba(200,200,100,0.7)",
      key: 2003,
      zIndex: 2,
      layerId: 'holiday',
      eventType: 'holiday',
      timezone: 'Europe/Berlin'
    },
    
    //Tasks
    {
      name: "Vacation",
      start: moment.tz("2015-03-23 00:00", "Europe/Berlin").format("X") * 1000,
      end: moment.tz("2015-04-05 00:00", "Europe/Berlin").format("X") * 1000,
      color: "rgba(116,186,255,0.7)",
      key: 3011,
      zIndex:3,
      layerId: 'resource1',
      eventType: 'taskEvent',
      timezone: 'Europe/Berlin'
    },
    {
      name: "Sightseeing Kiel",
      start: moment.tz("2015-03-30 11:00", "Europe/Berlin").format("X") * 1000,
      end: moment.tz("2015-03-30 13:00", "Europe/Berlin").format("X") * 1000,
      color: "rgba(116,186,255,0.7)",
      key: 3012,
      zIndex:3,
      layerId: 'resource1',
      eventType: 'taskEvent',
      timezone: 'Europe/Berlin'
    },
    {
      name: "Vacation",
      start: moment.tz("2015-03-30 00:00", "America/New_York").format("X") * 1000,
      end: moment.tz("2015-04-02 00:00", "America/New_York").format("X") * 1000,
      color: "rgba(116,186,255,0.7)",
      key: 3021,
      zIndex:3,
      layerId: 'resource2',
      eventType: 'taskEvent',
      timezone: 'America/New_York'
    },
    {
      name: "Doctor Assignment",
      start: moment.tz("2015-04-01 16:00", "America/New_York").format("X") * 1000,
      end: moment.tz("2015-04-01 17:15", "America/New_York").format("X") * 1000,
      color: "rgba(0,0,255,0.5)",
      key: 3022,
      zIndex:3,
      layerId: 'resource2',
      eventType: 'taskEvent',
      timezone: 'America/New_York'
    },
    
    //Projects
    {
      name: "Preparation",
      start: moment.tz("2015-04-03 10:45", "Europe/Berlin").format("X") * 1000,
      end: moment.tz("2015-04-03 11:00", "Europe/Berlin").format("X") * 1000,
      color: "rgba(20,30,200,0.7)",
      key: 4011,
      parentKey: 1,
      zIndex:4,
      layerId: 'resource1',
      eventType: 'projectEvent',
      timezone: 'Europe/Berlin'
    },
    {
      name: "Walk-Around",
      start: moment.tz("2015-04-03 11:00", "Europe/Berlin").format("X") * 1000,
      end: moment.tz("2015-04-03 12:00", "Europe/Berlin").format("X") * 1000,
      color: "rgba(200,0,120,0.7)",
      key: 4012,
      parentKey: 1,
      zIndex:4,
      layerId: 'resource1',
      eventType: 'projectEvent',
      timezone: 'Europe/Berlin'
    },
    {
      name: "Briefing",
      start: moment.tz("2015-04-01 07:00", "America/Bogota").format("X") * 1000,
      end: moment.tz("2015-04-01 07:30", "America/Bogota").format("X") * 1000,
      color: "rgba(0,150,200,0.7)",
      key: 4021,
      parentKey: 2,
      zIndex:4,
      layerId: 'resource2',
      eventType: 'projectEvent',
      timezone: 'America/Bogota'
    },
    {
      name: "Sim Training",
      start: moment.tz("2015-04-01 07:30", "America/Bogota").format("X") * 1000,
      end: moment.tz("2015-04-01 09:30", "America/Bogota").format("X") * 1000,
      color: "rgba(30,200,20,0.7)",
      key: 4022,
      parentKey: 2,
      zIndex:4,
      layerId: 'resource2',
      eventType: 'projectEvent',
      timezone: 'America/Bogota'
    },
    {
      name: "Debriefing",
      start: moment.tz("2015-04-01 09:45", "America/Bogota").format("X") * 1000,
      end: moment.tz("2015-04-01 10:00", "America/Bogota").format("X") * 1000,
      color: "rgba(0,150,200,0.7)",
      key: 4023,
      parentKey: 2,
      zIndex:4,
      layerId: 'resource2',
      eventType: 'projectEvent',
      timezone: 'America/Bogota'
    },
    {
      name: "Briefing",
      start: moment.tz("2015-04-02 07:00", "America/Bogota").format("X") * 1000,
      end: moment.tz("2015-04-02 07:30", "America/Bogota").format("X") * 1000,
      color: "rgba(0,150,200,0.7)",
      key: 4024,
      parentKey: 3,
      zIndex:4,
      layerId: 'resource2',
      eventType: 'projectEvent',
      timezone: 'America/Bogota'
    },
    {
      name: "Sim Training",
      start: moment.tz("2015-04-02 07:30", "America/Bogota").format("X") * 1000,
      end: moment.tz("2015-04-02 09:30", "America/Bogota").format("X") * 1000,
      color: "rgba(30,200,20,0.7)",
      key: 4025,
      parentKey: 3,
      zIndex:4,
      layerId: 'resource2',
      eventType: 'projectEvent',
      timezone: 'America/Bogota'
    },
    {
      name: "Debriefing",
      start: moment.tz("2015-04-02 09:45", "America/Bogota").format("X") * 1000,
      end: moment.tz("2015-04-02 10:00", "America/Bogota").format("X") * 1000,
      color: "rgba(0,150,200,0.7)",
      key: 4026,
      parentKey: 3,
      zIndex:4,
      layerId: 'resource2',
      eventType: 'projectEvent',
      timezone: 'America/Bogota'
    }
  ];
    
  var SampleApiInterface = ApiInterface.extend({
    
    latency: -1,

    init: function(latency) {
      this.latency = latency
    },

    getEvents : function(input) {
      setTimeout(function() {
        eventsInPeriod = [];
        for(var i = 0; i < events.length; i++)
          if(events[i].start < input.period.getEnd() && events[i].end > input.period.getStart())
            eventsInPeriod[eventsInPeriod.length] = events[i];
        
        input.success(eventsInPeriod);
      }, this.latency);      
    }
  });
  
  return SampleApiInterface;
});
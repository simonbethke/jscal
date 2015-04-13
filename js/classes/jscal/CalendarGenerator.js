define(["jquery", "class", "classes/jscal/JSCal", "classes/jscal/EventRenderer", "classes/jscal/TimeModel", "classes/jscal/LabelGenerator", "hogan"], 
    function($, Class, JSCal, EventRenderer, TimeModel, LabelGenerator, hogan) {

  var CalendarGenerator = Class.extend({
    events: null,
    controller: null,
    granularityMillis: null,
    renderers: null,
    /*
      {
        events: EventList,
        controller: VisiblePeriodControler,
        granularityMillis: 60000
      }
    */
    init: function(input){
      this.events = input.events;
      this.controller = input.controller;
      this.weekendDays = input.weekendDays;
      this.granularityMillis = input.granularityMillis;
      
      this.controller.registerEventList(this.events);
      
      this.renderers = [
        {
          renderer: EventRenderer,
          types: ["taskEvent"]
        }
      ];
    },
    
    calendarTemplate: " \
      <div class='jscal-wrapper'> \
        {{#top}} \
          <div class='labels top'></div> \
        {{/top}} \
        {{#left}} \
          <div class='labels left'></div> \
        {{/left}} \
        <div class='jscal'></div> \
      </div>",
    /*
      config = {
        target: jquery-node,
        timeModel: {
          horizontalEvents: false,
          gridMillis: 1000 * 60 * 60,
          splitDurationMillis : 1000 * 60 * 60 * 24
        },
        offset: factor,
        layers: ['holiday', 'event'],
        labels: {
          enable: {
            top: true,
            left: true
          },
          outterGrid:{
            dateProperty: "Hours"
          },
          outterSplit:{
            dateProperty: "Day",
            map: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          },
          inner:{
            dateProperty: "Date"
          }
        }
      }
    */
    generateCalendar: function(input){
      var config = this.addDefaultsToConfig(input);
      
      if(!this.compiledCalendarTemplate)
        this.compiledCalendarTemplate = hogan.compile(this.calendarTemplate);
      
      var domNodes = $(this.compiledCalendarTemplate.render(config.labels.enable));
      var calendarNode = domNodes.find(".jscal");
      if(config.labels.enable.left)
        calendarNode.addClass("hasLeftLabels");
      var calendar = new JSCal({
        rootNode: calendarNode,
        timeModel: new TimeModel(config.timeModel, this.controller.period)
      });      
      calendar.setLabels(this.createLabelConfig(config, domNodes));
      
      for(var i=0; i < this.renderers.length; i++){
        calendar.addEventRendererClass(
          this.renderers[i].renderer, 
          this.renderers[i].types);
      }
          
      this.controller.registerCalendar(calendar, config.offset);
      
      for(var l=0; l < config.layers.length; l++)
        this.events.getEventLayer(config.layers[l]).registerCalendar(calendar);
     
      config.target.append(domNodes);
      
      return calendar;
    },
    
    addDefaultsToConfig: function(input){
      var result = {
        target: input.target,
        timeModel: input.timeModel || {
          horizontalEvents: false,
          gridMillis: 1000 * 60 * 60,
          splitDurationMillis : 1000 * 60 * 60 * 24
        },
        offset: input.offset || 0,
        layers: input.layers || [],
        labels: input.labels || {
          enable: {
            top: true,
            left: true
          },
          outterGrid:{
            dateProperty: "Hours"
          },
          outterSplit:{
            dateProperty: "Day",
            map: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          },
          inner:{
            dateProperty: "Date"
          }
        }
      };
      return result;
    },
    
    createLabelConfig: function(config, domNodes){
      var labelConfig = {};
      
      if(config.labels.outterGrid)
        labelConfig.outterGrid = { label: new LabelGenerator(config.labels.outterGrid) };
      if(config.labels.outterSplit)
        labelConfig.outterSplit = { label: new LabelGenerator(config.labels.outterSplit) };
      if(config.labels.inner)
        labelConfig.inner = { label: new LabelGenerator(config.labels.inner) };
      if(config.labels.enable.top)
        labelConfig.topNode = domNodes.find(".labels.top");
      if(config.labels.enable.left)
        labelConfig.leftNode = domNodes.find(".labels.left");
      
      return labelConfig;
    }
  });
  return CalendarGenerator;
});



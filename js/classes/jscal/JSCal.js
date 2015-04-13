define(["jquery", "class", "classes/jscal/EventRenderer", "log"], 
    function($, Class, EventRenderer, log) {
  /*
   * Controls a calendar which is layouted by the given TimeModel.
   */
var JSCal = Class.extend({
  nodes: {},  
  timeModel: null,
  cellLabelSetup: null,
  eventRenderers: null,
  weekendDays: null,
  resourceKey: null,
  
  /*
   * data = { rootNodeId: [string] CSS id of the node in which the calendar gets
   * rendered mandatory
   * 
   * timeModel: [TimeModel] The timemodel which defines how this calendar is
   * going to be rendered mandatory }
   */
  
  init: function(data){
    this.nodes = {
      grid: $("<div class='grid'></div>")
    };
    
    if(data.rootNodeId)
      this.nodes.root = $("#" + data.rootNodeId);
    else if(data.rootNode)
      this.nodes.root = data.rootNode;
    
    this.weekendDays = data.weekendDays;
      
    this.nodes.root.append(this.nodes.grid);
    
    this.timeModel = data.timeModel;
    this.eventRenderers = {};
    this.cellLabelSetup = {};
    
    this.addEventRenderer(this.getDefaultEventRenderer(this), ["default"]);
    
    this.renderGrid();
    
    this.resourceKey = data.resourceKey; // new approach for multi resources
    
    log.info("JSCal has been initialized into DOM-Element with ID: " + data.rootNodeId);
  },
  
  getDefaultEventRenderer: function(cal) {
    return new EventRenderer(cal);
  },
  
  getResourceKey: function() {
    return this.resourceKey;
  },
  
  setPeriod: function(period){
    this.timeModel.setPeriod(period);
    this.render();
  },
  
  getPeriod: function(){
    return this.timeModel.get("period");
  },
  
  getInputPane: function(){
    if(!this.nodes.inputPane){
      this.nodes.inputPane = $("<div></div>");
      this.nodes.inputPane.css({
        width:"100%",
        height:"100%",
        top:0,
        left:0,
        zIndex:100,
        position:"absolute"
      });
      this.nodes.root.append(this.nodes.inputPane);
    }
    this.nodes.inputPane.css("display", "block");
    return this.nodes.inputPane;
  },
  
  disableInputPane: function(){
    this.nodes.inputPane.unbind();
    this.nodes.inputPane.css("display", "none");
  },
  
  addEventRenderer: function(renderer, eventTypes){
    for(var i = 0; i < eventTypes.length; i++){
      this.eventRenderers[eventTypes[i]] = renderer;
    }
  },
  
  addEventRendererClass: function(RendererClass, eventTypes){
    var renderer = new RendererClass(this);
    this.addEventRenderer(renderer, eventTypes);
  },
    
  renderEvent: function(event){
    if(event.get("eventType") && this.eventRenderers[event.get("eventType")])
      this.eventRenderers[event.get("eventType")].render(event);
    else
      this.eventRenderers.default.render(event);
  },
  
  render: function(){
    this.renderGrid();
    this.renderOutterLabels(true);
    this.renderOutterLabels(false);
    
    this.nodes.root.find(".event").each(function(index, node){node.remove();});
  },
  
  renderGrid: function(){
    this.nodes.root.addClass(this.timeModel.get("horizontalEvents") ? "eventsHorizontal" : "eventsVertical");
  
    var splitCount = this.timeModel.getSplitCount();
    var gridCount = this.timeModel.getGridCount();
    
    this.nodes.grid.empty();
    
    var time = this.timeModel.get("period").getStart();
    
    
    for(var s = 0; s < splitCount; s++){
      for(var g = 0; g < gridCount; g++){        
        var isWeekend = false; 
		if (this.weekendDays != null) {
			isWeekend = this.weekendDays[new Date(time).getUTCDay()];
		}
       
        var newNode;
        if(this.cellLabelSetup && this.cellLabelSetup.inner && this.cellLabelSetup.inner.label)
          newNode = this.createCellNode(this.cellLabelSetup.inner.label.generate(time), isWeekend, time);
        else
          newNode = this.createCellNode("", isWeekend, time);
          
        if(this.timeModel.get("horizontalEvents")){
          newNode.css({
            position: "absolute",
            left: (g / gridCount * 100) + "%",
            top: (s / splitCount * 100) + "%",
            width: (1 / gridCount * 100) + "%",
            height: (1 / splitCount * 100) + "%"
          });
          
        }
        else{
          newNode.css({
            position: "absolute",
            left: (s / splitCount * 100) + "%",
            top: (g / gridCount * 100) + "%",            
            width: (1 / splitCount * 100) + "%",
            height: (1 / gridCount * 100) + "%"            
          });
          
        }
        this.nodes.grid.append(newNode);
        
        time += this.timeModel.get("gridMillis");
      }
    }
  },
  
  pageXYToTime: function(pageXY){
    var x = (pageXY.pageX - this.nodes.root.offset().left) / this.nodes.root.width();
    var y = (pageXY.pageY - this.nodes.root.offset().top) / this.nodes.root.height();
    
    return this.timeModel.snapTime(this.timeModel.getTimeForPosition(x, y));
  },
  
  setLabels: function(cellLabelSetup){
    this.cellLabelSetup = cellLabelSetup;
    if(cellLabelSetup.inner){
      this.renderGrid();
    }
    if(cellLabelSetup.outterGrid){      
      this.renderOutterLabels(true);
    }
    if(cellLabelSetup.outterSplit){      
      this.renderOutterLabels(false);
    }
  },
  
  renderOutterLabels: function(isGrid){
    if(!this.cellLabelSetup) return;
    if(isGrid && !this.cellLabelSetup.outterGrid) return;
    if(!isGrid && !this.cellLabelSetup.outterSplit) return;
    
    if(this.cellLabelSetup.topNodeId)
      this.cellLabelSetup.topNode = $("#" + this.cellLabelSetup.topNodeId);
    if(this.cellLabelSetup.leftNodeId)
      this.cellLabelSetup.leftNode = $("#" + this.cellLabelSetup.leftNodeId);
    
    var isHorizontal = this.timeModel.get("horizontalEvents");
    var splitDuration = this.timeModel.get("splitDuration");
    var timeModelPeriod = this.timeModel.get("period");
    var gridMillis = this.timeModel.get("gridMillis");
    
    var target;
    if(isHorizontal == isGrid)
      target = this.cellLabelSetup.topNode;
    else
      target = this.cellLabelSetup.leftNode;
    if(target.length == 0) return;
    
    target.empty();
    target.css("position", "relative");
    
    var time = timeModelPeriod.getStart();
    var timeIncrement = isGrid ? gridMillis : splitDuration;
    var labelCount = isGrid ? 
      splitDuration / timeIncrement : 
      timeModelPeriod.getDuration() / timeIncrement;
      
    var gridSizeInPercent = 100 / splitDuration * gridMillis;
    var splitSizeInPercent = 100 / timeModelPeriod.getDuration() * splitDuration;
    
    
    for(var i = 0; i < labelCount; i++){
      var newLabel = (isGrid) ? 
        this.createCellNode(this.cellLabelSetup.outterGrid.label.generate(time)) :
        this.createCellNode(this.cellLabelSetup.outterSplit.label.generate(time));
      
      if(isHorizontal == isGrid)
        newLabel.css({
          position: "absolute",
          left: (i / labelCount * 100) + "%",
          top: 0,
          width: (isGrid ? splitSizeInPercent : gridSizeInPercent) + "%"
        });
      else
        newLabel.css({
          position: "absolute",
          left: 0,
          top: (i / labelCount * 100) + "%"    ,
          height: (isGrid ? gridSizeInPercent : splitSizeInPercent) + "%"
        });
      
      target.append(newLabel);
        
      time += timeIncrement;
    }
  },

  createCellNode: function(content, isWeekend, time){
    // TODO: When removing the Xed attributes, also remove this time-parameter
    if(time != undefined) {
      var cellNode = $("<div xdata-resource-key='" + this.resourceKey + "' xdata-jcal-timestamp='" + time + "' class='cell clickable'></div>");
    } else {
      var cellNode = $("<div xdata-resource-key='" + this.resourceKey + "' xdata-jcal-timestamp='" + time + "' class='cell'></div>");
    }
  
	
  	if(isWeekend)
  	  cellNode.addClass("weekend");
  	  
  	if(typeof content == "string") {
  	  cellNode.append(content); // TODO review this logic
  	// cellNode.text(content);
    } else {
  	  cellNode.append(content); 
  	}
  	
  	  
  	return cellNode;
  }
});
  return JSCal;
});
define(
    [ "jquery", "class" ],
    function($, Class) {
      /*
       * The event renderer class is used to draw events to its calendar.
       * Because a rendered event can contain an unknown number of controls, all
       * input event handlers have to be initialized in this renderer.
       */
      var EventRenderer = Class
          .extend({

            init : function(calendar) {
              var data = {
                timemodel: calendar.timeModel,
                targetNode: calendar.nodes.root,
                marginPixel: 12,
                marginPercent: null
              };
              
              this.get = function(field){
                return data[field];
              };
              
              this.set = function(field, value){
                return data[field] = value;
              };
            },

            getMargin : function(){
              if(this.get("marginPercent") == null){
                var marginPixel = this.get("marginPixel");
                var targetNode = this.get("targetNode");
                this.set("marginPercent", {
                  width : marginPixel / targetNode.width(),
                  height : marginPixel / targetNode.height()
                });
              }
              return this.get("marginPercent");
            },       

            render : function(event) {
              var boxData = this.get("timemodel").getBoxes(event.get("period"));
              var className = "key" + event.get("key");
              var targetNode = this.get("targetNode");
              
              var node = $("<div class='event " + className + "'>" + event.get("name") + "</div>");

              targetNode.find("." + className).each(
                function(i, oldNode) {
                  $(oldNode).remove();
                });
              
              for (var i = 0; i < boxData.positions.length; i++) {
                var boxPos = boxData.positions[i];
                this.calculateParallelPosition(boxPos, event);

                var boxNode = node.clone();
                boxNode.css({
                  position : "absolute",
                  left : (boxPos.x * 100) + "%",
                  top : (boxPos.y * 100) + "%",
                  width : (boxPos.width * 100) + "%",
                  height : (boxPos.height * 100) + "%",
                  backgroundColor : event.get("color"),
                  zIndex : event.get("zIndex")
                });
                if (boxData.positions.length == 1 && !boxData.cut.start
                    && !boxData.cut.end) {
                  boxNode.addClass("fullCap");
                } else if (i == 0 && !boxData.cut.start) {
                  boxNode.addClass("startCap");
                } else if (i == boxData.positions.length - 1
                    && !boxData.cut.end) {
                  boxNode.addClass("endCap");
                } else {
                  boxNode.addClass("noCap");
                }
                var isEndOfEvent = (i == boxData.positions.length - 1 && !boxData.cut.end);
                this.extendBoxNode(event, boxNode, isEndOfEvent);

                targetNode.append(boxNode);
              }
            },

            extendBoxNode : function(event, boxNode, isEndOfEvent) {
              // extension point
            },
            
            calculateParallelPosition : function(boxPos, event) {
              if(this.get("timemodel").get("horizontalEvents")) {
                boxPos.height -= this.getMargin().height;
                boxPos.height /= event.get("parallel").count;
                boxPos.y += this.getMargin().height + boxPos.height * event.get("parallel").index;
              }
              else {
                boxPos.width -= this.getMargin().width;
                boxPos.width /= event.get("parallel").count;
                boxPos.x += this.getMargin().width + boxPos.width * event.get("parallel").index;
              }
            }
          });
      return EventRenderer;
    });
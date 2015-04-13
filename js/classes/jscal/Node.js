define(["class"], function(Class) {
  var Node = Class.extend({
    init : function() {
      var treeData = {
        parent: null,
        children: []
      };
      
      this.treeGet = function(property){
        return treeData[property];
      };
      
      this.treeSet = function(property, value){
        treeData[property] = value;
      }
    },
    
    setParent: function(node){
      if(node == this)
        this.treeSet("parent", null);
      else{
        this.treeSet("parent", node);
        if(node != null)
          this.addChild(this);
        else
          this.removeChild(node, true);
      }
    },
    
    getParent: function(){
      return this.treeGet("parent");
    },
    
    addChild: function(node){
      if(node == this)
        this.treeGet("parent").treeGet("children").push(this);
      else
        node.setParent(this);
    },
    
    removeChild: function(node, sameInstance){
      var children = this.treeGet("children");
      var i = 0;
      if(sameObjInstance) 
        while(i < children.length && children[i] != node) i++;
      else 
        while(i < children.length && !children[i].equals(node)) i++;
        
      if(i < children.length){
        children.splice(i, 1);
        node.setParent(node);
      }
    },
    
    getChild: function(index){
      return this.treeGet("children")[index];
    },
    
    getChildCount: function(){
      return this.treeGet("children").length;
    },
    
    forEach: function(method){
      for(var i = 0; i < this.getChildCount(); i++)
        method(this.getChild(i));
    }
  });
  return Node;
});

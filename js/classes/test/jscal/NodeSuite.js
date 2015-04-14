define([],
function(){
  return {
    run: function(NodeClass, assert){
     
      var nodes = [];
      for(var i = 0; i < 3; i++)
        nodes[i] = new NodeClass();
         
      assert.equal(nodes[1].getParent(), null, "Test getParent() without parent");
      
      nodes[1].setParent(nodes[0]);
      assert.equal(nodes[1].getParent(), nodes[0], "Test setParent() and getParent() with parent");      
      assert.equal(nodes[0].getChild(0), nodes[1], "Test getChild() after indirect population");
      assert.equal(nodes[0].getChildCount(), 1, "Test getChildCount() result");
      
      nodes[0].removeChild(nodes[1], true);
      assert.equal(nodes[0].getChildCount(), 0, "Test removeChild() result");
      assert.equal(nodes[1].getParent(), null, "Test getParent() after indirect detachment");
      
      nodes[0].addChild(nodes[1]);
      assert.equal(nodes[1].getParent(), nodes[0], "Test addChild() ");      
      assert.equal(nodes[0].getChild(0), nodes[1], "Test getChild() after indirect parent attachment");
      
      nodes[1].setParent(null);
      assert.equal(nodes[1].getParent(), null, "Test setParent(null)");
      assert.equal(nodes[0].getChildCount(), 0, "Test getChildCount() after indirect detachment of one of its childnodes");
      
      nodes[0].addChild(nodes[1]);
      nodes[0].addChild(nodes[2]);
      nodes[0].forEach(function(node){node.check = true});
      
      assert.ok(
        !nodes[0].check && nodes[1].check && nodes[2].check, 
        "Test forEach() with two children");
    }
  };
});
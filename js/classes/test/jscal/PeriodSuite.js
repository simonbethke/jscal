define([],
function(){
  return {
    run: function(PeriodClass, assert){
      var a = new Date().getTime() - this.randomMillis();
      var b = a + this.randomMillis();
      var c = b + this.randomMillis();
      
      var ab = b - a;
      var bc = c - b;
      var d = c + ab;
      var cd = d - c;
      var ad = d - a;
      
      var period = new PeriodClass({ // b c
        start: b,
        end: c
      });
      assert.equal(period.getDuration(), bc, "Testing the Constructor and getDuration() method");
      
      period.setStart(a); // a c
      assert.equal(period.getStart(), a, "Testing the setStart() and getStart() method");
      period.setEnd(d); // a d
      assert.equal(period.getEnd(), d, "Testing the setEnd() and getEnd() method");
      assert.equal(period.getDuration(), ad, "Testing the lazy getDuration() method");
      
      period.setEnd(c); // a c
      period.shift(ab); // b d
      assert.ok(this.hasSameValues(period, b, d), "Testing the shift() method");
      
      var periodClone = period.clone(); // b d
      assert.ok(this.hasSameValues(periodClone, b, d), "Testing the result values of the clone() method");
      
      assert.ok(periodClone.equals(period), "Positive equals() method test");
      
      period.shift(ab * -1); // a c
      assert.ok(this.hasSameValues(periodClone, b, d), "Testing the individuality of the clone() method result");
      
      assert.notOk(periodClone.equals(period), "Negative equals() method test");
      
      period.offset(0, ab); // a d
      assert.ok(this.hasSameValues(period, a, d), "Testing offset() with right-side change");
      
      period.offset(ab, 0); // b d
      assert.ok(this.hasSameValues(period, b, d), "Testing offset() with left-side change");
      
      period.setStart(a); // a d
      var cuts = {};
      
      assert.ok(this.hasSameValues(period.clone().cage(period.clone().offset(ab, 0), cuts), b, d), "Testing cage() left-cut values");
      assert.ok(cuts.start && !cuts.end, "Testing cage() left-cut hints");
      
      assert.ok(this.hasSameValues(period.clone().cage(period.clone().offset(0, ab * -1), cuts), a, c), "Testing cage() right-cut values");
      assert.ok(!cuts.start && cuts.end, "Testing cage() right-cut hints");
      
      assert.ok(this.hasSameValues(period.clone().cage(period.clone().offset(0, 0), cuts), a, d), "Testing cage() no-cut values");
      assert.ok(!cuts.start && !cuts.end, "Testing cage() no-cut hints");
      
      assert.ok(this.hasSameValues(period.clone().cage(period.clone().offset(ab, ab * -1), cuts), b, c), "Testing cage() both-cut values");
      assert.ok(cuts.start && cuts.end, "Testing cage() both-cut hints");
    },
    
    randomMillis: function(){
      return Math.abs(Math.random() * 1000 * 60 * 60 * 24 * 7);
    },
    
    hasSameValues: function(period, start, end){
      return period.getStart() == start && period.getEnd() == end
    }
  };
});
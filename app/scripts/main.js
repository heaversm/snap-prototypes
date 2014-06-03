var mainModule = {
  s: Snap("#svg"),
  drawingConfig: {
    circles: {
      amount: 20,
      sizeMin: 10,
      sizeMax: 20,
      proximity: 100,
      circleGroup: null,
      circleArray: [],
      animTime: 2000
    },
    canvas: {
      width: 800,
      height: 600
    }
  },

  init: function(){
    //this.sizeCanvas();
    this.makeCircles();
  },

  sizeCanvas: function(){
    $('#svg').width(800).height(600);
  },

  makeCircles: function(){
    this.drawingConfig.circles.circleGroup = this.s.g();

    for (var i=0; i<this.drawingConfig.circles.amount;i++){
      var circleX = this.randomNumber(0, this.drawingConfig.canvas.width);
      var circleY = this.randomNumber(0, this.drawingConfig.canvas.height);
      var circleRadius = this.randomNumber(this.drawingConfig.circles.sizeMin,this.drawingConfig.circles.sizeMax);
      var circleFill = '#'+Math.floor(Math.random()*16777215).toString(16);
      var circleShape = this.s.circle(circleX, circleY, circleRadius);
      circleShape.attr({
        fill: circleFill
      });
      this.drawingConfig.circles.circleGroup.add(circleShape);
      this.drawingConfig.circles.circleArray.push(circleShape);

      this.animateSingle(circleShape);

      /*if (i ==0){
        this.animateSingle(circleShape);
      } else {
        //this.animateCircle(circleShape);
      }*/
    }


  },

  randomNumber: function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  },

  getBounds: function(shape){
    shapeBox = shape.node.getBoundingClientRect();
  },

  animateSingle: function(shape){
    var startX = shape.node.cx.baseVal.value;
    var startY = shape.node.cy.baseVal.value;
    var animX = this.randomNumber(0, this.drawingConfig.canvas.width);
    var animY = this.randomNumber(0, this.drawingConfig.canvas.height);
    var animTime = (this.randomNumber(1,10))*100;



    Snap.animate(startX, animX, function (val) {

      var lines = Snap.selectAll('line');
      lines.remove();

      shape.attr({
          cx: val
      });

      var circles = mainModule.drawingConfig.circles.circleArray;
      var thisCircleX = shape.node.cx.baseVal.value;


      for (var i=0;i<circles.length;i++){
        var nextCircle = circles[i].node;
        var nextCircleX = nextCircle.cx.baseVal.value;
        var distance = Math.abs(nextCircleX-thisCircleX);
        var proximity = mainModule.drawingConfig.circles.proximity;
        if (distance < proximity){

          var nextCircleY = nextCircle.cy.baseVal.value;
          var thisCircleY = shape.node.cy.baseVal.value;
          var distanceY = Math.abs(nextCircleY - thisCircleY);
          if (distanceY < proximity){

            var line = mainModule.s.line(thisCircleX, thisCircleY, nextCircleX, nextCircleY).attr({stroke: '#a6a8ab', strokeWidth: '1px'});
            mainModule.drawingConfig.circles.circleGroup.add(line);
          }
        }
      }

    }, mainModule.drawingConfig.circles.animTime);

    Snap.animate(startY, animY, function (val) {
      shape.attr({
          cy: val
      });
    }, mainModule.drawingConfig.circles.animTime, function(){
      mainModule.animateSingle(shape);
    });
  },

  animateCircle: function(shape){
    var animProps = { cx: this.randomNumber(0, this.drawingConfig.canvas.width), cy: this.randomNumber(0, this.drawingConfig.canvas.height) };
    var animTime = (this.randomNumber(1,10))*100;
    shape.animate(animProps, animTime, function() {
      mainModule.animateCircle(this);
    });

  }

}

mainModule.init();


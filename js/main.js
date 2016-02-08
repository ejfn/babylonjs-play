/* global BABYLON */
/* global Scene */

'use strict';

var Main = {};

Main.load = function() {
  window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    // create Scene Object
    var sc = new Scene(engine);

    sc.createGround();
    sc.createSpheres(15);
    // Render loop
    engine.runRenderLoop(function() {
      sc.render();
    });

    // Resize
    window.addEventListener('resize', function() {
      engine.resize();
    });

    window.addEventListener('click', function() {
      sc.createSpheres(5);
    });
  });
};

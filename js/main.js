/* global Scene */
/* global BABYLON */

var Main = (function() {
  'use strict';

  var main = {};

  main.load = function() {
    window.addEventListener('DOMContentLoaded', function() {
      var canvas = document.getElementById('renderCanvas');
      var engine = new BABYLON.Engine(canvas, true);

      // create Scene Object
      var sc = new Scene();
      sc.init(engine);
      sc.createGround();
      sc.createSpheres(16);
      // Render loop
      engine.runRenderLoop(function() {
        sc.render();
      });

      // Resize
      window.addEventListener('resize', function() {
        engine.resize();
      });

      window.addEventListener('click', function() {
        sc.createSpheres(4);
      });
    });
  };

  return main;
})();

exports = Main;

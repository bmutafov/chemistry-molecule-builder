let graph = new joint.dia.Graph;

let paper = new joint.dia.Paper({
  el: document.getElementById('myholder'),
  model: graph,
  width: 500,
  height: 500,
  gridSize: 1,
  interactive: (cell, method) => {
    return cell.model.attributes.type !== 'standard.Rectangle';
  }
});

let elementsBox = new joint.shapes.standard.Rectangle();
elementsBox.resize(500, 100);
elementsBox.position(0, 400);
elementsBox.attr({
  body: {
    fill: '#cccccc',
  },
  label: {
    text: 'Available elements',
    fill: 'black',
    refY: 10,
    refX: 60,
  }
});
elementsBox.addTo(graph);

let oxygen = new joint.shapes.standard.Circle();
oxygen.resize(60, 60);
oxygen.position(100, 420);
oxygen.attr({
  body: {
    fill: 'red',
    stroke: 'none'
  },
  label: {
    text: 'O',
    fill: 'white'
  }
});
oxygen.addTo(graph);

let hydrogen = oxygen.clone();
hydrogen.attr({
  body: { fill: 'orange' },
  label: { text: 'H' },
});
hydrogen.position(340, 420);
hydrogen.addTo(graph);

let startingElementsIds = graph.getCells().map(el => el.cid);

var removeButton = new joint.elementTools.Remove({
  focusOpacity: 0.5,
  rotate: true,
  // top-mid
  x: '50%',
  y: '0%',
  offset: { x: 10, y: 10 }
});

paper.on({

  'cell:pointerdblclick': element => {
    console.log('triggered', element);
    element.model.remove();
  },

  'element:pointerdown': function (elementView, evt) {
    let isMovable_index = startingElementsIds.indexOf(elementView.model.cid);
    if (isMovable_index > -1) {
      let newO = elementView.model.clone();
      newO.addTo(graph);
      startingElementsIds[isMovable_index] = newO.cid;
    }

    evt.data = elementView.model.position();
  },

  'element:pointerup': function (elementView, evt, x, y) {

    if (y > 420) return;

    var coordinates = new g.Point(x, y);
    var elementAbove = elementView.model;
    var elementBelow = this.model.findModelsFromPoint(coordinates).find(function (el) {
      return (el.id !== elementAbove.id);
    });

    // If the two elements are connected already, don't
    // connect them again (this is application-specific though).
    if (elementBelow && graph.getNeighbors(elementBelow).indexOf(elementAbove) === -1) {

      // Move the element to the position before dragging.
      if (evt.data.y > 400) {
        evt.data = {
          x: 150 + Math.floor(Math.random() * 150),
          y: 150 + Math.floor(Math.random() * 150),
        }
      }
      elementAbove.position(evt.data.x, evt.data.y);

      // Create a connection between elements.
      var link = new joint.shapes.standard.Link();
      link.attr({
        line: {
          targetMarker: {
            type: 'none',
          }
        }
      })
      link.source(elementAbove);
      link.target(elementBelow);
      link.addTo(graph);

    }
  }
});
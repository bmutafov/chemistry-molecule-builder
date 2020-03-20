(function (joint, Rough, g, V) {
  function isBaseElement(element) {
    return baseElements.findIndex(e => e.cid === element);
  }

  var WIDTH = 800;
  var HEIGHT = 800;

  var graph = new joint.dia.Graph;

  var paper = new joint.dia.Paper({
    el: document.getElementById('myholder'),
    width: WIDTH,
    height: HEIGHT,
    gridSize: 1,
    model: graph,
    clickThreshold: 5,
    async: true,
    sorting: joint.dia.Paper.sorting.APPROX,
    connectionStrategy: joint.connectionStrategies.pinAbsolute,
    defaultConnectionPoint: { name: 'boundary', args: { selector: 'border' } },
    defaultLink: function () {
      let link = new RoughLink();
      link.set('isModifiable', true);
      return link;

    },
    validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
      return isBaseElement(cellViewT.model.cid) === -1
    },
    validateMagnet: function (_view, magnet, evt) {
      return magnet.getAttribute('magnet') === 'on-shift' && evt.shiftKey && isBaseElement(_view.model.cid) === -1;
    },
    interactive: cellView => {
      return cellView.model.get('isModifiable');
    }
  });

  var rough = Rough.svg(paper.svg);
  var padding = 4;
  var borderEl = rough.rectangle(padding, padding, WIDTH - 2 * padding, HEIGHT - 2 * padding);
  paper.svg.appendChild(borderEl);
  paper.rough = rough;

  paper.on({
    'link:mouseenter': function (linkView) {
      linkView.addTools(new joint.dia.ToolsView({
        tools: [
          new joint.linkTools.Vertices({ snapRadius: 0 }),
          new joint.linkTools.SourceArrowhead(),
          new joint.linkTools.TargetArrowhead(),
          new joint.linkTools.Remove({
            distance: 20
          })
        ]
      }));
    },
    'element:pointerdown': function (elementView) {
      // console.log(baseElements);
      let baseElementIndex = isBaseElement(elementView.model.cid);
      if (baseElementIndex > -1 && elementView.model.get('isModifiable')) {
        let newO = elementView.model.clone();
        newO.addTo(graph);
        baseElements[baseElementIndex].cid = newO.cid;
        baseElements[baseElementIndex].id = newO.id;
      }
    },
    'element:mouseenter': function (elementView) {
      var model = elementView.model;
      var bbox = model.getBBox();
      var ellipseRadius = (1 - Math.cos(g.toRad(45)));
      var offset = model.attr(['pointers', 'pointerShape']) === 'ellipse'
        ? { x: -ellipseRadius * bbox.width / 2, y: ellipseRadius * bbox.height / 2 }
        : { x: -3, y: 3 };

      let baseElementIndex = isBaseElement(elementView.model.cid);
      if (baseElementIndex === -1) {
        elementView.addTools(new joint.dia.ToolsView({
          tools: [
            new joint.elementTools.Remove({
              useModelGeometry: true,
              y: '0%',
              x: '100%',
              offset: offset
            })
          ]
        }));
      }
    },
    'cell:mouseleave': function (cellView) {
      cellView.removeTools();
    },

  });

  // Elements
  var o = new Oxygen();
  var h = new Hydrogen();
  var c = new Carbon();
  var he = new Helium();
  var elHolder = new ElementHolder();

  var unmovableElements = [elHolder];

  var baseElements;
  function addElements(elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].position((20 + i * 100), 60);
    }
    graph.resetCells(unmovableElements.concat(elements));
    baseElements = graph.getCells().map(el => { return { cid: el.cid, id: el.id } });
  }

  addElements([o, h, c, he]);



  $('#submit').click(e => {
    let res = check('h2o', graph.toJSON(), baseElements);
    let current = res ? 'correct' : 'incorrect';
    let other = res ? 'incorrect' : 'correct';
    $('.result-box .result').removeClass(other).addClass(current).html(current);
    if (res) {
      $('body').html('<h5>Correct! Please answer <a href="https://forms.gle/YTqWUhi3s4r2gMPw7">these questions</a> so we can improve the user experience! </h5> <h5><a href="https://forms.gle/YTqWUhi3s4r2gMPw7"> https://forms.gle/YTqWUhi3s4r2gMPw7 </a></h5>')
    }
  });

  $('#clear').click(e => {
    graph.clear();
    addElements([o, h, c, he]);
  })



})(joint, rough, g, V);
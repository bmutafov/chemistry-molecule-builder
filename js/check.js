let formulas = {
  h2o: [
    { base: 'H', connections: [{ type: 1, el: 'O' }] },
    { base: 'H', connections: [{ type: 1, el: 'O' }] },
    { base: 'O', connections: [{ type: 1, el: 'H' }, { type: 1, el: 'H' }] },
  ]
};

function check(formula, graph, baseElements) {


  console.log(graph);
  let links = graph.cells.filter(cell => cell.type === 'rough.Link');
  let nodes = graph.cells.filter(cell => cell.type === 'rough.Rectangle' && !baseElements.map(e => e.id).includes(cell.id));
  console.log(links, nodes);

  isLinkValid = link => {
    return nodes.some(node => node.id === link.source.id) &&
      nodes.some(node => node.id === link.target.id)
  }

  if (!links.every(link => isLinkValid(link))) return false;
  let elementNodes = nodes.map(node => {
    return {
      id: node.id,
      base: node.attrs.label.text,
      connections: [],
    }
  });

  elementNodes.forEach(el => {
    let connections = links.filter(link => link.target.id === el.id || link.source.id === el.id);
    connections = connections.map(conn => conn.source.id === el.id ? conn.target.id : conn.source.id);
    let uniqueConnections = connections.filter((v, i, s) => s.indexOf(v) === i);
    for (let i = 0; i < uniqueConnections.length; i++) {
      let countOfConnections = connections.filter(conn => conn === uniqueConnections[i]).length;
      el.connections.push({ type: countOfConnections, el: elementNodes.find(elNode => elNode.id === uniqueConnections[i]).base });
    }
  });

  elementNodes.forEach(el => delete el.id);
  return isArrayEqual(elementNodes, formulas[formula]);
}

var isArrayEqual = function (x, y) {
  return _(x).xorWith(y, _.isEqual).isEmpty();
};
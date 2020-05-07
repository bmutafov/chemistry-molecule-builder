// const parseGraph = graph => {
//     console.log(graph);
//     const links = graph.cells.filter(cell => cell.type === 'rough.Link');
//     const nodes = graph.cells.filter(
//         cell => cell.type === 'rough.Rectangle' && cell.deleteable
//     );

//     // const molecule = [];
//     for (let node of nodes) {
//         const linksWithNodeSource = links.filter(
//             link => link.source.id === node.id
//         );
//         const obj = {
//             base: node.nodeInfo.element.sign,
//             connections: [],
//         };
//         for (let source in linksWithNodeSource) {
//             const targetElement = nodes.filter(n => n.id === source.target.id);
//             obj.connections.filter({ el: targetElement });
//         }
//     }

//     console.log(links, nodes);
// };

const parseGraph = graph => {
    let links = graph.cells.filter(cell => cell.type === 'rough.Link');
    let nodes = graph.cells.filter(
        cell => cell.type === 'rough.Rectangle' && cell.deleteable
    );

    const isLinkValid = link =>
        nodes.some(node => node.id === link.source.id) &&
        nodes.some(node => node.id === link.target.id);

    if (!links.every(link => isLinkValid(link))) return false;
    const elementNodes = nodes.map(node => {
        console.log(node);
        return {
            id: node.id,
            el: node.nodeInfo.element.sign,
            connections: [],
        };
    });

    for (const element of elementNodes) {
        const connections = links
            .filter(
                link =>
                    link.target.id === element.id ||
                    link.source.id === element.id
            )
            .map(conn =>
                conn.source.id === element.id ? conn.target.id : conn.source.id
            );
        for (let i = 0; i < connections.length; i++) {
            const countOfConnections = connections.filter(
                conn => conn === connections[i]
            ).length;

            const { el } = elementNodes.find(
                elNode => elNode.id === connections[i]
            );

            const existInConnections = element.connections.findIndex(
                e => e.el === el
            );
            if (existInConnections > -1) {
                connections[existInConnections].valency++;
            } else {
                element.connections.push({
                    valency: countOfConnections,
                    el,
                });
            }
        }
    }

    elementNodes.forEach(el => delete el.id);

    return elementNodes;
};

module.exports = parseGraph;

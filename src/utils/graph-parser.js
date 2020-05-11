const parseGraph = graph => {
    /*
        Separates the links and nodes into separate consts.
        For nodes cell.deleteable is used to exclude elements other than 
        the ones used for the solution 
    */
    const links = graph.cells.filter(cell => cell.type === 'rough.Link');
    // prettier-ignore
    const nodes = graph.cells.filter(cell => cell.type === 'rough.Rectangle' && cell.deleteable);

    /*  
        Validate that the link starts and ends with a valid node.
        We try to invalidate and delete links during creation but
        this is safety net
    */
    const isLinkValid = link =>
        nodes.some(node => node.id === link.source.id) &&
        nodes.some(node => node.id === link.target.id);

    if (!links.every(isLinkValid)) return false;

    /* 
        Creates the structure for every node that the solution uses
    */
    const elementNodes = nodes.map(node => ({
        id: node.id,
        el: node.nodeInfo.element.sign,
        connections: [],
    }));

    for (const element of elementNodes) {
        /*
            Get all links where the current element is either a target or source of the link
            The const should contain the id's of the connected elements to the current iterated
            element
        */
        const connections = links
            .filter(
                link =>
                    link.target.id === element.id ||
                    link.source.id === element.id
            )
            .map(conn => ({
                iterated: false,
                id:
                    conn.source.id === element.id
                        ? conn.target.id
                        : conn.source.id,
            }));

        /*
            Iterates through all connections to the current node
        */
        for (const connection of connections) {
            /*
                Check if we already iterated over another connection
                between the same elements
            */
            const sameElementConnections = connections.filter(
                conn => conn.id === connection.id
            );

            if (sameElementConnections.some(conn => conn.iterated)) continue;

            /*
                valency = how many links between the two elements
            */
            const valency = sameElementConnections.length;

            /*
                Find what elemnent is the connected one
            */
            const { el } = elementNodes.find(
                elementNode => elementNode.id === connection.id
            );

            /*
                Push element to the array of connections
                Set a flag that we already iterated that connection
            */
            element.connections.push({
                valency,
                el,
            });

            connection.iterated = true;
        }
    }

    /*
        Remove irrelevant infomration for the server and return
    */
    elementNodes.forEach(el => delete el.id);

    return elementNodes;
};

export default parseGraph;

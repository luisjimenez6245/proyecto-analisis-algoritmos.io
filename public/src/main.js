/*
 *   node -> {
     id: 'n0'
     oid
 }

 vertice ->{
    id : 'v0',
    connects : ['n0', 'n1'],
    val : 0
 }
*/

let testNodes = createNodes(4)

let testVertices = createVertices(testNodes)

let nodes = 5
var cy;

function initializeProject() {
    cy = cytoscape({
        container: document.getElementById('cy'),
        style: [{
                "selector": "node[label]",
                "style": {
                    "label": "data(label)"
                }
            },
            {
                "selector": "edge",
                "style": {
                    'curve-style': 'bezier',
                    'width': 4,
                    'line-color': '#ddd',
                    'target-arrow-color': '#ddd'
                }
            },

            {
                "selector": "node",
                "style": {
                    'content': 'data(id)'
                }
            },

            {
                "selector": "edge[label]",
                "style": {
                    "label": "data(label)",
                    "width": 3
                }
            },
            {
                "selector": ".background",
                "style": {
                    "text-background-opacity": 1,
                    "color": "#fff",
                    "text-background-color": "#000",
                    "text-background-shape": "roundrectangle",
                    "text-border-color": "#000",
                    "text-border-width": 1,
                    "text-border-opacity": 1
                }
            },
            {
                "selector": ".highlighted",
                "style": {
                    'background-color': '#001B48',
                    'line-color': '#018ABE',
                    'target-arrow-color': '#61bffc',
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            },
        ],
        layout: {

        }
    });
}

function createVertices(nodes = []) {
    let result = []
    let vertices = []
    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            vertices.push([nodes[i].id, nodes[j].id]);
        }
    }
    vertices.map((item, id) => {
        result.push({
            id: `v${id}`,
            connects: item,
            weight: getRandomInt(1, 10)
        })
    })
    return result
}

function createNodes(len = 5) {
    let result = []
    for (let i = 0; i < len; ++i) {
        result.push({
            id: `n${i}`
        })
    }
    return result
}


function setNodeNumber() {
    nodes = $("#nodeNumber").val()
    if (nodes < 20) {
        changeModalState('config-modal');
        resetPanel()
        let n = createNodes(nodes)
        let v = createVertices(n)
        cy.add(getDrawElements(n, v))
        prismAlgorimth(n, v)
        return
    }
    alert("Son demasidos nodos, saludos")
}

function resetPanel() {
    cy.destroy();
    initializeProject();
}


function getDrawElements(nodes, vertices) {
    const height = $("#cy").height() - 100;
    const width = $("#cy").width() - 100;
    let result = []
    nodes.map((item) => {
        result.push({
            group: 'nodes',
            data: item,
            position: {
                x: getRandomInt(100, width),
                y: getRandomInt(100, height)
            }
        }, )
    });
    vertices.map((item) => {
        result.push({
            group: 'edges',
            data: {
                id: item.id,
                source: item.connects[0],
                target: item.connects[1],
                label: `${item.weight}`

            },
            classes: 'background'
        })
    })
    return result
}

function searchOnElement(elements = [], id) {
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i].id == id) {
            return Object.assign({}, elements[i]);
        }
    }
}


function removeFromArray(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array
}

function selectItem(node) {
    cy.$(`#${node.id}`).addClass('highlighted');

}

function prismAlgorimth(nodesHelper = [], verticesHelper = []) {
    let nodes = [...nodesHelper]
    let vertices = [...verticesHelper]
    let firstNode = nodes[getRandomInt(0, nodes.length)]
    prismAlgorimthHelper(firstNode, nodes, vertices, [], [firstNode.id])
}

function prismAlgorimthHelper(actualNode, nodes = [], vertices = [], bag = [], usedNodes = []) {
    let i = 1;
    selectItem(actualNode);
    while (usedNodes.length < nodes.length) {
        vertices.map((item) => {
            if (item.connects.includes(actualNode.id) && !bag.includes(item)) {
                bag.push(item)
            }
        });
        let minVer = bag[0]
        bag.map((item) => {
            if (item.weight < minVer.weight) {
                minVer = item;
            }
        });
        vertices = removeFromArray(vertices, minVer)
        bag = removeFromArray(bag, minVer);
        minVer.connects = removeFromArray(minVer.connects, actualNode.id);
        usedNodes.map(item => {
            removeFromArray(minVer.connects, item);
        })
        if(minVer.connects.length > 0) {
            let newNode = searchOnElement(nodes, minVer.connects[0])
            if (newNode !== undefined) {
                usedNodes.push(newNode.id);
                let callback = () => {
                    selectItem(minVer);
                    selectItem(newNode);
                }
                actualNode = newNode;
                i += 1;
                setTimeout(callback, i * 1000);
            }
        }
    }
}

let modalState = false

function changeModalState(id) {
    modalState = !modalState
    if (modalState) {
        $(`#${id}`).addClass('is-active')
    } else {
        $(`#${id}`).removeClass('is-active')
    }
}

let burgerState = false

function changeBurgerState() {
    burgerState = !burgerState
    if (burgerState) {
        $("#burger").addClass('is-active')
        $("#navbar-menu").addClass('is-active')
    } else {
        $("#burger").removeClass('is-active')
        $("#navbar-menu").removeClass('is-active')
    }
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
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

let testNodes = [{
        id: 'n0'
    },
    {
        id: 'n1'
    },
    {
        id: 'n2'
    },
    {
        id: 'n3'
    }
]

let testVertices = [{
        id: 'v1',
        connects: ['n2', 'n1'],
        weight: 1
    },
    {
        id: 'v2',
        connects: ['n0', 'n1'],
        weight: 4
    }, {
        id: 'v3',
        connects: ['n1', 'n3'],
        weight: 5
    }, {
        id: 'v4',
        connects: ['n2', 'n0'],
        weight: 6
    }, {
        id: 'v5',
        connects: ['n0', 'n3'],
        weight: 2
    },
    {
        id: 'v6',
        connects: ['n3', 'n2'],
        weight: 10
    }
]


function getDrawElements(nodes, vertices) {
    const height = $(document).height() - 300;
    const width = $(document).width() - 100;
    let result = []
    nodes.map((item) => {
        result.push({
            group: 'nodes',
            data: item,
            position: {
                x: getRandomInt(100, width),
                y: getRandomInt(0, height)
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
            return elements[i]
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
    let callback = () => {
        cy.$(`#${node.id}`).addClass('highlighted');

    }
    setTimeout(callback, 1000);
}

function prismAlgorimth(nodes = [], vertices = []) {
    let firstNode = nodes[getRandomInt(0, nodes.length)]
    prismAlgorimthHelper(firstNode, nodes, vertices, [], [firstNode.id])
}

function prismAlgorimthHelper(actualNode, nodes = [], vertices = [], bag = [], usedNodes = []) {
    selectItem(actualNode);
    vertices.map((item) => {
        if (item.connects.includes(actualNode.id)) {
            bag.push(item)
        }
    });
    let minVer = bag[0]
    bag.map((item) => {
        if (item.weight < minVer.weight) {
            minVer = item
        }
    });
    selectItem(minVer)
    vertices = removeFromArray(vertices, minVer)
    bag = removeFromArray(bag, minVer);
    minVer.connects = removeFromArray(minVer.connects, actualNode.id)
    let newNode = searchOnElement(nodes, minVer.connects[0])
    usedNodes.push(newNode.id)
    if (usedNodes.length !== nodes.length){
        let callback = ()=>{
            prismAlgorimthHelper(newNode, nodes, vertices, bag, usedNodes)
        }
        setTimeout(callback, 1000);
    }
    else{
        selectItem(newNode);
    }
}




function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
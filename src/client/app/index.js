var Id = require('dht-id');

var dht = {
    "21f34817480d":{
        "socketId":"GIWCjqZiDZ9-Qf-cAAAA",
        "fingerTable":{
            "1":{"ideal":"21f34817480f","current":"2da0201cb888"},
            "2":{"ideal":"21f348174811","current":"1d85821b2299"},
            "3":{"ideal":"21f348174815","current":"c7b7d61b1dd5"},
            "4":{"ideal":"21f34817481d","current":"a1d11c2c4728"}},
        "predecessorId":"1d85821b2299"},
    "1d85821b2299":{
        "socketId":"qqzXHtiydh1Hf0cvAAAB",
        "fingerTable":{
            "1":{"ideal":"1d85821b229b","current":"21f34817480d"},
            "2":{"ideal":"1d85821b229d","current":"21f34817480d"},
            "3":{"ideal":"1d85821b22a1","current":"21f34817480d"},
            "4":{"ideal":"1d85821b22a9","current":"21f34817480d"}},
        "predecessorId":"c7b7d61b1dd5"},
    "c7b7d61b1dd5":{
        "socketId":"1KP1mUCEEvt_PF7pAAAC",
        "fingerTable":{
            "1":{"ideal":"c7b7d61b1dd7","current":"1d85821b2299"},
            "2":{"ideal":"c7b7d61b1dd9","current":"1d85821b2299"},
            "3":{"ideal":"c7b7d61b1ddd","current":"1d85821b2299"},
            "4":{"ideal":"c7b7d61b1de5","current":"1d85821b2299"}},
        "predecessorId":"a1d11c2c4728"},
    "a1d11c2c4728":{
        "socketId":"hWB-UweuJKSxvAEKAAAD",
        "fingerTable":{
            "1":{"ideal":"a1d11c2c472a","current":"c7b7d61b1dd5"},
            "2":{"ideal":"a1d11c2c472c","current":"c7b7d61b1dd5"},
            "3":{"ideal":"a1d11c2c4730","current":"c7b7d61b1dd5"},
            "4":{"ideal":"a1d11c2c4738","current":"c7b7d61b1dd5"}},
        "predecessorId":"73e42adb55d9"},
    "2da0201cb888":{
        "socketId":"vy2t1aUd0I5zkrHwAAAE",
        "fingerTable":{
            "1":{"ideal":"2da0201cb88a","current":"535fc202f902"},
            "2":{"ideal":"2da0201cb88c","current":"535fc202f902"},
            "3":{"ideal":"2da0201cb890","current":"535fc202f902"},
            "4":{"ideal":"2da0201cb898","current":"535fc202f902"}},
        "predecessorId":"21f34817480d"},
    "535fc202f902":{
        "socketId":"cr0ZZfq5TPimi367AAAF",
        "fingerTable":{
            "1":{"ideal":"535fc202f904","current":"5ffcc6e13d5d"},
            "2":{"ideal":"535fc202f906","current":"5ffcc6e13d5d"},
            "3":{"ideal":"535fc202f90a","current":"5ffcc6e13d5d"},
            "4":{"ideal":"535fc202f912","current":"5ffcc6e13d5d"}},
        "predecessorId":"2da0201cb888"},
    "73e42adb55d9":{
        "socketId":"ukJlQU6cK-Gz5aEWAAAG",
        "fingerTable":{
            "1":{"ideal":"73e42adb55db","current":"a1d11c2c4728"},
            "2":{"ideal":"73e42adb55dd","current":"a1d11c2c4728"},
            "3":{"ideal":"73e42adb55e1","current":"a1d11c2c4728"},
            "4":{"ideal":"73e42adb55e9","current":"a1d11c2c4728"}},
        "predecessorId":"5ffcc6e13d5d"},
    "5ffcc6e13d5d":{
        "socketId":"anJGtnPHDVT09OP4AAAH",
        "fingerTable":{
            "1":{"ideal":"5ffcc6e13d5f","current":"73e42adb55d9"},
            "2":{"ideal":"5ffcc6e13d61","current":"73e42adb55d9"},
            "3":{"ideal":"5ffcc6e13d65","current":"73e42adb55d9"},
            "4":{"ideal":"5ffcc6e13d6d","current":"73e42adb55d9"}},
        "predecessorId":"535fc202f902"}
};



window.app = {
    init: function () {

        var R = 200 
        var peers = [];
       
        Object.keys(dht).map(function (key){
            var peer = {
                peerId: key,
                fingerTable: dht[key].fingerTable,
                predecessorId: dht[key].predecessorId
            };

            peers.push(peer);
            //Add the peer to the global table too to
            //make it easier to lookup coords by id
            dht[key].peer = peer;
        }) 
        
        // add their coordinates 
        peers.forEach(function (peer) {
            peer.coordinates = cartesianCoordinates(
                new Id(peer.peerId).toDec(), R);
        });

        var vis = d3.select('#dht-ring')
                    .append('svg');

        vis.attr("width", 600)
            .attr("height", 600);

        var plane = vis.append("g")
                    //centering
                    .attr("transform", function(peer, i){
                        return "translate(" + 1.2 * R + "," + 1.2 * R + ")"; 
                    })

        //separate the overall peer selection, from the on-enter-groups
        var peer = plane.selectAll("peers")
                        .data(peers);

        var gs = peer.enter()
                     .append("g")

        gs.append("svg:circle")
            .attr("r", "4px")
            .attr("fill", "black")

        gs.append("svg:text")
            .attr("dx", 5)
            .attr("dy", ".35em")
            .attr("fill", "black")
            .text(function(peer) { return peer.peerId; });

        gs.attr("transform", function(peer, i){
            return "translate(" + (peer.coordinates.x ) + "," + peer.coordinates.y + ")"; 
        })


        // Attempt n1 to create paths

        var arcBetween = function (source, target) {
            var dx = target.coordinates.x - source.coordinates.x;
            var dy = target.coordinates.y - source.coordinates.y;
            var dr = Math.sqrt(dx * dx + dy * dy);

            //We want to draw the line from 0,0 of the group (which is where
            //the dot is rendered), to the delta of the too points, since we
            //are drawing relative to the source position, not the canvas
            return "M" + 0 +
                   "," + 0 +
                   "A" + dr +
                   "," + dr +
                   " 0 0,1 " + dx +
                   "," + dy;
        };

        //Create a new sub-selection joining source's to their fingers
        var links = peer.selectAll('.links')
                        .data(function (d) {
                            //Should return the nested dataset, in this case an array of
                            // [arcId, sourcePeer, targetPeer]
                            var arcs = Object.keys(d.fingerTable).map(function (key) {
                                return {
                                    arcId: d.peerId + '-' + key,
                                    source: d,
                                    target: dht[d.fingerTable[key].current].peer
                                };
                            });
                            return arcs;
                        });

        //for all the links (a nested selection across sources and targets
        //draw an arc
        links.enter()
             .append("path")
                 .attr('class', 'link')
                 .attr("d", function (link) {
                    return arcBetween(link.source, link.target);
                 });


    }
};

window.app.init();



function cartesianCoordinates(id, r) {
    var maxId = new Id(Id.spin()).toDec();
    var radId = id / (maxId / (2 * Math.PI));
 

    return {
        y: Math.sin(radId - Math.PI / 2) * r ,
        x: Math.cos(radId - Math.PI / 2) * r 
    };

}




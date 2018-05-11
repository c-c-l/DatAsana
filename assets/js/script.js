
// Create dataset object
var dataset = null;
var sanskritList = [];
var englishList = [];
var benefitsListUnclean = [];
var types = [];

// console.log(sanskritList);
// console.log(types);

// console.log(benefitsListUnclean.length);
// Clean benefits lists (del dup)
// for(var bIndex = 0; bIndex < benefitsListUnclean.length; bIndex++) {
//     console.log(bIndex);
// }
// DataSet
//// Get benefits
// for(var dataIndex = 0; dataIndex < dataset.length; dataIndex++) {
//     console.log(dataIndex);
// }

////////////////////////////////////////////////////////////
//////////////////////// Set-Up ////////////////////////////
////////////////////////////////////////////////////////////
var margin = {left:100, top:100, right:100, bottom:100},
width =  Math.min(window.innerWidth, 1000)
height =  Math.min(window.innerWidth, 1000)
innerRadius = Math.min(width, height) * 0.39,
outerRadius = innerRadius * 1.1;


// Create SVG

var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .classed('wrapper', true)
          .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");
// .datum(chord(matrix));

var svg = d3.select(' .wrapper');

var outerGroup = svg.append('g').classed('outer', true);
var innerGroup = svg.append('g').classed('inner', true);
// innerGroup.attr('transform', 'translate(100,100)');

d3.csv("https://raw.githubusercontent.com/c-c-l/DatAsana/master/DataCollect/yoga_data.csv", function(data) {
    console.log(data);
    var benefitsList= [];
    data.forEach(function(d) {
        benefitsList.push(d.Benefits);
    });
    // Clean list
    var bList = [];
    for(var bIndex = 0; bIndex < benefitsList.length; bIndex++) {
        if(benefitsList[bIndex] != '[]') { // not empty
            var split = benefitsList[bIndex].split(',');
            for(var splitIdx = 0; splitIdx < split.length; splitIdx++) {

                // Remove square bracket
                split[splitIdx] = split[splitIdx].replace('[', '');
                split[splitIdx] = split[splitIdx].replace(']', '');

                // Remove single quotes
                split[splitIdx] = split[splitIdx].replace('\'', '');
                split[splitIdx] = split[splitIdx].replace('\'', '');

                // Remove space
                split[splitIdx] = split[splitIdx].replace(' ', '');
                // Add all elements to array
                bList.push(split[splitIdx]);
            }
        }
    }
    // Clean new list to del dup
    var benefits = Array.from(new Set(bList));
    console.log(benefits);

    //Creates a function that makes SVG paths in the shape of arcs with the specified inner and outer radius
	var arc = d3.arc()
			    .innerRadius(width*0.9/2)
			    .outerRadius(width*0.9/2 + 30);

    var arcIn = d3.arc()
                  .innerRadius((width*0.9/2) - 200)
                  .outerRadius((width*0.9/2 + 30) - 200);

    // Define pie
    var angle = 360/benefits.length; // 360 deg / len of benef
    var pie = d3.pie()
                .value(function(d, i) {
                    return angle;
                })
                .padAngle(.01)
                .sort(null);

    //Draw the arcs themselves
    outerGroup.selectAll(" .benefitsArc")
       .data(pie(benefits))
       .enter().append("path")
       .attr("class", "benefitsArc")
       .attr("id", function(d,i) { return "benefitsArc_"+i; })
       .attr("d", arc);

    innerGroup.selectAll(" .posesArc")
          .data(pie(data))
          .enter().append("circle")
          .attr('r', "2")
          // var centroid = arcIn.centroid(d);
          // .attr("transform", function(d) { return "translate(" + arcIn.centroid(d) + ")"; })
          .attr("cx", function(d) { var centroid = arcIn.centroid(d); return centroid[0]; })
          .attr("cy", function(d) { var centroid = arcIn.centroid(d); return centroid[1]; })
          .attr("class", "posesArc")
          .attr("id", function(d,i) { return "posesArc_"+i; })
          // .attr("d", arcIn);

    // Write benefits
    outerGroup.selectAll(" .benefitsText")
              .data(pie(benefits))
              .enter().append("circle")
              .attr('r', "5")
              .attr("cx", function(d) { var centroid = arc.centroid(d); return centroid[0]; })
              .attr("cy", function(d) { var centroid = arc.centroid(d); return centroid[1]; })
              .attr("class", "benefitArc")
              .attr("id", function(d,i) { return "benefitArc_"+i; });
              // .enter().append('text')
              // .classed('benefitsText', true)
              // .attr("x", 0) //Move the text from the start angle of the arc
              // .attr("dy", 18) //Move the text down
              // .append("textPath")
              // .attr("xlink:href",function(d,i){return "#benefitsArc_"+i;})
              // .text(function(d, i) {
              //     return benefits[i];
              // })
    for(var poseIdx = 0; poseIdx < data.length; poseIdx++) {
        for(var beneIdx = 0; beneIdx < benefits.length; beneIdx++) {
            if(data[poseIdx].Benefits.includes(benefits[beneIdx])) {
                var x1 = d3.select(' #posesArc_' + poseIdx).attr('cx');
                var x2 = d3.select(' #benefitArc_' + beneIdx).attr('cx');
                var y1 = d3.select(' #posesArc_' + poseIdx).attr('cy');
                var y2 = d3.select(' #benefitArc_' + beneIdx).attr('cy');
                svg.append('line').classed(benefits[beneIdx] + '-line', true)
                   .classed('line', true)
                   .attr('x1', x1)
                   .attr('x2', x2)
                   .attr('y1', y1)
                   .attr('y2', y2);
            }
        }
    }


}); // CSV READING FILE

// ////////////////////////////////////////////////////////////
// ////////////////// Draw outer Arcs /////////////////////////
// ////////////////////////////////////////////////////////////
//
// var outerArcs = svg.selectAll("g.group")
// .data(function(chords) { return chords.groups; })
// .enter().append("g")
// .attr("class", "group")
// .on("mouseover", fade(.1))
// .on("mouseout", fade(opacityDefault))
//
// // text popups
// .on("click", mouseoverChord)
// .on("mouseout", mouseoutChord);
//
//
// ////////////////////////////////////////////////////////////
// ////////////////////// Append names ////////////////////////
// ////////////////////////////////////////////////////////////
//
// //Append the label names INSIDE outside
// outerArcs.append("path")
// .style("fill", function(d) { return colors(d.index); })
// .attr("id", function(d, i) { return "group" + d.index; })
// .attr("d", arc);
//
// outerArcs.append("text")
//    .attr("x", 6)
//    .attr("dx", 60)
//   .attr("dy", 18)
// .append("textPath")
//   .attr("href", function(d) { return "#group" + d.index;})
//   .text(function(chords, i){return names[i];})
//   .style("fill", "white");
//
// ////////////////////////////////////////////////////////////
// ////////////////// Draw inner chords ///////////////////////
// ////////////////////////////////////////////////////////////
//
// svg.selectAll("path.chord")
// .data(function(chords) { return chords; })
// .enter().append("path")
// .attr("class", "chord")
// .style("fill", function(d) { return colors(d.source.index); })
// .style("opacity", opacityDefault)
// .attr("d", path);
//
//
// ////////////////////////////////////////////////////////////
// //////// Draw Super Categories - By Faraz Shuja ////////////
// ////////////////////////////////////////////////////////////
//
// //define grouping with colors
// var groups = [
// {sIndex: 0, eIndex: 2, title: 'SuperCategory 1', color: '#c69c6d'},
// {sIndex: 4, eIndex: 5, title: 'SuperCategory 2', color: '#00a651'}
// ];
// var cD = chord(matrix).groups;
//
// //draw arcs
// for(var i=0;i<groups.length;i++) {
// var __g = groups[i];
// var arc1 = d3.arc()
//     .innerRadius(innerRadius*1.11)
//     .outerRadius(outerRadius*1.1)
//     .startAngle(cD[__g.sIndex].startAngle)
//     .endAngle(cD[__g.eIndex].endAngle)
//
// svg.append("path").attr("d", arc1).attr('fill', __g.color).attr('id', 'groupId' + i);
//
// // Add a text label.
// var text = svg.append("text")
//     .attr("x", 200)
//     .attr("dy", 20);
//
// text.append("textPath")
//     .attr("stroke","#fff")
//     .attr('fill', '#fff')
//     .attr("xlink:href","#groupId" + i)
//     .text(__g.title);
// }
//
//
//
//
// ////////////////////////////////////////////////////////////
// ////////////////// Extra Functions /////////////////////////
// ////////////////////////////////////////////////////////////
//
// function popup() {
// return function(d,i) {
// console.log("love");
// };
// }//popup
//
// //Returns an event handler for fading a given chord group.
// function fade(opacity) {
// return function(d,i) {
// svg.selectAll("path.chord")
//   .filter(function(d) { return d.source.index != i && d.target.index != i; })
// .transition()
//   .style("opacity", opacity);
// };
// }//fade
//
// //Highlight hovered over chord
// function mouseoverChord(d,i) {
//
// //Decrease opacity to all
// svg.selectAll("path.chord")
// .transition()
// .style("opacity", 0.1);
// //Show hovered over chord with full opacity
// d3.select(this)
// .transition()
//   .style("opacity", 1);
//
// //Define and show the tooltip over the mouse location
// $(this).popover({
// //placement: 'auto top',
// title: 'test',
// placement: 'right',
// container: 'body',
// animation: false,
// offset: "20px -100px",
// followMouse: true,
// trigger: 'click',
// html : true,
// content: function() {
// return "<p style='font-size: 11px; text-align: center;'><span style='font-weight:900'>"  +
//      "</span> text <span style='font-weight:900'>"  +
//      "</span> folgt hier <span style='font-weight:900'>" + "</span> movies </p>"; }
// });
// $(this).popover('show');
// }
// //Bring all chords back to default opacity
// function mouseoutChord(d) {
// //Hide the tooltip
// $('.popover').each(function() {
// $(this).remove();
// })
// //Set opacity back to default for all
// svg.selectAll("path.chord")
// .transition()
// .style("opacity", opacityDefault);
// }      //function mouseoutChord

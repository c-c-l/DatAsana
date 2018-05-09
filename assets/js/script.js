// Create dataset object

var dataset = {
    sanskrit: null,
    english: null,
    types: null,
    benefits: null
}

d3.csv("https://raw.githubusercontent.com/c-c-l/DatAsana/master/DataCollect/yoga_data.csv", function(data) {
    console.log(data);
})

////////////////////////////////////////////////////////////
//////////////////////// Set-Up ////////////////////////////
////////////////////////////////////////////////////////////
var margin = {left:90, top:90, right:90, bottom:90},
width =  1000 - margin.left - margin.right, // more flexibility: Math.min(window.innerWidth, 1000)
height =  1000 - margin.top - margin.bottom, // same: Math.min(window.innerWidth, 1000)
innerRadius = Math.min(width, height) * .39,
outerRadius = innerRadius * 1.1;

var names = ["Test1","Test2","AMO-DB","YouTube","Twitter", "Google+", "Pflegeratgeber" ,"O-Mag","RuV"],
colors = ["#301E1E", "#083E77", "#342350", "#567235", "#8B161C", "#DF7C00"],
opacityDefault = 0.8;

var matrix = [
[0,1,1,1,1,1,1,1,1], //Test1
[0,0,1,1,1,1,1,0,1], //Test2
[0,1,0,1,1,1,1,1,1], //Hawkeye
[0,1,1,0,1,1,0,1,1], //The Hulk
[0,1,1,1,0,1,1,1,1], //Iron Man
[0,1,1,1,1,0,1,1,1],
[0,1,1,1,1,1,0,1,1], //Iron Man
[0,1,1,1,1,1,1,0,1],
[0,1,1,1,1,1,1,0,0] //Thor //Thor
];

////////////////////////////////////////////////////////////
/////////// Create scale and layout functions //////////////
////////////////////////////////////////////////////////////

var colors = d3.scaleOrdinal()
.domain(d3.range(names.length))
.range(colors);

var chord = d3.chord()
.padAngle(.15)
.sortChords(d3.descending)

var arc = d3.arc()
.innerRadius(innerRadius*1.01)
.outerRadius(outerRadius);

var path = d3.ribbon()
.radius(innerRadius);

////////////////////////////////////////////////////////////
////////////////////// Create SVG //////////////////////////
////////////////////////////////////////////////////////////

var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
.datum(chord(matrix));

////////////////////////////////////////////////////////////
////////////////// Draw outer Arcs /////////////////////////
////////////////////////////////////////////////////////////

var outerArcs = svg.selectAll("g.group")
.data(function(chords) { return chords.groups; })
.enter().append("g")
.attr("class", "group")
.on("mouseover", fade(.1))
.on("mouseout", fade(opacityDefault))

// text popups
.on("click", mouseoverChord)
.on("mouseout", mouseoutChord);


////////////////////////////////////////////////////////////
////////////////////// Append names ////////////////////////
////////////////////////////////////////////////////////////

//Append the label names INSIDE outside
outerArcs.append("path")
.style("fill", function(d) { return colors(d.index); })
.attr("id", function(d, i) { return "group" + d.index; })
.attr("d", arc);

outerArcs.append("text")
   .attr("x", 6)
   .attr("dx", 60)
  .attr("dy", 18)
.append("textPath")
  .attr("href", function(d) { return "#group" + d.index;})
  .text(function(chords, i){return names[i];})
  .style("fill", "white");

////////////////////////////////////////////////////////////
////////////////// Draw inner chords ///////////////////////
////////////////////////////////////////////////////////////

svg.selectAll("path.chord")
.data(function(chords) { return chords; })
.enter().append("path")
.attr("class", "chord")
.style("fill", function(d) { return colors(d.source.index); })
.style("opacity", opacityDefault)
.attr("d", path);


////////////////////////////////////////////////////////////
//////// Draw Super Categories - By Faraz Shuja ////////////
////////////////////////////////////////////////////////////

//define grouping with colors
var groups = [
{sIndex: 0, eIndex: 2, title: 'SuperCategory 1', color: '#c69c6d'},
{sIndex: 4, eIndex: 5, title: 'SuperCategory 2', color: '#00a651'}
];
var cD = chord(matrix).groups;

//draw arcs
for(var i=0;i<groups.length;i++) {
var __g = groups[i];
var arc1 = d3.arc()
    .innerRadius(innerRadius*1.11)
    .outerRadius(outerRadius*1.1)
    .startAngle(cD[__g.sIndex].startAngle)
    .endAngle(cD[__g.eIndex].endAngle)

svg.append("path").attr("d", arc1).attr('fill', __g.color).attr('id', 'groupId' + i);

// Add a text label.
var text = svg.append("text")
    .attr("x", 200)
    .attr("dy", 20);

text.append("textPath")
    .attr("stroke","#fff")
    .attr('fill', '#fff')
    .attr("xlink:href","#groupId" + i)
    .text(__g.title);
}




////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

function popup() {
return function(d,i) {
console.log("love");
};
}//popup

//Returns an event handler for fading a given chord group.
function fade(opacity) {
return function(d,i) {
svg.selectAll("path.chord")
  .filter(function(d) { return d.source.index != i && d.target.index != i; })
.transition()
  .style("opacity", opacity);
};
}//fade

//Highlight hovered over chord
function mouseoverChord(d,i) {

//Decrease opacity to all
svg.selectAll("path.chord")
.transition()
.style("opacity", 0.1);
//Show hovered over chord with full opacity
d3.select(this)
.transition()
  .style("opacity", 1);

//Define and show the tooltip over the mouse location
$(this).popover({
//placement: 'auto top',
title: 'test',
placement: 'right',
container: 'body',
animation: false,
offset: "20px -100px",
followMouse: true,
trigger: 'click',
html : true,
content: function() {
return "<p style='font-size: 11px; text-align: center;'><span style='font-weight:900'>"  +
     "</span> text <span style='font-weight:900'>"  +
     "</span> folgt hier <span style='font-weight:900'>" + "</span> movies </p>"; }
});
$(this).popover('show');
}
//Bring all chords back to default opacity
function mouseoutChord(d) {
//Hide the tooltip
$('.popover').each(function() {
$(this).remove();
})
//Set opacity back to default for all
svg.selectAll("path.chord")
.transition()
.style("opacity", opacityDefault);
}      //function mouseoutChord

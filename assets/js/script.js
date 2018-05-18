
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

// Colors
colors = ['#F5907A','#F78D89','#F58D98','#EF8FA7','#E592B5','#D898C2','#C69ECC',
          '#B2A4D3','#9BAAD7','#83B0D6','#6BB5D1','#55B9C9','#45BCBD','#40BDAF',
          '#47BE9E','#56BE8D','#68BD7B','#7BBB6A','#8FB85B','#A2B44F','#B5AE46',
          '#C8A843','#D9A145','#E89A4D','#F59259','#FE8C68', '#FE794F']

// Create SVG
var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .classed('wrapper', true)
          .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");
// .datum(chord(matrix));
var svg = d3.select(' .wrapper');

svg.append('defs');

var svgBase = svg.select('defs');
svgBase.append('filter')
       .attr('id', 'glowy')
         .append('feGaussianBlur')
         .attr('stdDeviation', '0.75')
         .attr('result', 'coloredBlur')
           .append('feMerge')
             .append('feMergeNode')
             .attr('in', 'colorBlur');
svgBase.select('feMerge')
       .append('feMergeNode')
       .attr('in', 'SourceGraphic');

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

    innerGroup.selectAll(" .posesArc")
          .data(pie(data))
          .enter().append("circle")
          .attr('r', "2")
          .attr("cx", function(d) { var centroid = arcIn.centroid(d); return centroid[0]; })
          .attr("cy", function(d) { var centroid = arcIn.centroid(d); return centroid[1]; })
          .attr("class", "posesArc")
          .attr("id", function(d,i) { return "posesArc-"+i; });

    var tip = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);
    // Write benefits
    outerGroup.selectAll(" .benefitsText")
              .data(pie(benefits))
              .enter()
              // .append('text')
              // .classed('benefitsText', true)
              // .attr("x", 40) //Move the text from the start angle of the arc
              // .attr("dy", 10) //Move the text down
              // .append("textPath")
              // .attr("xlink:href",function(d,i){return "#benefitsArc_"+i;})
              // .style('fill', function(d,i) { return colors[i]; })
              // .text(function(d, i) {
              //     return benefits[i];
              // })
              .append("circle")
              .attr('r', "4")
              .attr("cx", function(d) { var centroid = arc.centroid(d); return centroid[0]; })
              .attr("cy", function(d) { var centroid = arc.centroid(d); return centroid[1]; })
              .attr("class", "benefitArc")
              .style('fill', function(d,i) { return colors[i]; })
              .style('filter', 'url(#glowy)')
              .attr("id", function(d,i) { return "benefitArc-"+i; });
              var circles = svg.selectAll(' .outer circle');
              var groupCircles = circles._groups[0];
              for (var circleIdx = 0; circleIdx < groupCircles.length; circleIdx++) {
                  var id = getIndex(getId(groupCircles[circleIdx]));
                  var circle = d3.select(groupCircles[circleIdx]);
                  svg.append("text")
                     .text(function(d) {
                         return benefits[circleIdx];
                     })
                     .style('fill',function(d) { return colors[circleIdx];} )
                     .attr("x", function (d) {
                         var x = circle.attr('cx');
                         return x - 25;
                     })
                     .attr("y", function (d) {
                         var y = circle.attr('cy');
                         return y - 10;
                     });
                  // d3.select("body").append("div")
                  //      .attr("class", "tooltip")
                  //      .style("opacity", .9)
                  //       .html(function(d) {
                  //                  return benefits[circleIdx];
                  //              })
                  //              .style("left", 200 + "px")
                  //              .style("top", 40 + "px");
              }
     //          .on("mouseover", function(d, i) {
     //              tip.transition()
     //              .duration(200)
     //              .style("opacity", .9);
     //              tip.html(function(d, i) {
     //                  return i;
     //              })
     //              .style("left", (d3.event.pageX) + "px")
     //              .style("top", (d3.event.pageY - 28) + "px");
     //          })
     // .on("mouseout", function(d) {
     //   tip.transition()
     //     .duration(500)
     //     .style("opacity", 0);
     //   })

              //Draw the arcs themselves
              // outerGroup.selectAll(" .benefitsArc")
              //    .data(pie(benefits))
              //    .enter().append("path")
              //    .attr("class", "benefitsArc")
              //    .attr("id", function(d,i) { return "benefitsArc_"+i; })
              //    // .attr('filter', 'url(#glowy)')
              //    .attr("d", arc);
              //Draw the arcs themselves
              // outerGroup.selectAll(" .benefitsArc")
              //    .data(pie(benefits))
              //    .append('text')
              //    .classed('benefitsText', true)
              //    .attr("x", 40) //Move the text from the start angle of the arc
              //    .attr("dy", 10) //Move the text down
              //    .append("textPath")
              //    .attr("xlink:href",function(d,i){return "#benefitsArc_"+i;})
              //    .style('fill', function(d,i) { return colors[i]; })
              //    .text(function(d, i) {
              //        return benefits[i];
              //    });

    for(var poseIdx = 0; poseIdx < data.length; poseIdx++) {
        for(var beneIdx = 0; beneIdx < benefits.length; beneIdx++) {
            if(data[poseIdx].Benefits.includes(benefits[beneIdx])) {
                var x1 = d3.select(' #posesArc-' + poseIdx).attr('cx');
                var x2 = d3.select(' #benefitArc-' + beneIdx).attr('cx');
                var y1 = d3.select(' #posesArc-' + poseIdx).attr('cy');
                var y2 = d3.select(' #benefitArc-' + beneIdx).attr('cy');
                var className = benefits[beneIdx].toLowerCase();
                svg.append('line').classed(className + '-line', true)
                   .classed('line', true)
                   .attr('x1', x1)
                   .attr('x2', x2)
                   .attr('y1', y1)
                   .attr('y2', y2)
                   .style('stroke', colors[beneIdx]);
            }
        }
    }
    // Get index from id name
    function getIndex(id) {
        var idArr = id.split('-');
        return idArr[1];
    }

    // Get id from element
    function getId(element) {
        return element.id;
    }

    // var circles = svg.selectAll(' .outer circle');
    // var groupCircles = circles._groups[0];
    // for (var circleIdx = 0; circleIdx < groupCircles.length; circleIdx++) {
    //     var id = getIndex(getId(groupCircles[circleIdx]));
    //     console.log(id)
    // }


}); // CSV READING FILE

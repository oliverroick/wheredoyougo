Charts = {
	init: function () {
		$('chartView').show();
		this.hours();
//		this.days();
//		this.checkinDistribution();
		
		/**
		 * Scatterplot
		 */
		
//		var values = fourSq.venues.values();
//		
//		var h = $('distanceScatter').getHeight() - 40;
//		var w = $('distanceScatter').getWidth() - 50;
//		
//		var xScale = pv.Scale.linear(0, pv.max(values, function(d){return d.distance})).range(0, w);
//    	var yScale = pv.Scale.linear(0, pv.max(values, function(d){return d.count})).range(0, h);
//		
//		var vis = new pv.Panel()
//			.canvas('distanceScatter')
//		    .width(w)
//		    .height(h)
//		    .bottom(35)
//		    .left(40)
//		    .right(10)
//		    .top(5);
//			
//		/* Y-axis and ticks. */
//		vis.add(pv.Rule)
//		    .data(yScale.ticks())
//		    .bottom(yScale)
//		    .strokeStyle(function(d) {return d} ? "#eee" : "#000")
//		  	.anchor("left").add(pv.Label)
//		    .text(yScale.tickFormat)
//			.font('12px sans-serif');
//
//		/* X-axis and ticks. */
//		vis.add(pv.Rule)
//		    .data(xScale.ticks())
//		    .left(xScale)
//		    .strokeStyle(function(d) {return d} ? "#eee" : "#000")
//		  	.anchor("bottom").add(pv.Label)
//		    .text(xScale.tickFormat)
//			.font('12px sans-serif');
//			
//		vis.add(pv.Panel)
//    			.data(values)
//  			.add(pv.Dot)
//    			.left(function(d) {return xScale(d.distance)})
//    			.bottom(function(d) {return yScale(d.count)})
//				.fillStyle("rgba(30, 120, 180, 1)")
//				.strokeStyle("none")
//				.radius(3);
//				
//		vis.add(pv.Label)
//		    .right(-10)
//		    .bottom(-35)
//		    .textAlign("right")
//		    .text("Distance from home")
//			.font('12px sans-serif');
//		
//		vis.add(pv.Label)
//		    .left(-25)
//		    .top(-5)
//		    .textAlign("right")
//		    .text("Number of check-ins")
//			.textAngle(-Math.PI / 2)
//			.font('12px sans-serif');
//			
//		vis.add(pv.Dot)
//      		.right(10)
//      		.top(10)
//		    .fillStyle("black")
//			.strokeStyle("white")
//		    .size(150)
//		    .anchor("center").add(pv.Label)
//		      .textStyle("white")
//		      .text('A')
//			  .font('17px sans-serif');
//			
//		vis.root.render();
	},
	
	
	drawBarChart: function(id, width, height, margin, xScale, yScale, xLabel, yLabel, captionNo) {
		// create chart
		var chart = d3.select("div#" + id).append("svg")
			.attr("width", width + 50)
			.attr("height", height + 40);
		
		// vertical rules
		chart.selectAll(".xRule")
		    	.data(xScale.ticks(10))
			.enter().append("line")
				.attr("class", ".xRule")
				.attr("x1", xScale)
				.attr("x2", xScale)
				.attr("y1", 0)
				.attr("y2", height - margin)
				.style("stroke", "#ccc");
				
						
		// vertical labels
		chart.selectAll(".xLabel")
    			.data(xScale.ticks(10))
    		.enter().append("svg:text")
			    .attr("class", "xLabel")
			    .text("test")
			    .attr("x", xScale)
			    .attr("y", height)
			    .attr("text-anchor", "middle");
				
		// horizontal rules
		chart.selectAll(".yRule")
		    	.data(yScale.ticks(10))
			.enter().append("line")
				.attr("class", ".yRule")
				.attr("x1", margin)
				.attr("x2", width)
				.attr("y1", yScale)
				.attr("y2", yScale)
				.style("stroke", "#ccc");
		
		return chart;
		

//		visBar.add(pv.Label)
//		    .right(-10)
//		    .bottom(-35)
//		    .textAlign("right")
//		    .text(xLabel)
//			.font('12px sans-serif');
//		
//		visBar.add(pv.Label)
//		    .left(-25)
//		    .top(-5)
//		    .textAlign("right")
//		    .text(yLabel)
//			.textAngle(-Math.PI / 2)
//			.font('12px sans-serif');
//		
//		visBar.add(pv.Dot)
//      		.right(10)
//      		.top(10)
//		    .fillStyle("black")
//			.strokeStyle("white")
//		    .size(150)
//		    .anchor("center").add(pv.Label)
//		      .textStyle("white")
//		      .text(captionNo)
//			  .font('17px sans-serif');
//
//		return visBar;
	},
	
	hours: function () {
		var id = "hours";
		
		var h = $(id).getHeight();
		var w = $(id).getWidth();
		var margin = 45;
		
		var xScale = d3.scale.linear().domain([0, 23]).range([margin, w - 10]);
		var yScale = d3.scale.linear().domain([0, d3.max(fourSq.hours, function(d){return d})]).rangeRound([0, (h - margin)]);
		
		var chart = this.drawBarChart(id, w, h, margin, xScale, yScale, 'Hour', 'Number of check-ins', 'C');
		
		chart.selectAll('rect')
				.data(fourSq.hours)
			.enter().append("rect")
				.attr("x", function(d, i) {return xScale(i) - 5;})
				.attr("y", function(d) {return h - margin - yScale(d);})
				.attr("width", 10)
				.attr("height", function(d) {return yScale(d);})
				.attr("fill", "rgba(30, 120, 180, 1)");
		
		/*
chart.add(pv.Bar)
    		.data(fourSq.hours)
			.width(10)
    		.left(function() {return xScale(this.index) - 5})
			.bottom(0)
   			.height(function(d) {return yScale(d)})
			.strokeStyle("rgba(30, 120, 180, 1)");
		chart.root.render();
*/
	},
	
	days: function () {
		var id = "days";
		
		var h = $(id).getHeight() - 40;
		var w = $(id).getWidth() - 50;
		
		var yScale = pv.Scale.linear(0, pv.max(fourSq.days, function(d){return d})).range(0, h);
    	var xScale = pv.Scale.linear(-1, 7).range(0, w);
		
		var chart = this.drawBarChart(id, w, h, xScale, yScale, 'Day', 'Number of check-ins', 'D');
		
		chart.add(pv.Bar)
    		.data(fourSq.days)
			.width(20)
    		.left(function() {return xScale(this.index) - 10})
			.bottom(0)
   			.height(function(d) {return yScale(d)})
			.strokeStyle("rgba(30, 120, 180, 1)");
		chart.root.render();
	},
	
	checkinDistribution: function () {
		
		var checkinDistData = this.getCheckinDist();
		
		var id = "checkinDist";
		
		var h = $(id).getHeight() - 40;
		var w = $(id).getWidth() - 50;
		
		var xScale = pv.Scale.linear(0, pv.max(checkinDistData, function(d){return d.checkins})).range(0, w);
    	var yScale = pv.Scale.linear(0, pv.max(checkinDistData, function(d){return d.count})).range(0, h);
		console.log('scale');
		var chart = this.drawBarChart(id, w, h, xScale, yScale, 'Number of check-ins', 'Number of venues', 'B');
			
		chart.add(pv.Bar)
    		.data(checkinDistData)
			.width(5)
    		.left(function(d) {return xScale(d.checkins)})
			.bottom(0)
   			.height(function(d) {return yScale(d.count)})
			.strokeStyle("rgba(30, 120, 180, 1)");

		
		chart.root.render();

	},
	
	getCheckinDist: function () {
		var data = new Hash();
		
		fourSq.venues.values().each(function (venue) {
			if (data.keys().indexOf(venue.count.toString()) != -1) {
				data.get(venue.count.toString()).count++;
			} else {
				data.set(venue.count.toString(), {
					checkins: venue.count,
					count: 1
				});
			}
		});
		
		return data.values();
	}
}
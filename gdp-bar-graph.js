const request = new XMLHttpRequest();
request.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
request.onload = _ => {
    const gdp = JSON.parse(request.responseText);
    let yearDataset = []
    let gdpDataset = [];
    (gdp.data).forEach(function(d) {
        gdpDataset.push(d[1]/35);
        yearDataset.push(d[0].slice(0, 4))
    })


    let svgWidth = 1000;
    let svgHeight = 600;
    let svg = d3.select("svg")
        .attr("width", svgWidth + 100)
        .attr("height", svgHeight + 100)

    let barPadding = 1;
    let barWidth = (svgWidth/gdpDataset.length)

    let barChart = svg.selectAll("rect")
        .data(gdpDataset)
        .enter()
        .append("rect")
        .attr("y", function(d) {
            return svgHeight - d
        })
        .attr("height", function(d) {
            return d
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function(d, i) {
            let translate = [barWidth*i + 50];
            return `translate(${translate})`;
        })
        .attr("fill", "#ED6942")
        .on("mouseover", function(d, i) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(`${yearDataset[i]} <br> $${(gdpDataset[i]*35).toFixed(1)} Billion`)
                .style("left", `${d3.event.pageX + 20}px`)
                .style("top", `${d3.event.pageY}px`)
            d3.select(this)
                .attr("fill", "#F9B5AA")
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0)
            d3.select(this)
                .attr("fill", "#ED6942")
        })

    let xScale = d3.scaleLinear()
        .domain([d3.min(yearDataset), d3.max(yearDataset)])
        .range([0, svgWidth])

    let xAxis = d3.axisBottom()
        .scale(xScale)

    let xAxisGroup = svg.append("g")
        .attr("transform", `translate(50, ${svgHeight})`)
        .attr("class", "axisBeige")
        .call(xAxis)

    //text label for x axis
    svg.append("text")
        .attr("transform", `translate(${svgWidth/2 + 70}, ${svgHeight + 50})`)
        .style("font-family", "Quicksand")
        .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(gdpDataset)*35])
        .range([d3.max(gdpDataset), d3.min(gdpDataset)]);

    let yAxis = d3.axisLeft()
        .scale(yScale);

    let yAxisGroup = svg.append("g")
        .attr("transform", `translate(50, ${svgHeight - d3.max(gdpDataset) })`)
        .attr("class", "axisBeige")
        .call(yAxis);

    //append text for y-axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 50)
        .attr("x", -(svgHeight/2 - 30))
        .attr("dy", "1em")
        .style("font-family", "Quicksand")
        // .style("fill", "#E7B99F")
        .text("Gross Domestic Product")

    //define div for the tooltip
    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

}
request.send();

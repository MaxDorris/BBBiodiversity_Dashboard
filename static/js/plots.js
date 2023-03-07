function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      let sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    optionChanged(sampleNames[0]);
  })};

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  };

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      let metadata = data.metadata;
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      let PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      // PANEL.append("h6").text(result.location);
      Object.entries(result).forEach(function (kv){
        let caps = kv[0].toUpperCase();
        // console.log(values);
        PANEL.append("h6").text(caps + ': ' + kv[1]);
      });
    });
  };
  // Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array.
    let sampledata = data.samples;
    
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = sampledata.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metadata = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    let arrays = resultArray[0];

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    let gaugeArray = metadata[0];

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = arrays.otu_ids;
    let otu_labels = arrays.otu_labels;
    let sample_values = arrays.sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    let wash_freq = parseFloat(gaugeArray.wfreq);
    



    //  getting average wash frequency of available data:
    let washes = [];
    data.metadata.forEach(a => washes.push(parseFloat(a.wfreq)));
    let max = washes.sort((a,b) => b-a)[0];
    let nan_filt = washes.filter(wash => isNaN(wash) === false);
    let avg = nan_filt.reduce((a, b) => {
      return a + b;
    })/nan_filt.length;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0,10).map(id => 'OTU ' + id).reverse();
    var xvals = sample_values.slice(0,10).reverse();
    var text = otu_labels.slice(0,10).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: xvals,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: text
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      width: 600,
      height: 750
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',barData,barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Jet'
      }
    }];
    
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1000,
      xaxis: {title: 'OTU ID'},
      hovermode: 'closest'
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: wash_freq,
        title: { text: "Belly Button Washing Frequency", font: { size: 24,
        size: 24,
      color: 'black' } },
        delta: { reference: avg, increasing: { color: "turquiose" } },
        gauge: {
          axis: { range: [null, max+1], tickwidth: 1, tickcolor: "turquiose" },
          bar: { color: "darkturquoise" },
          bgcolor: "white",
          borderwidth: 1,
          bordercolor: "black",
          steps: [
            { range: [0, 8/3], color: "#FFA485" },
            { range: [8/3, (2*8/3)], color: "#FEFF85" },
            { range: [2*8/3, 8], color: "#85FF8A" }
          ],
          threshold: {
            line: { color: "black", width: 3 },
            thickness: 1,
            value: avg
          }
        }
      }
    ];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "darkblue", family: "Arial" }
    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout);
  });
};

  init();
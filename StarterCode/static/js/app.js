

// view metadata for demographic info and guage
// bc both utilize the metadata "data" from the large dataset
function buildMetadata(sample) {

    // use d3 to get the data from the samples.json file
    d3.json("samples.json").then((data) => {
        console.log(data);
        var metadata = data.metadata;
        console.log("##############")
        console.log("Metadata Object:")
        console.log(metadata);

        // filter through metadata for each sample id
        var filteredArray= metadata.filter(sampleObj => sampleObj.id == sample);
        console.log("##############")
        console.log(filteredArray);

        // go into array to just grab the object
        var resultObj= filteredArray[0]
        console.log(resultObj);

        var washFreq= resultObj.wfreq;
        console.log(washFreq);

        // build guage for wash freq
        var gaugeData = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFreq,
              title: { text: "Belly Button Washing Freq <br> Scrubs per Week" },
              type: "indicator",
              mode: "gauge+number",
              gauge: { axis: { range: [null, 9] } }
            }
          ];
          
          var gaugeLayout = { width: 600, height: 400 };
          
          Plotly.newPlot('gauge', gaugeData, gaugeLayout);




        var panel= d3.select("#sample-metadata");

        // ensure the panel is clear before loading metadata
        panel.html("");

        // Using object.entries lets you grab the key and value pair in the object
        // use chain technique to add text for each key value pair
        Object.entries(resultObj).forEach(([key, value]) => {
            panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });
    });
};


function buildIdCharts(sample) {
    // use d3 to get the data from the samples.json file
    d3.json("samples.json").then((data) => {
        // console.log(data);
        var samplesData = data.samples;
        console.log("##############")
        console.log("Samples Object:")
        console.log(samplesData);

        // filter through metadata for each sample id
        var filteredArray= samplesData.filter(sampleObj => sampleObj.id == sample);
        console.log("##############")
        console.log(filteredArray);

        // go into array to just grab the object
        var resultObj= filteredArray[0]
        console.log(resultObj);
        


        // Sort the data by the sample_values
        var sortedBySampleValues= filteredArray.sort((a, b) => b.sample_values - a.sample_values);
        console.log(sortedBySampleValues)

        // Checking the values for the bar chart
        var resultValues= sortedBySampleValues[0].sample_values
        // console.log(resultValues)

        var resultIds= sortedBySampleValues[0].otu_ids
        // console.log(resultIds)

        var resultLabels= sortedBySampleValues[0].otu_labels
        // console.log(resultLabels)
        console.log("##############")



        // use map to iterate over array and turn into string
        var yticks= resultIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        console.log(yticks);


                // Trace1 for the Samples Data
        var trace1 = {
            x: resultValues.slice(0, 10).reverse(),
            y: yticks,
            text: resultLabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
  
        // data
         var barData = [trace1];
  
        // Apply the group bar mode to the layout
        var barLayout = {
            title: ("Top 10 Bacteria Cultures Found").bold(),
            margin: {
                l: 100,
                r: 100,
                t: 40,
                b: 100
            }
        };
  
        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", barData, barLayout);

        // Bubble Chart-- 

        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.

        var trace2 = {
            x: resultIds,
            y: resultValues,
            text: resultLabels,
            mode: 'markers',
            marker: {
                color: resultIds,
                colorscale: 'Portland',
                size: resultValues
            }
        };
        
        var bubbleData = [trace2];
        
        var bubbleLayout = {
            title: ('Bacteria Cultures Per Sample').bold(),
            showlegend: false,
            height: 600,
            width: 1200,
            xaxis: {
                title: {
                  text: 'OTU ID',
                  font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: 'black'
                  }
                }
              }
        };
        
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);



    });
};


function optionChanged(nextSample) {
    buildMetadata(nextSample);
    buildIdCharts(nextSample);
};


// initialize page with init function
function init() {

    var pullDownMenu = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var names = data.names;
        console.log(names);

        names.forEach((sample) => {
            pullDownMenu
                .append("option")
                .property("value", sample)
                .text(sample);
        });

    });


    buildMetadata(940);
    buildIdCharts(940);
}


// initialize the page
init();
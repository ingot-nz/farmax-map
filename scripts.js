  // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
  const sheetId = "1rdhbt3X39SiSFgW7Qvw5mBUaQOn640i2V_0RI70Vbzs";
  // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
  const sheetName = encodeURIComponent("sheet1");
  const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

  $.ajax({
    type: "GET",
    url: sheetURL,
    dataType: "text",
    success: function (response) {
      var data = $.csv.toObjects(response);
      console.log(data);
      // Call function to process the data
      processConsultants(data);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    }
  });

    function processConsultants(consultantsData) {
    const consultantsList = document.querySelector('.consultant-list');
    // Function to display consultants
    function displayConsultants(consultants) {
      consultantsList.innerHTML = '';
      consultants.forEach(consultant => {
        const consultantItem = document.createElement('div');
        consultantItem.textContent = consultant.Name;
          consultantItem.innerHTML += `<ul><li>Region: ${consultant.Regions}</li>`; // Region
          consultantItem.innerHTML += `<li>Sector: ${consultant.Sector}</li>`; // Spector
          consultantItem.innerHTML += `<li>Locations: ${consultant.Locations}</li>`;
          consultantItem.innerHTML += `<li>Accreditation: ${consultant.Accreditation}</li>`;
        // Add more columns as needed
        consultantItem.innerHTML += `</ul>`;
        consultantsList.appendChild(consultantItem);
      });
    }

    // Function to filter consultants by region
    function filterConsultants(region) {
      const filteredConsultants = consultantsData.filter(consultant => {
        const regions = consultant.Regions.split(', ');
        return regions.includes(region);
      });
      displayConsultants(filteredConsultants);
    }

    // Display all consultants initially
    displayConsultants(consultantsData);

    // Add event listeners to SVG shapes
    const shapes = document.querySelectorAll('svg path');
    shapes.forEach(shape => {
      shape.addEventListener('click', () => {
        const region = shape.getAttribute('id');
        filterConsultants(region);
      });
    });
  }

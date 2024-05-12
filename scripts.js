    // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
    const sheetId = "1rdhbt3X39SiSFgW7Qvw5mBUaQOn640i2V_0RI70Vbzs";
    // sheetNames are the names of the TABs in your spreadsheet
    const sheetNames = ["nz", "aus", "uk"];
    const sheetURLs = sheetNames.map(sheetName => `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`);

    $.each(sheetURLs, function(index, sheetURL) {
      $.ajax({
        type: "GET",
        url: sheetURL,
        dataType: "text",
        success: function (response) {
          var data = $.csv.toObjects(response);
          console.log("Data for Sheet " + (index + 1) + ":", data);
          // Call function to process the data
          processConsultants(data, index + 1);
        },
        error: function (xhr, status, error) {
          console.error("Error fetching data for Sheet " + (index + 1) + ":", error);
        }
      });
    });

    function processConsultants(consultantsData, listNumber) {
      const consultantsList = document.getElementById('consultants' + listNumber).getElementsByClassName('consultant-list')[0];
      // Function to display consultants
      function displayConsultants(consultants) {
        consultantsList.innerHTML = '';
        consultants.forEach(consultant => {
          const consultantItem = document.createElement('div');
              consultantItem.innerHTML = `<img src="${consultant.Image}">`; // Profile photo
              consultantItem.innerHTML += `<li class="accreditation-badge badge${consultant.Accreditation}"></li>`; // Accreditation badge
              consultantItem.innerHTML += `<h4>${consultant.Name}</h4>`; // Name
              consultantItem.innerHTML += `<li>${consultant.Company}</li>`; // Company
              consultantItem.innerHTML += `<li>${consultant.Landline}</li>`; // Landline
              consultantItem.innerHTML += `<li>${consultant.Cellphone}</li>`; // Cellphone
              consultantItem.innerHTML += `<li><span class="sector-icon ${consultant.Sector}Icon"></span>${consultant.Sector}</li>`; // Sector
              consultantItem.innerHTML += `<li>${consultant.Locations}</li>`; // Locations
              consultantItem.innerHTML += `<div class="bio-wrapper"><div class="read-bio">Read Bio +</div><div class="bio-blurb"><span>${consultant.Blurb}</span></div></div>`; // Bio blurb

              
              // Add more columns as needed
              consultantsList.appendChild(consultantItem);
        });

      }

      // Display all consultants initially
      displayConsultants(consultantsData);

      // initalize accordion after consultant has loaded
      // initAccordion();


      // Function to filter consultants by region
      function filterConsultants(region) {
        const filteredConsultants = consultantsData.filter(consultant => {
          const regions = consultant.Regions.split(', ');
          return regions.includes(region);
        });
        displayConsultants(filteredConsultants);
      }

      // Add event listeners to SVG shapes
      const shapes = document.querySelectorAll('svg path');
      shapes.forEach(shape => {
        shape.addEventListener('click', () => {
          const region = shape.getAttribute('id');
          filterConsultants(region);
        });
      });


      // Anytime a tab button is clicked it resets the filters
      var tabTitles = document.querySelectorAll('.tab-button');
      tabTitles.forEach(tabTitle => {
        tabTitle.addEventListener('click', () => {
          // show all consultants
          displayConsultants(consultantsData);

          // remove selected region from map
          const allPaths = document.querySelectorAll('svg path');
          allPaths.forEach(path => {
              path.classList.remove('region-active');
          });

        });
      });

    }
    
    // Country tabs
    // Get all tab elements
    var tabs = document.getElementsByClassName("tab");
    
    // Hide all tabs except the first one
    for (var i = 1; i < tabs.length; i++) {
      tabs[i].style.display = "none";
    }

    // Add event listeners to tab buttons
    document.getElementById("tabButton1").addEventListener("click", function() {
      openTab("tab1");
    });

    document.getElementById("tabButton2").addEventListener("click", function() {
      openTab("tab2");
    });

    document.getElementById("tabButton3").addEventListener("click", function() {
      openTab("tab3");
    });

    function openTab(tabName) {
      // Hide all tabs
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
      }

      // Get all tab buttons and remove the active class
      var tabButtons = document.getElementsByClassName("tab-button");
      for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active-tab-button");
      }

      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(tabName).style.display = "flex";
      document.getElementById("tabButton" + tabName.charAt(3)).classList.add("active-tab-button");
    }

    // Show the default tab on page load
    document.getElementById("tabButton1").classList.add("active-tab-button");


    // Highlight region
    function addActiveClassToPath(event) {
        // Remove 'active' class from all SVG paths
        const allPaths = document.querySelectorAll('svg path');
        allPaths.forEach(path => {
            path.classList.remove('region-active');
        });
        
        // Add 'active' class to the clicked SVG path
        const clickedPath = event.target;
        clickedPath.classList.add('region-active');
    }

    // Add event listeners to all SVG paths
    const svgPaths = document.querySelectorAll('svg path');
    svgPaths.forEach(path => {
        path.addEventListener('click', addActiveClassToPath);
    });


    // Open and close bio popups
    function openPopup(popupId) {
      const wrapper = document.querySelector('.bio-wrapper');
      const popup = document.getElementById(popupId);
      wrapper.innerHTML = '';
      wrapper.appendChild(popup);
      wrapper.classList.add('open');
    }

    document.addEventListener('DOMContentLoaded', () => {
      const buttons = document.querySelectorAll('.bio-wrapper');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const targetPopupId = button.getAttribute('data-target');
          openPopup(targetPopupId);
        });
      });
    });

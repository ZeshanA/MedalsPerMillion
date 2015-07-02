/* Author:Zeshan Amjad */

// Wrap in a self-invoking-anonymous function, passing jQuery as an argument

(function($){

	$(document).ready(function() {

		// Create object holding countries
		var countries = {},
			renderHTML = function(country) {
				console.log(country);
				var row = $('<tr class="row"></tr>').css("display", "block").appendTo('.table tbody'),
					countryName = $('<td class="country"><img class="flag" src="img/' + country.code + '.png" /><span class="country name">' + country.country + '</span></td>').appendTo(row),
					golds = $('<td class="golds">' + country.gold + '</td>').appendTo(row),
					silvers = $('<td class="silvers">' + country.silver + '</td>').appendTo(row),
					bronzes = $('<td class="bronzes">' + country.bronze + '</td>').appendTo(row),
					medals = $('<td class="medal">' + country.total + '</td>').appendTo(row),
					perMil = $('<td class="stat">' + (country.total / (country.population / 1000000)).toFixed(8) + '</td>').appendTo(row);
			},
			sortTable = function() {
				// Sort table according to medals per millions, set whole TH to be clickable for sorting
				TableSort.click(0, 2, "num");
				TableSort.click(0, 2, "num");

				// Show rows, hide loading.gif
				$('.row').show('slow');
				$('.loading').hide('slow');
			};

		// Request Olympic data
		$.getJSON('/data/olympic2.json', function(data){

			countries = data;

			// Request country code and statistics
			$.ajax({
				url: 'https://restcountries.eu/rest/v1/all',
				dataType: 'json',
				type: 'GET',
				error: function(a,b,c) {
					console.log(a);
					console.log(b);
					console.log(c);
				},
				success: function(data) {

					// Loop through each country in Olympic table
					for (var i = 0, countryName; i < countries.length; i++) {

						// Cache the current country name
						countryName = countries[i].country;

						// Loop through the country statistics array
						for (var j = 0; j < data.length; j++) {

							// If the country names match
							if(data[j].name === countryName) {

								// Transfer country statistics to its object in Olympic table
								countries[i].code = data[j].alpha2Code;
								countries[i].population = data[j].population;

								// Render HTML
								renderHTML(countries[i]);

								// Stop looping through the country statistics database
								break;
							}
						};

						// When stats for all countries added, run table sort
						if(i === countries.length - 1) {
							sortTable();
						}

					};

				}
			});

		})

	});

})(jQuery);
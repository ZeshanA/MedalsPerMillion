/* Author:Zeshan Amjad */

// Wrap in a self-invoking-anonymous function, passing jQuery as an argument

(function($){

	$(document).ready(function() {

		// Create object holding countries
		var countries = {},
			table = $('#table'),
			fixedHeaderWrap = $('#fixedHeaderWrap'),
			renderHTML = function(country) {

				// Create new row, cache and add it to table
				var row = $('<tr class="row"></tr>').hide().appendTo(table.find('tbody'));
				
				// Country name and flag image
				$('<td class="country"><div class="flag ' + country.code + '"></div><span class="country name">' + country.country + '</span></td>').appendTo(row);

				// Medal counts
				$('<td class="gold">' + country.gold + '</td>').appendTo(row);
				$('<td class="silver">' + country.silver + '</td>').appendTo(row);
				$('<td class="bronze">' + country.bronze + '</td>').appendTo(row);
				$('<td class="total">' + country.total + '</td>').appendTo(row);

				// Calculate medals per million people, truncate to 8 decimal places
				$('<td class="stat">' + (country.total / (country.population / 1000000)).toFixed(4) + '</td>').appendTo(row);
			},
			sortTable = function(table) {

				// Sort table according to medals per million
				table.stupidtable();
				table.find('th.stat').stupidsort('desc');

				// After table has been sorted (callback)
				table.bind('aftertablesort', function(){

					// Show rows, hide loading icon
					$('.row').show(500);
					$('.loading').hide('slow');

				})
			};

		// Request Olympic data
		$.getJSON('/data/olympic.json', function(data){

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

							// Sort
							sortTable(table);
							// Copy table, change ID and append to #fixedHeaderWrap
							table.clone().attr('id', 'fixedHeader').appendTo(fixedHeaderWrap);
							// Hide all of the clone except the header and add click sort events
							fixedHeaderWrap
								.height((fixedHeaderWrap.find('thead').outerHeight()) + 2)
								.find('th').click(function(){
									// Cache clicked header
									var $this = $(this);
										classes = $this.attr('class').split(' ');
									// If there are multiple classes, use the right one
									if($this.hasClass('medal')) {
										table.find('th.' + classes[1]).stupidsort();
									} else {
										table.find('th.' + classes[0]).stupidsort();
									}
								});

						}

					};

				}
			});

		})
		
		// Scroll handler
		$(window).scroll(function() {

			// If scrolled further than table header, and fixedHeader is invisible
			if(scrollY >= (table.offset().top) && fixedHeaderWrap.css('visibility') === 'hidden') {

				// Show fixed header
				fixedHeaderWrap.css('visibility', 'visible');
				// Hide normal header
				table.find('thead').css('visibility', 'hidden');

			} else if(scrollY < table.offset().top && fixedHeaderWrap.css('visibility') === 'visible') {
				// Hide fixed header
				fixedHeaderWrap.css('visibility', 'hidden');
				// Show normal header
				table.find('thead').css('visibility', 'visible');
			}
		});

	});

})(jQuery);
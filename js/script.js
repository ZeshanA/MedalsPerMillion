/* Author:Zeshan Amjad */

// Wrap in a self-invoking-anonymous function, passing jQuery as an argument

(function($){

	$(document).ready(function() {

		// Raw maps of ISO codes for countries + populations
		var countries,
			nameToISO;

		$.ajax({
			url: 'https://restcountries.eu/rest/v1/all',
			dataType: 'jsonp',
			success:function(data){
				console.log(data);
				countries = data,
				nameToISO = function(countryName) {
					var matchFound = false;
					for(var i=0, len = countries.length; i<len; i++) {
						matchFound = countries[i].name === countryName;
						if(matchFound) {
							return countries[i].alpha2Code;
						}
					}
				},

				// Olympic Medals

				$.getJSON('/data/olympic2.json', function(results){
					var countryName,
						countryCode,
						i;
					for(i=0;i<results.length;i++) {
						countryName = results[i].name;
						console.log(nameToISO(countryName));
					}
				});
			}
		});

	});

})(jQuery);
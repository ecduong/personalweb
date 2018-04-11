function getBracket()
{
	var database = firebase.database();
	
	database.ref().once("value", snapshot => {
			formatBracket(snapshot);
	});
}

function formatBracket(snapshot)
{
	var year = document.getElementById("year").value;
	var champions = document.getElementById("cup-champions");
	var abbrev_path = "/matches/" + year.toString() + "/";
	var logos_path = "/team_logos/" + year.toString() + "/";
	var location_path = "/places/";
	var fields = getSeriesIDs(); // Firebase series references
	var bracket_elements = getFields(); // HTML elements for each field
	
	// Store data for presentation
	var abbreviations = new Array(); // Location abbreviations
	var locations = new Array(); // Full location name
	var winners = new Array(); // Series winners
	var logos = new Array() // Team logos
	
	// Pull the abbreviations, location names, team names and logos
	for(var i = 0; i < 15; i++)
	{
		abbreviations[2*i] = snapshot.child(abbrev_path + fields[i]).val().team_1;
		abbreviations[2*i+1] = snapshot.child(abbrev_path + fields[i]).val().team_2;
		locations[2*i] = snapshot.child(location_path + abbreviations[2*i]).val();
		locations[2*i+1] = snapshot.child(location_path + abbreviations[2*i+1]).val();
		logos[2*i] = snapshot.child(logos_path + abbreviations[2*i]).val();
		logos[2*i+1] = snapshot.child(logos_path + abbreviations[2*i+1]).val();
		winners[i] = snapshot.child(abbrev_path + fields[i]).val().winner;
	}
	
	// Show rounds
	showRound(1, bracket_elements, logos, locations);
	showRound(2, bracket_elements, logos, locations);
	showRound(3, bracket_elements, logos, locations);
	showRound(4, bracket_elements, logos, locations);
	
	// Show winners and losers
	showResults(1, bracket_elements, abbreviations, winners);
	showResults(2, bracket_elements, abbreviations, winners);
	showResults(3, bracket_elements, abbreviations, winners);
	showResults(4, bracket_elements, abbreviations, winners);
	
	champions.innerHTML = "<b>Stanley Cup Champions:</b> " + winners[14];
	//champions.style.display = "block";
	
}

function showRound(round_num, bracket_elements, logos, locations)
{
	var counter_start = [0, 8, 12, 14, 15];
	for(var i = counter_start[round_num-1]; i < counter_start[round_num]; i++)
	{
		bracket_elements[2*i].innerHTML = "<div class='logo'><img class='logo-img' src='/images/nhl/" + logos[2*i] + "'></div>" + "&nbsp;" + locations[2*i];
		bracket_elements[2*i+1].innerHTML = "<div class='logo'><img class='logo-img' src='/images/nhl/" + logos[2*i+1] + "'></div>" + "&nbsp;" + locations[2*i+1];
		//bracket_elements[2*i].style.display = "block";
		//bracket_elements[2*i+1].style.display = "block";
	}
}

function showResults(round_num, bracket_elements, abbreviations, winners)
{
	var counter_start = [0, 8, 12, 14, 15];
	for(var i = 2*counter_start[round_num-1]; i < 2*counter_start[round_num]; i++)
	{
		var top_bottom = i%2+1;
		var field_id = "series-" + String.fromCharCode(97 + Math.floor(i/2)) + top_bottom.toString();
		if(abbreviations[i] == winners[Math.floor(i/2)])
		{
			$("#" + field_id).addClass("winner");
		}
		else
		{
			$("#" + field_id).addClass("loser");
			$("#" + field_id + " img").addClass("img-loser");
		}
	}
}

function updateBracket()
{
	var fields = getSeriesIDs(); // "series_a"
	var bracket_elements = getFields();
	var champions = document.getElementById("cup-champions");
	
	// Hide the now outdated fields
	for(var i = 0; i < 30; i++)
	{
		var top_bottom = i%2+1;
		var field_id = "series-" + String.fromCharCode(97 + Math.floor(i/2)) + top_bottom.toString();
		//bracket_elements[i].style.display = "none";
		$("#" + field_id).removeClass("winner");
		$("#" + field_id).removeClass("loser");
		$("#" + field_id).removeClass("img-loser");
	}
	
	//champions.style.display = "none";
	
	getBracket();
}

/**
 * Get the firebase child name for the series directories
 *
 */
function getSeriesIDs()
{
	var series_ids = new Array();
	for(var i = 0; i < 15; i++)
	{
		var series = "series_" + String.fromCharCode(97 + Math.floor(i));
		series_ids[i] = series;
	}
	
	return series_ids;
}

/** Get all the element IDs for the bracket
 *
 * @return array - a collection of the element IDs 
 */
function getFields()
{
	var bracket_elements = new Array();
	for(var i = 0; i < 30; i++)
	{
		var top_bottom = i%2+1;
		var field_id = "series-" + String.fromCharCode(97 + Math.floor(i/2)) + top_bottom.toString();
		bracket_elements[i] = document.getElementById(field_id);
	}
	
	return bracket_elements;
}
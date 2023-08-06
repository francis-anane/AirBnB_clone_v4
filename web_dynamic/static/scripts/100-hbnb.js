$(document).ready(function () {
  const CheckedAmenities = {};
  $(document).on('change', '#select_amenity', function () {
    if (this.checked) {
      CheckedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete CheckedAmenities[$(this).attr('data-id')];
    }
    const obj = Object.values(CheckedAmenities);
    console.log(obj);
    if (obj.length > 3) {
      $('#filter_amen_list').text(obj.sort().slice(0, 3).join(', ') + '...');
    } else if (obj.length <= 3) {
      $('#filter_amen_list').text(obj.sort().join(', '));
    }
  });

  const CheckedStates = {};
  $(document).on('change', '#select_state', function () {
    if (this.checked) {
      CheckedStates[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete CheckedStates[$(this).attr('data-id')];
    }
    const obj = Object.values(CheckedStates);
    console.log(obj);
    if (obj.length > 3) {
      $('#filter_state_city').text('States: ' + obj.sort().slice(0, 3).join(', ') + '...');
    } else if (obj.length <= 3) {
      $('#filter_state_city').text(obj.sort().join(', '));
    }
  });

  const CheckedCities = {};
  $(document).on('change', '#select_city', function () {
    if (this.checked) {
      CheckedCities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete CheckedCities[$(this).attr('data-id')];
    }
    const obj = Object.values(CheckedCities);
    console.log(obj);
    if (obj.length > 3) {
      $('#filter_state_city').text('Cities: ' + obj.sort().slice(0, 3).join(', ') + '...');
    } else if (obj.length <= 3) {
      $('#filter_state_city').text('Cities: ' + obj.sort().join(', '));
    }
  });

  $.getJSON('http://127.0.0.1:5001/api/v1/status/',
    function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  );

  const users = {};
  $.getJSON('http://127.0.0.1:5001/api/v1/users/',
    function (data) {
      for (const user of data) {
        users[user.id] = user.first_name + ' ' + user.last_name;
      }
    }
  );

  const usersDict = {};
  $.getJSON('http://127.0.0.1:5001/api/v1/users/',
    function (data) {
      for (user of data) {
        usersDict[user.id] = user.first_name + ' ' + user.last_name;
      }
    }
  );

  function show_places (amenities, states, cities) {
    let amenity = {};
    let state = {};
    let city = {};
    if (amenities !== undefined) {
      const amenity_ids = [];
      for (const id in amenities) {
        amenity_ids.push(id.toString());
      }
      amenity = { amenities: amenity_ids };
    }
    if (states !== undefined) {
      const state_ids = [];
      for (const id in states) {
        state_ids.push(id.toString());
      }
      state = { states: state_ids };
    }
    if (cities !== undefined) {
      const city_ids = [];
      for (const id in cities) {
        city_ids.push(id.toString());
      }
      city = { cities: city_ids };
    }
    const filters = { filters: [amenity, state, city] };
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      success: function (data) {
        $('section.places').html('');
        for (const place of data) {
          const amenitiesDict = {};
          $.getJSON('http://127.0.0.1:5001/api/v1/places/' + place.id + '/amenities',
            function (data) {
              for (amens of data) {
                amenitiesDict[amens.id] = amens.name;
              }
            }
          );

          const reviewsDict = {};
          $.getJSON('http://127.0.0.1:5001/api/v1/places/' + place.id + '/reviews',
            function (data) {
              for (revw of data) {
                reviewsDict[revw.user_id] = {};
                reviewsDict[revw.user_id].name = usersDict[revw.user_id];
                reviewsDict[revw.user_id].date = revw.created_at;
                reviewsDict[revw.user_id].text = revw.text;
              }
            }
          );

          const amenitiesList = $('<ul></ul>');
          for (amens in amenitiesDict) {
            amenitiesList.append(`<li><p>${amenitiesDict[amens]}</p></li>`);
          }

          const reviewsList = $("<ul id='HTMLreview'></ul>");
          for (revw in reviewsDict) {
            reviewsList.append(`
              <li>
                <h3>From ${reviewsDict[revw].name} the ${reviewsDict[revw].date}:</h3>
                <p>
                  ${reviewsDict[revw].text}
                </p>
              </li>`);
          }

          console.log(amenitiesList);
          console.log(reviewsList);

          const article = $('<article></article>');
          article.html(`
            <div class="header_place">
              <div class="place_name"><h2>${place.name}</h2></div>
              <div class="price_by_night">
                <p>$${place.price_by_night}</p>
              </div>
            </div>
            <div class="information">
              <div class="max_guest">
                <div class="img"></div>
                <p>${place.max_guest} Guest(s)</p>
              </div>
              <div class="number_rooms">
                <div class="img"></div>
                <p>${place.number_rooms} Bedroom(s)</p>
              </div>
              <div class="number_bathrooms">
                <div class="img"></div>
                <p>${place.number_bathrooms} Bathroom(s)</p>
              </div>
            </div>
            <div class="user">
              <p><b>Owner:</b> ${users[place.user_id]}</p>
            </div>
            <div class="description">
              <p>
                ${place.description}
              </p>
            </div>
            <div class="amenities">
              <h2>Amenities</h2>
              ${amenitiesList.html()}
            </div>
            <div class="reviews">
              <h2>Reviews</h2>
              ${reviewsList.html()}
            </div>`);
          $('section.places').append(article);
        }
      }
    });
  }

  show_places();

  $('button#bt_search').click(function () {
    show_places(CheckedAmenities, CheckedStates, CheckedCities);
  });
});

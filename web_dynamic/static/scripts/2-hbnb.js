$(document).ready(function () {
  const CheckedAmenities = {};
  $(document).on('change', '#select_amenity', function () {
    if (this.checked) {
      CheckedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete CheckedAmenities[$(this).attr('data-id')];
    }
    const Obj = Object.values(CheckedAmenities);
    if (Obj.length > 3) {
      $('#filter_amen_list').text(Obj.sort().slice(0, 3).join(', ') + '...');
    } else if (Obj.length <= 3) {
      $('#filter_amen_list').text(Obj.sort().join(', '));
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
});

$( document ).ready(function() {

	// TODO: handle basepath better here
	
	var current_url = window.location.href;
	
	var re = /\/\w+\.htm\S$/;
	if ( re.test( current_url ) ){
		current_url.replace( re , "/");
	}
	
	current_url.replace( /\/+$/, "/" );
	
	if( current_url.substr(-1) == '/' ) {
		current_url = current_url + "list";
	} else {
		current_url = current_url + "/list";
	}
	
	// http://stackoverflow.com/questions/5052543/how-to-fire-ajax-request-periodically
	(function worker() {
		$.ajax({
			url: current_url, 
			success: function(data) {
				if ( data.length > 0 ) {
					$( "#list ").empty();
					$( "#list ").append("<ul>");
					// TODO: Put a limit, show more, maybe, offset in get?
					$.each( data, function( index, value ) {
						if ( value.name && value.name !== '' ) {
							$( "#list ").append("<li>"+value.name+"</li>");
						}
					});
					$( "#list ").append("</ul>");
				}
				
			},
			complete: function() {
				// Schedule the next request when the current one's complete
				setTimeout(worker, 10000);
			}
		});
	})();
	
	(function mapinit() {
	
		var coordstr = $("#map").data("coords");
		
		if ( coordstr ) {
			
			var coords = coordstr.split(",");
			var coordsFloat = coords.map(function (x) { 
				return parseFloat(x, 10); 
			});
			
			var iconFeature = new ol.Feature({
			  geometry: new ol.geom.Point( ol.proj.transform(coordsFloat, 'EPSG:4326', 'EPSG:3857') ),
			  name: 'Event'
			});
	
			var iconStyle = new ol.style.Style({
			  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
				anchor: [0.5, 46],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: 0.75,
				src: 'marker.png'
			  }))
			});
	
			iconFeature.setStyle(iconStyle);
	
			var vectorSource = new ol.source.Vector({
			  features: [iconFeature]
			});
	
			var vectorLayer = new ol.layer.Vector({
			  source: vectorSource
			});
	
			var map = new ol.Map({
			target: 'map',
			layers: [
			  new ol.layer.Tile({
				source: new ol.source.OSM()
			  }), vectorLayer
			],
			view: new ol.View({
			  center: ol.proj.transform(coordsFloat, 'EPSG:4326', 'EPSG:3857'),
			  zoom: 16
			})
			});
		
		}
	})();
	

});

$( document ).ready(function() {


	$("input[name='admin']").bind("enterKey",function(e){
		var password = $(this).val();
		
		$.post( "./admin/list", { admin: password })
		.done(function( data ) {
			if ( data && data.length > 0 ) {
				var str = "<ul>";
				$(data).each( function( i ) {
					str = str + "<li>";
					if ( this.name ) {
						str = str + this.name + " ";
					}
					
					str = str + "<" + this.email +">";
					
					if ( this.verified === 1 ) {
						str = str + " VERIFIED";
					}
					
					str = str + "</li>";
				});
				
				str = str + "</ul>";
				$("#listadmin").append( str );
			}
		});
	});
	$("input[name='admin']").keyup(function(e){
		if(e.keyCode == 13)
		{
			$(this).trigger("enterKey");
		}
	});

});




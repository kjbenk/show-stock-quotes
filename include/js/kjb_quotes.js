/*
 * Created by Kyle Benk
 * http://kylebenkapps.com
 *
 * Google Finance Credit to http://jsfiddle.net/A4jKT/4/
 */

jQuery(document).ready(function($) {

	var url = "http://www.google.com/finance/info?infotype=infoquoteall";

	var tables = $(".kjb_show_stock_quotes_table");

	for (var x = 0; x < tables.length; x++) {

		var stocks = $("#kjb_show_stock_quotes_widget_" + $(tables[x]).attr('id')).val();

		get_stock_data(url, $(tables[x]).attr('id'), $("#kjb_show_stock_quotes_id_color_" + $(tables[x]).attr('id')).val(), stocks);
	}
});

function get_stock_data(url, table_id, color, stocks) {

    $.getJSON(url + '&q=' + stocks + "&callback=?")
        .done(function (data) {

	        if (typeof(data) != "undefined" && data !== null) {

	        	for (q = 0; q < data.length; q++) {

		        	var symbol = data[q].t.replace('^', '-');
					symbol = symbol.replace('.', '_');
					var last_price = data[q].l;
					var last_change = data[q].c;

					if (last_change <= 0) {
			        	if (color == 'change') {
				        	$(".kjb_show_stock_quotes_quote_" + table_id + symbol).attr('style', 'border: none; color:red; text-align:right');
			        	}else {
				        	$(".kjb_show_stock_quotes_quote_" + table_id + symbol).attr('style', 'border: none; text-align:right');
			        	}

						$(".kjb_show_stock_quotes_change_" + symbol).attr('style', 'border: none; color:red; text-align:right');
			        }else{
			        	if (color == 'change') {
			        	 $(".kjb_show_stock_quotes_quote_" + table_id + symbol).attr('style', 'border: none;color:green; text-align:right');
			        	}else {
				        	$(".kjb_show_stock_quotes_quote_" + table_id + symbol).attr('style', 'border: none; text-align:right');
			        	}

						$(".kjb_show_stock_quotes_change_" + symbol).attr('style', 'border: none;color:green; text-align:right');
			        }

			        var price = (Math.round(last_price * 100) / 100).toFixed(2);
			        var change = (Math.round(last_change * 100) / 100).toFixed(2);

			        $(".kjb_show_stock_quotes_quote_" + table_id + symbol).text(price);
					$(".kjb_show_stock_quotes_change_" + symbol).text(change);

					if (last_price == 0) {
						if (color == 'change') {
							$(".kjb_show_stock_quotes_quote_" + table_id + symbol).attr('style', 'border: none;color:red; text-align:right');
						}else {
				        	$(".kjb_show_stock_quotes_quote_" + table_id + symbol).attr('style', 'border: none; text-align:right');
			        	}

						$(".kjb_show_stock_quotes_change_" + symbol).attr('style', 'border: none;color:red; text-align:right');
						$(".kjb_show_stock_quotes_quote_" + table_id + symbol).text('Invalid');
						$(".kjb_show_stock_quotes_change_" + symbol).text('Invalid');
					}
	        	}

	        }
    })
        .fail(function (jqxhr, textStatus, error) {
        	var err = textStatus + ", " + error;
        	//console.log(err);
    });
}
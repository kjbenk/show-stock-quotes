/*
 * Created by Kyle Benk
 * http://kylebenkapps.com
 *
 * Credit to http://jsfiddle.net/vlad_bezden/RU8Jq/
 */

jQuery(document).ready(function($) {

	var url = "https://query.yahooapis.com/v1/public/yql";
		
	var tables = $(".kjb_show_stock_quotes_table");
	
	for (var x = 0; x < tables.length; x++) {
	
		var stocks = $("#kjb_show_stock_quotes_widget_" + $(tables[x]).attr('id')).val();
		
		get_stock_data(url, $(tables[x]).attr('id'), $("#kjb_show_stock_quotes_id_color_" + $(tables[x]).attr('id')).val(), stocks);
	}
});

function get_stock_data(url, table_id, color, stocks) {

	var data = encodeURIComponent('select * from csv where url="http://download.finance.yahoo.com/d/quotes.csv?s=' + stocks + '&f=sl1c1&e=.csv"');
			
    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env")
        .done(function (data) {
	        
	        if (typeof(data.query.results) != "undefined" && data.query.results !== null) {
	        	
	        	for (q = 0; q < data.query.results.row.length; q++) {
	        	
	        		var quote = data.query.results.row[q];
		        	var symbol = quote.col0.replace('^', '-');
					symbol = symbol.replace('.', '_');
					var last_price = quote.col1;
					var last_change = quote.col2;
					
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
/*
 * Created by Kyle Benk
 * http://kylebenkapps.com
 *
 * Credit to http://jsfiddle.net/vlad_bezden/RU8Jq/
 */

jQuery(document).ready(function($) {

	var url = "http://query.yahooapis.com/v1/public/yql";
		
	var tables = $(".kjb_show_stock_quotes_table");
	
	for (var x = 0; x < tables.length; x++) {
	
		var stocks = $("#kjb_show_stock_quotes_widget_" + $(tables[x]).attr('id')).val();
		
		get_rss_feed(url, $(tables[x]).attr('id'), $("#kjb_show_stock_quotes_id_rss_num_" + $(tables[x]).attr('id')).val(), stocks);
		
		get_stock_data(url, $(tables[x]).attr('id'), $("#kjb_show_stock_quotes_id_color_" + $(tables[x]).attr('id')).val(), stocks);
	}
});


function get_rss_feed(url, table_id, rss_num, stocks) {
	
	var yql_url = encodeURIComponent("select * from feed where url='http://finance.yahoo.com/rss/headline?s=" + stocks + "'");
	
	$.getJSON(url, 'q=' + yql_url + "&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env")
		.done(function (data) {
			console.log(rss_num);
			for (var k = 0; k < rss_num; k++) {
			
				$("#kjb_show_stock_quotes_rss_" + table_id).append('<li style="border:none;"><a href="' +  data.query.results.item[k].link + '" target="_blank">' + data.query.results.item[k].title + '</a></li>');
				
			} 					
			
	    })
	    .fail(function (data) {
		    //console.log('fail');
	    });
}

function get_stock_data(url, table_id, color, stocks) {

	var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + stocks + "')");
			
    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env")
        .done(function (data) {
	        
	        if (typeof(data.query.results) != "undefined" && data.query.results !== null) {
	        	
	        	for (q = 0; q < data.query.results.quote.length; q++) {
	        	
	        		var quote = data.query.results.quote[q];
		        	quote.Symbol = quote.Symbol.replace('^', '-');
					quote.Symbol = quote.Symbol.replace('.', '_');
					
					if (data.query.results.quote.Change <= 0) {
			        	if (color == 'change') {
				        	$(".kjb_show_stock_quotes_quote_" + table_id + quote.Symbol).attr('style', 'border: none; color:red; text-align:right'); 
			        	}else {
				        	$(".kjb_show_stock_quotes_quote_" + table_id + quote.Symbol).attr('style', 'border: none; text-align:right'); 
			        	}
				        
						$(".kjb_show_stock_quotes_change_" + quote.Symbol).attr('style', 'border: none; color:red; text-align:right');
			        }else{
			        	if (color == 'change') {
			        	 $(".kjb_show_stock_quotes_quote_" + table_id + quote.Symbol).attr('style', 'border: none;color:green; text-align:right');			      
			        	}else {
				        	$(".kjb_show_stock_quotes_quote_" + table_id + quote.Symbol).attr('style', 'border: none; text-align:right'); 
			        	}
				         
						$(".kjb_show_stock_quotes_change_" + quote.Symbol).attr('style', 'border: none;color:green; text-align:right');
			        }
			        
			        var price = (Math.round(quote.LastTradePriceOnly * 10) / 10).toFixed(2);
			        var change = (Math.round(quote.Change * 10) / 10).toFixed(2);
			        
			        $(".kjb_show_stock_quotes_quote_" + table_id + quote.Symbol).text(price);
					$(".kjb_show_stock_quotes_change_" + quote.Symbol).text(change);
					
					if (quote.LastTradePriceOnly == 0) {
						if (color == 'change') {
							$(".kjb_show_stock_quotes_quote_" + table_id + quote.Symbol).attr('style', 'border: none;color:red; text-align:right'); 
						}else {
				        	$(".kjb_show_stock_quotes_quote_" + table_id + quote.Symbol).attr('style', 'border: none; text-align:right'); 
			        	}
						
						$(".kjb_show_stock_quotes_change_" + quote.Symbol).attr('style', 'border: none;color:red; text-align:right');
						$(".kjb_show_stock_quotes_quote_" + table_id + quote.Symbol).text('Invalid');
						$(".kjb_show_stock_quotes_change_" + quote.Symbol).text('Invalid');
					}
	        	}
		        
	        }
    })
        .fail(function (jqxhr, textStatus, error) {
        	var err = textStatus + ", " + error;
        	//console.log(err);
    });
}
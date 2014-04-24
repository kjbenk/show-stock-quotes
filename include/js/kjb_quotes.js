/*
 * Created by Kyle Benk
 * http://kylebenkapps.com
 *
 * Credit to http://jsfiddle.net/vlad_bezden/RU8Jq/
 */

jQuery(document).ready(function($) {
	
	if (typeof(passed_data) != "undefined" && passed_data !== null) {
		for (var i = 0; i < passed_data.out.length; i++) {
		
			var url = "http://query.yahooapis.com/v1/public/yql";
		    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + passed_data.out[i] + "')");
		
		    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env")
		        .done(function (data) {
			        
			        if (typeof(data.query.results) != "undefined" && data.query.results !== null) {
			        
			        	data.query.results.quote.Symbol = data.query.results.quote.Symbol.replace('^', '-');
			        	data.query.results.quote.Symbol = data.query.results.quote.Symbol.replace('.', '_');
			        
				        if (data.query.results.quote.Change <= 0) {
				        	if (passed_data.quote_display_color == 'change') {
					        	$(".kjb_show_stock_quotes_quote_" + data.query.results.quote.Symbol).attr('style', 'border: none; color:red; text-align:right'); 
				        	}else {
					        	$(".kjb_show_stock_quotes_quote_" + data.query.results.quote.Symbol).attr('style', 'border: none; text-align:right'); 
				        	}
					        
							$(".kjb_show_stock_quotes_change_" + data.query.results.quote.Symbol).attr('style', 'border: none; color:red; text-align:right');
				        }else{
				        	if (passed_data.quote_display_color == 'change') {
				        	 $(".kjb_show_stock_quotes_quote_" + data.query.results.quote.Symbol).attr('style', 'border: none;color:green; text-align:right');			      
				        	}else {
					        	$(".kjb_show_stock_quotes_quote_" + data.query.results.quote.Symbol).attr('style', 'border: none; text-align:right'); 
				        	}
					         
							$(".kjb_show_stock_quotes_change_" + data.query.results.quote.Symbol).attr('style', 'border: none;color:green; text-align:right');
				        }
				        
				        var price = (Math.round(data.query.results.quote.LastTradePriceOnly * 10) / 10).toFixed(2);
				        var change = (Math.round(data.query.results.quote.Change * 10) / 10).toFixed(2);
				        
				        $(".kjb_show_stock_quotes_quote_" + data.query.results.quote.Symbol).text(price);
						$(".kjb_show_stock_quotes_change_" + data.query.results.quote.Symbol).text(change);
						
						if (data.query.results.quote.LastTradePriceOnly == 0) {
							if (passed_data.quote_display_color == 'change') {
								$(".kjb_show_stock_quotes_quote_" + data.query.results.quote.Symbol).attr('style', 'border: none;color:red; text-align:right'); 
							}else {
					        	$(".kjb_show_stock_quotes_quote_" + data.query.results.quote.Symbol).attr('style', 'border: none; text-align:right'); 
				        	}
							
							$(".kjb_show_stock_quotes_change_" + data.query.results.quote.Symbol).attr('style', 'border: none;color:red; text-align:right');
							$(".kjb_show_stock_quotes_quote_" + data.query.results.quote.Symbol).text('Invalid');
							$(".kjb_show_stock_quotes_change_" + data.query.results.quote.Symbol).text('Invalid');
						}
			        } /*
else {
			        	console.log('fail');
			        	console.log('--'  + $(".kjb_show_stock_quotes_error").text() + '--');
			        	
			        	if ($(".kjb_show_stock_quotes_error").text() == null) {
				        	$(".kjb_show_stock_quotes_error").attr('style', 'border: none;color:red; text-align:right');
							$(".kjb_show_stock_quotes_error").text('Failed');
			        	}
						
			        }
*/
		    })
		        .fail(function (jqxhr, textStatus, error) {
		        	var err = textStatus + ", " + error;
		        	//console.log(err);
		    });
		}
	}
});
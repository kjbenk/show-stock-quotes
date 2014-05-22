<?php
/*
Plugin Name: Show Stock Quotes
Plugin URI: http://kylebenkapps.com/wordpress-plugins/
Description: Show stock quotes updated in real-time.
Version: 2.0.2
Author: Kyle Benk
Author URI: http://kylebenkapps.com
License: GPL2
*/

/* Plugin verison */

if (!defined('KJB_SHOW_STOCK_QUOTES_VERSION_NUM'))
    define('KJB_SHOW_STOCK_QUOTES_VERSION_NUM', '2.0.2');
    
/** 
 * Activatation / Deactivation 
 */  

register_activation_hook( __FILE__, array('kjb_Show_Stocks', 'register_activation'));

add_action('wp_enqueue_scripts', array('kjb_Show_Stocks', 'frontend_include_scripts'));

$plugin = plugin_basename(__FILE__); 
add_filter("plugin_action_links_$plugin", array('kjb_Show_Stocks', 'show_stock_quotes_widget_link'));
 
class kjb_Show_Stocks extends WP_Widget {

	private static $version_setting_name = 'kjb_show_stock_quotes_version';

	/**
	 * Hooks to 'init' 
	 * 
	 * @since 1.0.0
	 */
	static function register_activation() {
	
		/* Check if multisite, if so then save as site option */
		
		if (is_multisite()) {
			add_site_option(self::$version_setting_name, KJB_SHOW_STOCK_QUOTES_VERSION_NUM);
		} else {
			add_option(self::$version_setting_name, KJB_SHOW_STOCK_QUOTES_VERSION_NUM);
		}
	}
	
	/**
	 * Hooks to 'plugin_action_links_' filter 
	 * 
	 * @since 1.0.0
	 */
	static function show_stock_quotes_widget_link($links) { 
		$widget_link = '<a href="widgets.php">Widget</a>'; 
		array_unshift($links, $widget_link); 
		return $links; 
	}
	
	function kjb_Show_Stocks(){
		$widget_ops = array( 'classname' => 'kjb_show_stocks', 'description' => 'Display stock data in real-time.' );
		
		$this->options[] = array(
			'name'  => 'title', 'label' => 'Title',
			'type'	=> 'text', 	'default' => 'Stocks'	
		);
		
		for ($i = 1; $i < 21; $i++) {
			$this->options[] = array(
				'name'	=> 'stock_' . $i,	'label'	=> 'Stock Tickers',
				'type'	=> 'text',	'default' => ''			
			);
		}
		
		parent::WP_Widget(false, 'Show Stock Data', $widget_ops);	
	}
	
	
	/** @see WP_Widget::widget */
    function widget($args, $instance) {
		
		extract( $args );
		
		$title = $instance['title'];
		
		echo $before_widget;
		
		if ( $title != '') {
			echo $before_title . $title . $after_title;
		}else {
			echo 'Make sure settings are saved.';
		}
		
		$tickers = array();
		
		for ($i = 1; $i < 21; $i++) {
			
			$ticker = $instance['stock_' . $i];
			
			if ($ticker != '') {
				$tickers[] = $ticker;
			}
		}
		
		//$this->kjb_get_stock_data($instance, $this->id);
		
		//Display all stock data
		?>
		<table class="kjb_show_stock_quotes_table" id="<?php echo $this->id; ?>">
		  <col width='20%'>
		  <col width='40%'>
		  <col width='40%'>
		<?php
		foreach($tickers as $ticker) { 
			
			$new_ticker = str_replace('^', '-', $ticker);
			$new_ticker = str_replace('.', '_', $new_ticker);
		?>
			<tr style="border:none;"> 
				<td class="kjb_show_stock_quotes_ticker" style="border: none;"> <a target="_blank" href="http://finance.yahoo.com/q?s=<?php echo $ticker; ?>"><?php echo $ticker; ?></a></td> 
				<td class="kjb_show_stock_quotes_quote_<?php echo $this->id . $new_ticker; ?> kjb_show_stock_quotes_error"></td>
				<td class="kjb_show_stock_quotes_change_<?php echo $new_ticker; ?> kjb_show_stock_quotes_error"></td>
			</tr>
			
			<tr style="border:none;">
				<td style="border:none;">
					<input style="display:none;" id="kjb_show_stock_quotes_widget_<?php echo $this->id; ?>" value="<?php echo implode(',', $tickers); ?>"/>
				</td>
			</tr>
			
			<tr style="border:none;">
				<td style="border:none;">
					<input style="display:none;" id="kjb_show_stock_quotes_id_color_<?php echo $this->id; ?>" value="<?php echo isset($instance['quote_display_color']) ? $instance['quote_display_color'] : 'change'; ?>"/>
				</td>
			</tr>
			
			<tr style="border:none;">
				<td style="border:none;">
					<input style="display:none;" id="kjb_show_stock_quotes_id_rss_num_<?php echo $this->id; ?>" value="<?php echo isset($instance['rss_num']) ? $instance['rss_num'] : '0'; ?>"/>
				</td>
			</tr>
			
			<tr class="kjb_show_stock_quotes_rss_<?php echo $this->id; ?>" style="border:none;">
				<td style="border:none;">
				</td>
			</tr>
		<?php }
		?></table>
		
		<ul style="list-style-type:circle;" id="kjb_show_stock_quotes_rss_<?php echo $this->id; ?>" style="border:none;">
			
		</ul>
		<?php
		
		echo $after_widget;
    }

    /** @see WP_Widget::update */
    function update($new_instance, $old_instance) {				
		$instance = array();
		
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		$instance['quote_display_color'] = ( ! empty( $new_instance['quote_display_color'] ) ) ? strip_tags( $new_instance['quote_display_color'] ) : '';
		$instance['rss_num'] = ( ! empty( $new_instance['rss_num'] ) ) ? strip_tags( $new_instance['rss_num'] ) : '';
		
		foreach ($this->options as $val) {
			$instance[$val['name']] = strip_tags(isset($new_instance[$val['name']]) ? $new_instance[$val['name']] : '');
		}
		
        return $instance;
    }
    
	/** @see WP_Widget::form */
    function form($instance) {
    	
    	if (isset($instance['title'])){
	    	$title = $instance['title'];
    	}else{
	    	$title = __('New title');    	
	    }
	    
	    if (isset($instance['quote_display_color'])){
	    	$quote_display_color = $instance['quote_display_color'];
    	}else{
	    	$quote_display_color = 'change';    	
	    }
	    
	    if (isset($instance['rss_num'])){
	    	$rss_num = $instance['rss_num'];
    	}else{
	    	$rss_num = '0';    	
	    }
	    
	   
    	?>
    	
    	<!-- Title -->
    	
    	<p>
			<label for="<?php echo $this->get_field_name( 'title' ); ?>"><?php _e( 'Title' ); ?></label> 
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
    	</p>
    	
    	<!-- Quote Display Color -->
    	
    	<p>
    		<label><?php _e( 'Quote Display Color' ); ?></label><br/>
    		
    		<input type="radio" id="<?php echo $this->get_field_id( 'quote_display_color' ); ?>" name="<?php echo $this->get_field_name( 'quote_display_color' ); ?>" value="black" <?php echo isset($quote_display_color) && $quote_display_color == 'black' ? "checked" : ""; ?>/><label><?php _e('Same as symbol'); ?></label><br/>
    		<input type="radio" id="<?php echo $this->get_field_id( 'quote_display_color' ); ?>" name="<?php echo $this->get_field_name( 'quote_display_color' ); ?>" value="change" <?php echo isset($quote_display_color) && $quote_display_color == 'change' ? "checked" : ""; ?>/><label><?php _e('Same as change color'); ?></label>
    	</p>
    	
    	<!-- Number of RSS Feeds -->
    	
    	<p>
    		<label for="<?php echo $this->get_field_name( 'rss_num' ); ?>"><?php _e( 'Number of RSS Feeds' ); ?></label>
    		
    		<select id="<?php echo $this->get_field_id( 'rss_num' ); ?>" name="<?php echo $this->get_field_name( 'rss_num' ); ?>">
    			<?php for ($x = 0; $x < 21; $x++) { ?>
    			<option value="<?php echo $x; ?>" <?php echo isset($rss_num) && (int) $rss_num == $x ? 'selected' : ''; ?>><?php echo $x; ?></option>
				<?php } ?>
    		</select><br/>
    		<em><label><?php _e( 'RSS feeds will only show if all stock tickers are valid.  Also, this feature does not work with indices yet, so please exclude them if you want the RSS to work.' ); ?></label></em>
    	</p>
    	
    	<!-- Stock Tickers -->
    	
    	<p>
			<label><?php _e( 'Stock Tickers' ); ?></label>
			<ol>
			
			<?php
			for ($i = 1; $i < 21; $i++) {
				$stock = isset($instance['stock_'.$i]) ? $instance['stock_'.$i] : '';
				?>
				<li><input class="widefat" id="<?php echo $this->get_field_id( 'stock_'.$i ); ?>" name="<?php echo $this->get_field_name('stock_' . $i); ?>" type="text" value="<?php echo esc_attr( $stock ); ?>" /></li>
				<?php
			}
			?>
			</ol>
		</p>
		<?php 
	}
	
	
	static function frontend_include_scripts() {
	
		wp_enqueue_script('jquery_kjb', plugins_url('include/js/jquery-1.11.1.min.js', __FILE__));
		wp_enqueue_script('jquery_ui_kjb', plugins_url('include/js/jquery-ui-1.10.4.min.js', __FILE__));
	
		wp_register_script('kjb_quotes_js_src', plugins_url('include/js/kjb_quotes.js', __FILE__));
		wp_enqueue_script('kjb_quotes_js_src');
		
		wp_register_style('kjb_quotes_css_src', plugins_url('include/css/kjb_quotes.css', __FILE__));
		wp_enqueue_style('kjb_quotes_css_src');
	}
}

add_action( 'widgets_init', function(){
     register_widget( 'kjb_Show_Stocks' );
});
?>

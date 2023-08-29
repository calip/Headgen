<?php
/**
 * Plugin Name: pixgen-editor
 * Plugin URI: a url
 * Description: Pixgen Editor React App
 * Version: 0.1
 * Text Domain: pixgen-editor
 * Author: Alip Putra
 * Author URI: https://alipultra.com
 */

function pixgen_editor_init() {
    $path = "/pixgen";
    wp_register_script("pixgen_env_js", plugins_url($path."/env.js", __FILE__), array(), "1.0", false);
    wp_register_script("pixgen_editor_js", plugins_url($path."/static/js/main.js", __FILE__), array(), "1.0", false);
    wp_register_style("pixgen_editor_css", plugins_url($path."/static/css/main.css", __FILE__), array(), "1.0", "all");
    wp_register_style("pixgen_main_css", plugins_url("pixgen-editor.css" , __FILE__ ) );
}

add_action( 'init', 'pixgen_editor_init' );

// Function for the short code that call React app
function pixgen_editor() {
    wp_enqueue_script("pixgen_env_js", '1.0', true);
    wp_enqueue_script("pixgen_editor_js", '1.0', true);
    wp_enqueue_style("pixgen_editor_css");
    wp_enqueue_style("pixgen_main_css");
    return "<div class=\"pixgen-main\" id=\"pixgen_editor\"></div>";
}

add_shortcode('pixgen_editor', 'pixgen_editor');

function add_pixgen_page() {
    global $user_ID;

    $page = get_page_by_path("pixeditor");

    if( $page == NULL )
    {
        //create default page
        $my_page = array(
            'post_title'    => 'Pixgen Editor',
            'post_name'     => 'pixeditor',
            'post_content'  => '',
            'post_status'   => 'publish',
            'post_type'     => 'page',
            'post_author' => $user_ID,
            'post_date'     => date('Y-m-d H:i:s')
        );

        $post_id = wp_insert_post($my_page);
    }
}

register_activation_hook(__FILE__, 'add_pixgen_page');

function pixgen_plugin_page_template( $page_template ){
    if ( is_page( 'pixeditor' ) ) {
        $page_template = dirname( __FILE__ ) . '/pixgen-template.php';
    }
    return $page_template;
}
add_filter( 'page_template', 'pixgen_plugin_page_template' );

//custom field product
add_action( 'woocommerce_product_after_variable_attributes', 'pixgen_product_field', 10, 3 );

function woocommerce_wp_select_multiple( $field ) {
    global $thepostid, $post;
 
    $thepostid              = empty( $thepostid ) ? $post->ID : $thepostid;
    $field['class']         = isset( $field['class'] ) ? $field['class'] : 'select short';
    $field['wrapper_class'] = isset( $field['wrapper_class'] ) ? $field['wrapper_class'] : '';
    $field['name']          = isset( $field['name'] ) ? $field['name'] : $field['id'];
    $field['value']         = isset( $field['value'] ) ? $field['value'] : ( get_post_meta( $thepostid, $field['id'], true ) ? get_post_meta( $thepostid, $field['id'], true ) : array() );
 
    echo '<p class="form-field ' . esc_attr( $field['id'] ) . '_field ' . esc_attr( $field['wrapper_class'] ) . '"><label for="' . esc_attr( $field['id'] ) . '">' . wp_kses_post( $field['label'] ) . '</label><select id="' . esc_attr( $field['id'] ) . '" name="' . esc_attr( $field['name'] ) . '" class="' . esc_attr( $field['class'] ) . '" multiple="multiple">';
 
    foreach ( $field['options'] as $key => $value ) {
        echo '<option value="' . esc_attr( $key ) . '" ' . ( in_array( $key, $field['value'] ) ? 'selected="selected"' : '' ) . '>' . esc_html( $value ) . '</option>';
    }
 
    echo '</select> ';
 
    if ( ! empty( $field['description'] ) ) {
        if ( isset( $field['desc_tip'] ) && false !== $field['desc_tip'] ) {
            echo '<img class="help_tip" data-tip="' . esc_attr( $field['description'] ) . '" src="' . esc_url( WC()->plugin_url() ) . '/assets/images/help.png" height="16" width="16" />';
        } else {
            echo '<span class="description">' . wp_kses_post( $field['description'] ) . '</span>';
        }
    }
    echo '</p>';
}

function pixgen_product_field( $loop, $variation_data, $variation ) {
    $config_path = WP_PLUGIN_DIR.'/pixgen-editor/pixgen/config/config.json';
    $config = wp_json_file_decode($config_path);

    if($config) {
        $templates = $config->templates;
        $fonts = $config->fonts;
        $toolbar = $config->toolbar;

        $template_options = array();
        foreach($templates as $tmp)
        {
            $template_options[$tmp->id] = __($tmp->name . " " . json_encode($tmp->layout),  'woocommerce' );    
        }

        $font_options = array();
        foreach($fonts as $font)
        {
            $font_options[$font] = __(ucfirst($font),  'woocommerce' );    
        }

        woocommerce_wp_select(
            array(
                'id'            => 'pixgen_template_field[' . $loop . ']',
                'label'         => 'Template',
                'wrapper_class' => 'form-row',
                'value'         => get_post_meta( $variation->ID, 'pixgen_template_select', true ),
                'options'       => $template_options
            )
        );

        woocommerce_wp_select(
            array(
                'id'            => 'pixgen_font_field[' . $loop . ']',
                'name'          => 'pixgen_fonts[]',
                'label'         => 'List of Fonts',
                'wrapper_class' => 'form-row',
                'value'         => get_post_meta( $variation->ID, 'pixgen_font_select', true ),
                'options'       => $font_options,
                'custom_attributes' => array('multiple' => 'multiple')
            )
        );

        woocommerce_wp_checkbox(
            array(
                'id'            => 'pixgen_font_enable[' . $loop . ']',
                'label'         => 'Enable Font Selection',
                'wrapper_class' => 'form-row',
                'value'         => get_post_meta( $variation->ID, 'pixgen_font_check', true ),
            )
        );

        woocommerce_wp_checkbox(
            array(
                'id'            => 'pixgen_space_enable[' . $loop . ']',
                'label'         => 'Enable Font Spacing',
                'wrapper_class' => 'form-row',
                'value'         => get_post_meta( $variation->ID, 'pixgen_space_check', true ),
            )
        );
    }

}

add_action( 'woocommerce_save_product_variation', 'pixgen_product_save_fields', 10, 2 );

function pixgen_product_save_fields( $variation_id, $loop ) {
    $select_template_field = ! empty( $_POST[ 'pixgen_template_field' ][ $loop ] ) ? $_POST[ 'pixgen_template_field' ][ $loop ] : '';
    update_post_meta( $variation_id, 'pixgen_template_select', sanitize_text_field( $select_template_field ) );

    $select_font_field = ! empty( $_POST[ 'pixgen_fonts' ] ) ? $_POST[ 'pixgen_fonts' ] : array();
    update_post_meta( $variation_id, 'pixgen_font_select', $select_font_field);

    $checkbox_font_field = ! empty( $_POST[ 'pixgen_font_enable' ][ $loop ] ) ? 'yes' : 'no';
    update_post_meta( $variation_id, 'pixgen_font_check', $checkbox_font_field );

    $checkbox_space_field = ! empty( $_POST[ 'pixgen_space_enable' ][ $loop ] ) ? 'yes' : 'no';
    update_post_meta( $variation_id, 'pixgen_space_check', $checkbox_space_field );
}   

// Add custom pix as custom cart item data
add_filter( 'woocommerce_add_cart_item_data', 'get_custom_product_note', 30, 2 );
function get_custom_product_note( $cart_item_data, $product_id ){
    if ( isset($_GET['pixgen']) && ! empty($_GET['pixgen']) ) {
        $cart_item_data['pixgen_data'] = sanitize_text_field( $_GET['pixgen'] );
        $cart_item_data['pixgen_key'] = md5( microtime().rand() );
    }
    return $cart_item_data;
}

add_filter( 'woocommerce_order_item_get_formatted_meta_data', 'kia_hide_mnm_meta_in_emails' );
function kia_hide_mnm_meta_in_emails( $meta ) {
    if( ! is_admin() ) {
        $criteria = array(  'key' => 'pixgen' );
        $meta = wp_list_filter( $meta, $criteria, 'NOT' );
    }
    return $meta;
}

// Save and display product note in orders and email notifications (everywhere)
add_action( 'woocommerce_checkout_create_order_line_item', 'add_custom_pixgen_order_item_meta', 20, 4 );
function add_custom_pixgen_order_item_meta( $item, $cart_item_key, $values, $order ) {
    if ( isset( $values['pixgen_data'] ) ){
        $item->update_meta_data( 'pixgen',  $values['pixgen_data'] );
    }
}

add_filter('woocommerce_hidden_order_itemmeta', 'hidden_order_item_meta_value', 10, 1 );
function hidden_order_item_meta_value( $arr ) {
    $arr[] = 'pixgen';
    return $arr;
}


add_action( 'woocommerce_after_order_itemmeta', 'display_admin_order_item_custom_button', 10, 3 );
function display_admin_order_item_custom_button( $item_id, $item, $product ){
    // Only "line" items and backend order pages
    if( ! ( is_admin() && $item->is_type('line_item') ) )
        return;

    $data = $item->get_meta('pixgen'); // Get custom item meta data (array)

    if( ! empty($data) ) {
        // Display a custom download button using custom meta for the link
        echo '<a href="' . get_site_url() . '/apps/pixgen/?pixgen='.$data.'" target="_blank" class="button download">' . __("Editor", "woocommerce") . '</a>';
    }
}

add_action( 'wp', 'pixgen_remove_default_cart_button' );
function pixgen_remove_default_cart_button(){
    remove_action( 'woocommerce_single_variation','woocommerce_single_variation_add_to_cart_button', 20 );
    add_action( 'woocommerce_after_single_variation', 'pixgen_custom_add_cart_button' );
}

function pixgen_custom_add_cart_button() {
    global $product;

    echo '<a class="button download pix-editor-button" data-url="' . get_site_url() . '/pixeditor" data-product="' . $product->get_id() . '">' . __("Jetzt gestalten", "woocommerce") . '</a>';
    ?>
    <script type="text/javascript">
    jQuery( function($){
        // $('.single_add_to_cart_button').hide();
        $('.pix-editor-button').click( function(){
            var url = $('.pix-editor-button').attr("data-url");
            var product = $('.pix-editor-button').attr("data-product");
            var variation = $('.pix-editor-button').attr("data-variation");
            var param = {
                "product_id":  parseInt(product),
                "variation_id": parseInt(variation)
            }
            var obj = JSON.stringify(param);
            window.open(url + '?editor=' + window.btoa(obj), '_self')
        });
        // On select variation display variation description
        $('form.variations_form').on('show_variation', function( event, data ){
            $('.pix-editor-button').attr("data-variation", data.variation_id);
        });
        // On unselect variation remove variation description
        $('form.variations_form').on('hide_variation', function(){
            $('.pix-editor-button').attr("data-variation", '');
        });
    });
    </script>
<?php  
}   
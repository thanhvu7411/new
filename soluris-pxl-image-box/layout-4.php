<?php
/**
 * Guard missing Elementor settings (PHP 8+ Undefined array key).
 * Theme updates often drop these keys when animation/style is unused.
 */
$settings = (isset($settings) && is_array($settings)) ? $settings : array();
$settings += array(
	'style'                       => '',
	'pxl_animate'                 => '',
	'pxl_animate_delay'           => '',
	'img_size'                    => '',
	'icon_type'                   => '',
	'title_tag'                   => 'h3',
	'title'                       => '',
	'desc'                        => '',
	'number_year'                 => '',
	'pxl_exp'                     => '',
	'video_link'                  => '',
	'pxl_text_arrow_video_button' => '',
);
if (!isset($settings['link']) || !is_array($settings['link'])) {
	$settings['link'] = array();
}
$settings['link'] += array(
	'url'         => '',
	'is_external' => '',
	'nofollow'    => '',
);
foreach (array('image', 'image_2', 'image_3', 'icon_image') as $__img_key) {
	if (!isset($settings[$__img_key]) || !is_array($settings[$__img_key])) {
		$settings[$__img_key] = array();
	}
	$settings[$__img_key] += array('id' => '');
}
foreach (array('pxl_icon', 'pxl_icon_video') as $__icon_key) {
	if (!isset($settings[$__icon_key]) || !is_array($settings[$__icon_key])) {
		$settings[$__icon_key] = array();
	}
	$settings[$__icon_key] += array('value' => '');
}
unset($__img_key, $__icon_key);
?>
<div class="pxl-image-box pxl-image-box4 <?php echo esc_attr($settings['pxl_animate']); ?>" data-wow-delay="<?php echo esc_attr($settings['pxl_animate_delay']); ?>ms">
    <div class="pxl-item--inner">
        <div class="pxl-item--image">
            <?php
            $image_size = !empty($settings['img_size']) ? $settings['img_size'] : 'full';
            $img  = pxl_get_image_by_size(array(
                'attach_id'  => $settings['image']['id'],
                'thumb_size' => $image_size,
            ));
            $thumbnail    = $img['thumbnail'];
            echo pxl_print_html($thumbnail); ?>
        </div>
        <div class="wrap-content">
            <div class="pxl-item--number"><?php echo pxl_print_html($settings['number_year']); ?></div>
            <div class="pxl-item--exp"> <?php echo pxl_print_html($settings['pxl_exp']); ?></div>
        </div>
    </div>
</div>
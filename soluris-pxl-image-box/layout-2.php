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
 if (!empty($settings['link']['url'])) {
    $widget->add_render_attribute('link', 'href', $settings['link']['url']);

    if ($settings['link']['is_external']) {
        $widget->add_render_attribute('link', 'target', '_blank');
    }
    if ($settings['link']['nofollow']) {
        $widget->add_render_attribute('link', 'rel', 'nofollow');
    }
} ?>
<div class="pxl-image-box pxl-image-box2  <?php echo esc_attr($settings['style']); ?> <?php echo esc_attr($settings['pxl_animate']); ?>" data-wow-delay="<?php echo esc_attr($settings['pxl_animate_delay']); ?>ms">
    <div class="pxl-item--inner">
        <?php if (!empty($settings['image']['id'])) : ?>
            <div class="pxl-item--image">
                <?php
                $image_size = !empty($settings['img_size']) ? $settings['img_size'] : '';
                $img  = pxl_get_image_by_size(array(
                    'attach_id'  => $settings['image']['id'],
                    'thumb_size' => $image_size,
                ));
                $thumbnail    = $img['thumbnail'];
                echo pxl_print_html($thumbnail); ?>
                <?php if ( $settings['icon_type'] == 'icon' && !empty($settings['pxl_icon']['value']) ) : ?>
                    <div class="pxl-item--icon">
                        <?php \Elementor\Icons_Manager::render_icon( $settings['pxl_icon'], [ 'aria-hidden' => 'true']); ?>
                    </div>
                <?php endif; ?>
                <?php if ( $settings['icon_type'] == 'image' && !empty($settings['icon_image']['id']) ) : ?>
                    <div class="pxl-item--icon">
                        <?php $img_icon  = pxl_get_image_by_size( array(
                            'attach_id'  => $settings['icon_image']['id'],
                            'thumb_size' => 'full',
                        ) );
                        $thumbnail_icon    = $img_icon['thumbnail'];
                        echo pxl_print_html($thumbnail_icon); ?>
                    </div>
                <?php endif; ?>
            </div>

        <?php endif; ?>

</div>
</div>
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
<div class="pxl-image-box pxl-image-box6" data-wow-delay="<?php echo esc_attr($settings['pxl_animate_delay']); ?>ms">
    <div class="pxl-item--inner">
        <a class="btn-video-image" href="<?php echo esc_url($settings['video_link']); ?>">
            <?php if (!empty($settings['pxl_icon_video']['value']) ) : ?>
                <div class="pxl-item--icon">
                    <?php \Elementor\Icons_Manager::render_icon( $settings['pxl_icon_video'], [ 'aria-hidden' => 'true']); ?>
                </div>
            <?php endif; ?>
            <div class="ct-banner-title ct-circle-type">
                <svg id="tutorial" data-name="tutorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.48 144.48">
                    <path id="ct-banner-curve" d="M242.93,123A71.74,71.74,0,1,1,171.2,51.22,71.73,71.73,0,0,1,242.93,123Z" transform="translate(-98.96 -50.72)"/>
                    <text fill="url(#ct-circle-text)">
                        <textPath href="#ct-banner-curve">
                            <?php echo pxl_print_html($settings['pxl_text_arrow_video_button']); ?>
                        </textPath>
                    </text>
                </svg>
            </div>
      </a>
      <?php if (!empty($settings['image']['id'])) : ?>
        <div class="pxl-item--image">
            <?php
            $image_size = !empty($settings['img_size']) ? $settings['img_size'] : '';
            $img  = pxl_get_image_by_size(array(
                'attach_id'  => $settings['image']['id'],
                'thumb_size' => $image_size,
                'class'      => 'pxl-image-wrap',
            ));
            $thumbnail    = $img['thumbnail'];
            echo pxl_print_html($thumbnail); ?>
        </div>
    <?php endif; ?>
</div>
</div>
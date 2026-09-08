<?php
/**
 * Plugin Name: Sitelen Layer Reader (PoC)
 * Description: Optional sitelen layer integration for TP content.
 */

function sitelen_layer_plugin_assets(): void {
  $css = 'https://cdn.jsdelivr.net/npm/sitelen-layer-plugin/dist/sitelen-layer-plugin.css';
  $js = 'https://cdn.jsdelivr.net/npm/sitelen-layer-plugin/dist/sitelen-layer-plugin.iife.js';

  wp_register_style('sitelen-layer-css', $css, [], '0.2.0');
  wp_register_script('sitelen-layer-js', $js, [], '0.2.0', true);

  wp_enqueue_style('sitelen-layer-css');
  wp_enqueue_script('sitelen-layer-js');

  $init_script = <<<'JS'
    window.addEventListener('DOMContentLoaded', function () {
      if (!window.createSitelenLayerPlugin) {
        return;
      }

      window.__sitelenLayerPlugin__ = window.createSitelenLayerPlugin({
        container: 'body',
        defaultLayer: 'latin',
        showToggle: true,
        sitelenPona: { renderStrategy: 'ligature-font' },
        routeExclude: ['/admin', '/wp-login.php'],
        routeMatchMode: 'contains'
      });

      window.__sitelenLayerPlugin__.init();
    });
  JS;

  wp_add_inline_script('sitelen-layer-js', $init_script, 'after');
}
add_action('wp_enqueue_scripts', 'sitelen_layer_plugin_assets');

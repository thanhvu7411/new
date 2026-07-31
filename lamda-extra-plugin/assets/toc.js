(function () {
  'use strict';

  var FLOATING_GUTTER = 20;
  var COMPACT_ICON_SIZE = 48;

  function slugify(text, index) {
    var slug = (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return slug || 'muc-luc-' + index;
  }

  function ensureHeadingId(heading, index, used) {
    if (heading.id) {
      used[heading.id] = true;
      return heading.id;
    }

    var base = slugify(heading.textContent, index);
    var slug = base;
    var suffix = index;

    while (used[slug]) {
      suffix += 1;
      slug = base + '-' + suffix;
    }

    heading.id = slug;
    used[slug] = true;

    return slug;
  }

  function getTocLayoutSettings(settings) {
    return {
      offsetTop: parseInt(settings.offsetTop, 10) || 100,
      width: parseInt(settings.width, 10) || 260
    };
  }

  function findPostContentTrack() {
    return document.querySelector('#post_content');
  }

  function findPostContentWidget(root) {
    var scope = root || document;

    if (scope.matches && scope.matches('.elementor-widget-theme-post-content')) {
      return scope;
    }

    return scope.querySelector('.elementor-widget-theme-post-content');
  }

  function findContentRoot(marker) {
    var track = findPostContentTrack();
    if (track) {
      return track;
    }

    var selectors = [
      '[data-elementor-type="single-post"]',
      '[data-elementor-type="single-page"]',
      '.article-inner .entry-content',
      '.entry-content',
      '.pxl-item--excerpt',
      '.pxl-entry-content',
      'article.pxl-item--post',
      'article.post',
      '#pxl-content-main',
      'main .elementor-location-single',
      'main',
      'article'
    ];

    if (marker) {
      var near = marker.closest('#post_content, [data-elementor-type="single-post"], [data-elementor-type="single-page"], article.pxl-item--post, article.post, .pxl-item--excerpt, .pxl-entry-content, .entry-content, #pxl-content-main, main, article');
      if (near) {
        return near;
      }
    }

    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el) {
        return el;
      }
    }

    return null;
  }

  function findHeadingsRoot(track) {
    var widget = findPostContentWidget(track) || findPostContentWidget(document);
    if (widget) {
      return widget;
    }

    var fallbacks = [
      track && track.querySelector('.pxl-item--excerpt'),
      track && track.querySelector('.pxl-entry-content'),
      track && track.querySelector('.entry-content'),
      track
    ];

    for (var i = 0; i < fallbacks.length; i++) {
      if (fallbacks[i]) {
        return fallbacks[i];
      }
    }

    return null;
  }

  function findInlineMountPoint(content) {
    var widget = findPostContentWidget(content);
    if (widget) {
      var container = widget.querySelector('.elementor-widget-container') ||
        widget.querySelector('.elementor-theme-post-content') ||
        widget;
      return {
        parent: container,
        before: container.firstChild,
        headingsRoot: widget
      };
    }

    var fallbacks = [
      content.querySelector('.pxl-item--excerpt'),
      content.querySelector('.pxl-entry-content'),
      content.querySelector('.entry-content')
    ];

    for (var i = 0; i < fallbacks.length; i++) {
      if (fallbacks[i]) {
        return {
          parent: fallbacks[i],
          before: fallbacks[i].firstChild,
          headingsRoot: fallbacks[i]
        };
      }
    }

    return null;
  }

  function getSideRooms(track) {
    var viewportWidth = document.documentElement.clientWidth;
    var rect = track.getBoundingClientRect();
    return {
      viewportWidth: viewportWidth,
      rect: rect,
      roomRight: viewportWidth - rect.right,
      roomLeft: rect.left
    };
  }

  function getSidePlacement(rooms) {
    var minSide = 160;

    // Ưu tiên phải cạnh #post_content; chỉ sang trái khi phải quá hẹp và trái rộng hơn rõ.
    if (rooms.roomRight >= minSide) {
      return 'right';
    }

    if (rooms.roomLeft >= minSide && rooms.roomLeft > rooms.roomRight + 40) {
      return 'left';
    }

    return rooms.roomRight >= rooms.roomLeft ? 'right' : 'left';
  }

  function needsCompactMode(rooms) {
    var minSide = 160;
    if (rooms.roomRight >= minSide || rooms.roomLeft >= minSide) {
      return false;
    }

    return rooms.viewportWidth < 960 || rooms.rect.width > rooms.viewportWidth * 0.9;
  }

  function syncFloatingToc(nav, track, layout, title) {
    var tocWidth = layout.width;
    var offsetTop = layout.offsetTop;
    var rooms = getSideRooms(track);
    var compact = needsCompactMode(rooms);
    var expanded = nav.classList.contains('lamda-extra-toc--expanded');
    var side = getSidePlacement(rooms);
    var sideRoom = side === 'right' ? rooms.roomRight : rooms.roomLeft;
    var usableWidth = Math.max(0, sideRoom - FLOATING_GUTTER - 16);

    nav.classList.toggle('lamda-extra-toc--collapsed', compact);
    nav.classList.toggle('lamda-extra-toc--side-left', side === 'left');
    nav.classList.toggle('lamda-extra-toc--side-right', side === 'right');

    if (!compact) {
      nav.classList.remove('lamda-extra-toc--expanded');
      if (title) {
        title.setAttribute('aria-expanded', 'false');
      }
    }

    nav.classList.add('lamda-extra-toc--floating');
    nav.classList.remove('lamda-extra-toc--inline');

    if (nav.parentNode !== document.body) {
      document.body.appendChild(nav);
    }

    var trackRect = rooms.rect;
    var viewportWidth = rooms.viewportWidth;
    var width;

    if (compact && !expanded) {
      width = COMPACT_ICON_SIZE;
    } else if (!compact && usableWidth > 0) {
      width = Math.min(tocWidth, Math.max(180, usableWidth), viewportWidth - 32);
    } else {
      width = Math.min(tocWidth, viewportWidth - 32);
    }

    var left;

    if (side === 'left') {
      left = trackRect.left - FLOATING_GUTTER - width;
      if (left < 12) {
        left = 12;
      }
    } else {
      left = trackRect.right + FLOATING_GUTTER;
      var maxLeft = viewportWidth - width - 12;
      if (left > maxLeft) {
        left = Math.max(12, maxLeft);
      }
    }

    var navHeight = nav.offsetHeight || 0;
    var top = offsetTop;

    // Stick while scrolling through #post_content; release outside its vertical range.
    if (trackRect.top > top) {
      top = trackRect.top;
    } else if (trackRect.bottom - navHeight < top) {
      top = Math.max(trackRect.bottom - navHeight, 8);
    }

    nav.style.position = 'fixed';
    nav.style.top = top + 'px';
    nav.style.left = left + 'px';
    nav.style.right = 'auto';
    nav.style.width = width + 'px';
    nav.style.maxHeight = 'calc(100vh - ' + (offsetTop * 2) + 'px)';
    nav.style.visibility = trackRect.bottom < 40 || trackRect.top > window.innerHeight - 40 ? 'hidden' : 'visible';
  }

  function mountFloatingToc(nav, track, layout, title) {
    var sync = function () {
      syncFloatingToc(nav, track, layout, title);
    };

    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-expanded', 'false');

    title.addEventListener('click', function () {
      if (!nav.classList.contains('lamda-extra-toc--collapsed')) {
        return;
      }

      nav.classList.toggle('lamda-extra-toc--expanded');
      title.setAttribute('aria-expanded', nav.classList.contains('lamda-extra-toc--expanded') ? 'true' : 'false');
      sync();
    });

    title.addEventListener('keydown', function (event) {
      if (!nav.classList.contains('lamda-extra-toc--collapsed')) {
        return;
      }

      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      nav.classList.toggle('lamda-extra-toc--expanded');
      title.setAttribute('aria-expanded', nav.classList.contains('lamda-extra-toc--expanded') ? 'true' : 'false');
      sync();
    });

    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('lamda-extra-toc--collapsed') || !nav.classList.contains('lamda-extra-toc--expanded')) {
        return;
      }

      if (nav.contains(event.target)) {
        return;
      }

      nav.classList.remove('lamda-extra-toc--expanded');
      title.setAttribute('aria-expanded', 'false');
      sync();
    });

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return function () {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }

  function isIgnoredHeading(heading) {
    return !!(
      heading.closest('header, footer, nav, .site-header, .site-footer, .comment-respond, .comments-area, #comments, .pxl-related, .related-posts, .elementor-widget-theme-post-title, .elementor-location-header, .elementor-location-footer, .elementor-location-popup')
    );
  }

  function collectHeadings(content, selector) {
    var pageTitle = (document.title || '').split('|')[0].split('-')[0].trim().toLowerCase();
    var skipRest = false;

    return Array.prototype.slice.call(content.querySelectorAll(selector)).filter(function (heading) {
      if (skipRest || isIgnoredHeading(heading)) {
        return false;
      }

      var text = (heading.textContent || '').trim();
      if (!text) {
        return false;
      }

      if (/^Home\s?0?\d$/i.test(text) || /^Coming Soon$/i.test(text) || /^Comming Soon$/i.test(text)) {
        return false;
      }
      if (/^xem thêm\s*:?$/i.test(text) || /^leave a comment/i.test(text) || /^đăng ký nhận tin$/i.test(text) || /^lĩnh vực$/i.test(text)) {
        skipRest = true;
        return false;
      }

      if (pageTitle && text.toLowerCase() === pageTitle) {
        return false;
      }

      return true;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var settings = window.lamdaExtraTocSettings || {};
    var layout = getTocLayoutSettings(settings);
    var marker = document.querySelector('.lamda-extra-toc-marker');
    var mountMode = 'floating';
    var inlineMount = null;
    var track = findPostContentTrack() || findContentRoot(marker);
    var headingsRoot = null;

    if (marker) {
      // Shortcode: giữ inline tại vị trí marker, trừ khi có #post_content thì vẫn cột cạnh.
      if (track && track.id === 'post_content') {
        mountMode = 'floating';
        headingsRoot = findHeadingsRoot(track);
      } else {
        mountMode = 'inline';
        track = findContentRoot(marker);
        headingsRoot = findHeadingsRoot(track) || track;
      }
    } else if (!settings.autoActivate) {
      return;
    } else {
      if (!track) {
        return;
      }
      mountMode = 'floating';
      headingsRoot = findHeadingsRoot(track);
    }

    if (!track || !headingsRoot) {
      return;
    }

    var levels = Array.isArray(settings.levels) && settings.levels.length ? settings.levels : ['h2'];
    var selector = levels.join(',');
    var headings = collectHeadings(headingsRoot, selector);

    if (!headings.length) {
      return;
    }

    var minHeadings = parseInt(settings.minHeadings, 10) || 1;

    if (headings.length < minHeadings) {
      return;
    }

    if (document.querySelector('.lamda-extra-toc')) {
      return;
    }

    var usedIds = {};
    var nav = document.createElement('nav');
    nav.className = mountMode === 'inline' ? 'lamda-extra-toc lamda-extra-toc--inline' : 'lamda-extra-toc';

    nav.setAttribute('aria-label', settings.title || 'Mục Lục');
    nav.style.setProperty('--lamda-toc-title-bg', settings.titleBg || '#0e0428');
    nav.style.setProperty('--lamda-toc-bg', settings.boxBg || '#e6effb');
    nav.style.setProperty('--lamda-toc-border', settings.boxBorder || '#b8ceeb');
    nav.style.setProperty('--lamda-toc-link', settings.linkColor || '#333333');
    nav.style.setProperty('--lamda-toc-active', settings.activeColor || '#002359');
    nav.style.setProperty('--lamda-toc-active-link', settings.activeLinkColor || '#ffffff');
    nav.style.setProperty('--lamda-toc-radius', (settings.radius || 13) + 'px');
    nav.style.setProperty('--lamda-toc-offset-top', layout.offsetTop + 'px');
    nav.style.setProperty('--lamda-toc-width', layout.width + 'px');

    var collapsedOpacityPct = parseInt(settings.collapsedOpacity, 10);
    if (isNaN(collapsedOpacityPct)) {
      collapsedOpacityPct = 45;
    }
    collapsedOpacityPct = Math.min(100, Math.max(10, collapsedOpacityPct));
    nav.style.setProperty('--lamda-toc-collapsed-opacity', (collapsedOpacityPct / 100).toFixed(2));

    var titleTag = settings.titleTag || 'h3';
    var title = document.createElement(titleTag);
    title.className = 'lamda-extra-toc__title';

    var icon = document.createElement('span');
    icon.className = 'lamda-extra-toc__icon';

    if (settings.titleIconSvg) {
      icon.innerHTML = settings.titleIconSvg;
    }

    var titleText = document.createElement('span');
    titleText.className = 'lamda-extra-toc__title-text';
    titleText.appendChild(document.createTextNode(settings.title || 'Mục Lục'));

    title.appendChild(icon);
    title.appendChild(titleText);
    nav.appendChild(title);

    var listWrap = document.createElement('div');
    listWrap.className = 'lamda-extra-toc__list';

    var list = document.createElement('ul');
    var links = [];

    headings.forEach(function (heading, index) {
      var id = ensureHeadingId(heading, index + 1, usedIds);
      var item = document.createElement('li');
      var tagName = heading.tagName.toLowerCase();

      item.className = 'lamda-extra-toc__item lamda-extra-toc__item-' + tagName;

      var link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = (heading.textContent || '').trim();
      link.addEventListener('click', function (event) {
        var target = document.getElementById(id);

        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);

        if (nav.classList.contains('lamda-extra-toc--collapsed')) {
          nav.classList.remove('lamda-extra-toc--expanded');
          title.setAttribute('aria-expanded', 'false');
        }
      });

      item.appendChild(link);
      list.appendChild(item);
      links.push({ link: link, heading: heading });
    });

    listWrap.appendChild(list);
    nav.appendChild(listWrap);

    if (mountMode === 'inline') {
      if (marker) {
        marker.replaceWith(nav);
      } else {
        inlineMount = findInlineMountPoint(track);
        if (inlineMount && inlineMount.parent) {
          inlineMount.parent.insertBefore(nav, inlineMount.before || null);
        } else {
          mountFloatingToc(nav, track, layout, title);
        }
      }
    } else {
      mountFloatingToc(nav, track, layout, title);
    }

    if (!('IntersectionObserver' in window)) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          links.forEach(function (item) {
            item.link.classList.toggle('is-active', item.heading === entry.target);
          });
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  });
})();

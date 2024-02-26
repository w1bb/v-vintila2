$(function() {
	hljs.highlightAll();

    $(document).on('keydown', function(event) {
        if ((event.ctrlKey && event.keyCode === 75) || event.keyCode === 191 || event.keyCode == 27) {
			event.preventDefault();
		}

		if (event.ctrlKey && event.keyCode === 75) { // Ctrl+K
			$("#doc-search-overlay").toggleClass("visible");
		} else if (event.keyCode === 191) { // Slash (/)
			if (!($("#doc-search-overlay").hasClass("visible")))
				$("#doc-search-overlay").addClass("visible");
		} else if (event.keyCode == 27) { // Esc
			if (($("#doc-search-overlay").hasClass("visible")))
				$("#doc-search-overlay").removeClass("visible");
		}
		if (($("#doc-search-overlay").hasClass("visible")))
			$("#search-input").focus();
    });

	$("#search-box-toggle").on('click', function(event) {
		$("#doc-search-overlay").addClass("visible");
		$("#search-input").focus();
	});

	$("#doc-search-overlay").on('click', function(event) {
		if (event.target !== this)
			return
		$("#doc-search-overlay").removeClass("visible");
	});

	$("#canel-doc-search").on('click', function(event) {
		$("#doc-search-overlay").removeClass("visible");
	});

	$("#expand-aside").on('click', function(event) {
		$("aside").removeClass("collapsed");
		$("main").removeClass("aside-collapsed");
	});

	$("#collapse-aside").on('click', function(event) {
		$("aside").addClass("collapsed");
		$("main").addClass("aside-collapsed");
	});

	$(".toggle-color-mode").on('click', function(event) {
		set_color_mode($("body").hasClass("dark-mode") ? "light-mode" : "dark-mode");
	});

	$(".copy-code").on('click', function(event) {
		text = $(this).parent().find("pre").find("code").text();
		navigator.clipboard.writeText(text);
	});

	$(".title-collapse-btn").on('click', function(event) {
		event.preventDefault();
		let current_li = $(this).parent().parent().parent();
		current_li.toggleClass("tree-category-collapsed");
		let element = $(current_li.find("ul.secondary-tree")[0]);
		let auto_height = element.css('height', 'auto').height();
		if (current_li.hasClass("tree-category-collapsed")) {
			element.height(auto_height).animate(
				{ height: 0,
				  opacity: 0 },
				200, "swing",
				function() {
					element.css({"display": "none", "visibility": 'hidden', "overflow": "hidden"});
				}
			);
		} else {
			element.css({"display": "block", "visibility": "visible", "overflow": "visible"})
			element.height(0).animate(
				{ height: auto_height,
				  opacity: 1 },
				200, "swing",
				function() {
					element.removeAttr('style');
				}
			);
		}
	});

	let all_pretoggled_lis = $("li.tree-category-collapsed");
	for (let i = 0; i < all_pretoggled_lis.length; ++i) {
		let element = $($(all_pretoggled_lis[i]).find("ul.secondary-tree")[0]);
		let auto_height = element.css('height', 'auto').height();
		element.height(auto_height).animate(
			{ height: 0,
			  opacity: 0 },
			1, "swing",
			function() {
				element.css({"display": "none", "visibility": 'hidden', "overflow": "hidden"});
			}
		);
	}

	let current_image_overlayed = null
	let current_image_overlayed_clone = null
	let image_overlay_duration = 300

	$("#main-article").find("img").on('click', function(event) {
		current_image_overlayed = $(this)
		current_image_overlayed_clone = $(this).clone();
		current_image_overlayed_clone.appendTo("#image-zoom-overlay");
		current_image_overlayed_clone.css({
			'top': $(this).position().top - $("html").scrollTop() - 55,
			'left': $(this).position().left,
			'width': $(this).width(),
			'height': $(this).height(),
			'padding': 0,
			// 'opacity': 0
		});
		$("#image-zoom-overlay").addClass("visible");

		let padding_top = 24;
		let padding_left = 24;

		let ratio_img = $(this).width() / $(this).height();
		let ratio_screen = ($("#image-zoom-overlay").width() - 2 * padding_left) / ($("#image-zoom-overlay").height() - 2 * padding_top);
		
		if (ratio_img < ratio_screen) {
			let new_height = $("#image-zoom-overlay").height() - 2 * padding_top;
			let new_width = ratio_img * new_height;
			
			current_image_overlayed_clone.animate({
				'top': padding_top,
				'left': ($("#image-zoom-overlay").width() - new_width) / 2,
				'width': new_width,
				'height': new_height,
				// 'opacity': 1
			}, image_overlay_duration, "easeInOutSine");
		} else {
			let new_width = $("#image-zoom-overlay").width() - 2 * padding_left;
			let new_height = new_width / ratio_img;
			
			current_image_overlayed_clone.animate({
				'top': ($("#image-zoom-overlay").height() - new_height) / 2,
				'left': padding_left,
				'width': new_width,
				'height': new_height,
				// 'opacity': 1
			}, image_overlay_duration, "easeInOutSine");
		}
	});

	let close_image_zoom_overlay = function(event) {
		$("#image-zoom-overlay").removeClass("visible");

		if (!current_image_overlayed_clone) {
			setTimeout(
				function() {
					$("#image-zoom-overlay").empty();
				}, image_overlay_duration
			);
			$("#image-zoom-overlay").empty();
		} else {
			current_image_overlayed_clone.animate({
				'top': current_image_overlayed.position().top - $("html").scrollTop() - 55,
				'left': current_image_overlayed.position().left,
				'width': current_image_overlayed.width(),
				'height': current_image_overlayed.height(),
			}, image_overlay_duration, "easeInOutSine", function() {
				$("#image-zoom-overlay").empty();
			});
		}
	}

	$("#image-zoom-overlay").on('click', close_image_zoom_overlay);

	$("#hamburger-open-nav-top-sidebar").on('click', function() {
		$("aside").addClass("visible");
	});

	$("#aside-overlay").on('click', function() {
		$("aside").removeClass("visible");
	});

	let resize_aside_was_collapsed = false;
	let resize_old_width = 0;

	$(window).resize(function() {
		if ($(window).width() > 1000 && resize_old_width <= 1000) {
			$("aside").removeClass("visible");
			if (resize_aside_was_collapsed) {
				$("aside").addClass("collapsed");
			}
		} else if ($(window).width() <= 1000 && resize_old_width > 1000) {
			if ($("aside").hasClass("collapsed")) {
				$("aside").removeClass("collapsed");
				resize_aside_was_collapsed = true;
			} else {
				resize_aside_was_collapsed = false;
			}
		}
		resize_old_width = $(window).width();
		close_image_zoom_overlay();
	});

	let last_scroll_top = $(this).scrollTop();

	// if (last_scroll_top > 200) {
	// 	$("#scroll-to-top").addClass("visible");
	// }

    document.addEventListener('scroll', function(event) {
		let current_scroll_top = $(this).scrollTop();
		if (current_scroll_top > last_scroll_top) {
			// Scroll down
			$("#scroll-to-top").removeClass("visible");
		} else {
			// Scroll up
			if (current_scroll_top > 200) {
				$("#scroll-to-top").addClass("visible");
			} else {
				$("#scroll-to-top").removeClass("visible");
			}
		}
		last_scroll_top = current_scroll_top;
	}, true);

	$("#scroll-to-top").on('click', function(event) {
		$('html, body').animate({
			scrollTop: 0
		}, $(window).scrollTop() / 4, function() {
			var hash = location.hash.replace('#','');
			if (hash != '')
				location.hash = '';
		});
	});

	$(".tabs .tabs-select").find(".tab-opt").on('click', function() {
		// alert("Hello there!");
		let other_tab_opts = $(this).parent().find(".tab-opt");
		let i;
		for (i = 0; i < other_tab_opts.length; ++i) {
			if (other_tab_opts[i] == this) {
				break;
			}
		}
		other_tab_opts.removeClass("selected");
		$(this).addClass("selected");
		let other_tab_contents = $(this).parent().parent().find(".tab-content");
		other_tab_contents.removeClass("selected");
		$(other_tab_contents[i]).addClass("selected");
	});

	toc_all = $("#toc").find("li");
	function redraw_anchors() {
		let last_ok = 0;
		while (last_ok < toc_all.length) {
			let the_href = $($(toc_all[last_ok]).children('a')[0]).prop('hash');
			// console.log(the_href);
			if ($(the_href).position().top - 100 > $("html").scrollTop())
				break;
			++last_ok;
		} --last_ok;
		toc_all.children("a").removeClass("selected");
		if (last_ok == -1) {
			if (toc_all.length == 0)
				return;
			last_ok = 0;
		}
		$($(toc_all[last_ok]).children('a')[0]).addClass("selected");
	}

    $("a").on('click', function(event) {
        if ($(event.target).hasClass("reference-href") == false &&
            this.hash !== "") {
			
            event.preventDefault();
            var hash = this.hash;
    
            $('html, body').animate({
                scrollTop: Math.max(0, $(hash).offset().top - 70)
            }, Math.abs($(window).scrollTop() - $(hash).offset().top) / 4, function(){
                // window.location.hash = hash;
				history.pushState(null, null, hash)
            });
        }
    });

    redraw_anchors();
    document.addEventListener('scroll', redraw_anchors, true);

	// Search functionality

	let searchable_element = {
		
	};
});
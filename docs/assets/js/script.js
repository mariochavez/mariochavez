/*-----------------------------------------------------------------------------------

 	Script - All Custom frontend jQuery scripts & functions
 
-----------------------------------------------------------------------------------*/
(function(){
'use strict';
	
/* issue when using the back button */
jQuery(window).bind("pageshow", function(event) {
    if (event.originalEvent.persisted) {
       // window.location.reload()
		jQuery("#page-content").removeClass();
    }
});

/* do animations if element is visible
------------------------------------------------*/
function animateOnScroll() {
	
	/* animations  */
	if (jQuery("[class*='do-anim']").length > 0) {
		jQuery("[class*='do-anim']").not('.animated')
		.filter(function(i, d) {
			return  jQuery(d).visible(true, false, false, 100);  // 100 is offset
		}).each(function(i) {
			var thisItem = jQuery(this);
			 var delayMulti = 200;
			if (thisItem.hasClass("do-anim-modern")) { delayMulti = 100; }
			var delay = i*delayMulti + 100;  // + 150 is to add a small delay
			thisItem.delay(delay).queue(function(){thisItem.addClass('animated');});
		});
	}
	
	/* infinite Load for isotope */
	if( jQuery().isotope ) { 
		jQuery(".load-isotope:not(.loading):not(.disabled) > a[data-method='infiniteload']")
		.filter(function(i, d) {
			return  jQuery(d).visible();
		}).each(function() {
			jQuery(this).trigger( "click" );
		});
	}
						
}


/* header Features ()
------------------------------------------------*/
var headerHeight = jQuery("#header").outerHeight();
var padding = parseInt(jQuery("#header .header-inner").css('paddingTop'),10);
var newPadding = 40;
var newHeaderHeight = headerHeight - (padding*2) + (newPadding*2);
function headerFeatures() {
	var currY = jQuery(window).scrollTop();
	var selector = "#hero";
	
	/* sticky transform */
	if (jQuery("#header").hasClass("sticky")) {
		if (padding > newPadding) {
			if (currY < (headerHeight - newHeaderHeight)) {
				jQuery("#header .header-inner").css('paddingTop',(padding - (currY /2))+'px');
				jQuery("#header .header-inner").css('paddingBottom',(padding - (currY /2))+'px');
				if (!jQuery(selector).hasClass("hero-fullscreen")) { jQuery("#header").removeClass("sticky-transformed direct"); }
			} else if (!jQuery("#header").hasClass("sticky-transformed")) {
				jQuery("#header .header-inner").css('paddingTop',newPadding+'px');
				jQuery("#header .header-inner").css('paddingBottom',newPadding+'px');
				if (!jQuery(selector).hasClass("hero-fullscreen")) { jQuery("#header").addClass("sticky-transformed direct"); }
			}
		}
	}
	
	/* Switch light / dark appearance */
	if (currY + headerHeight > jQuery(selector).height()) { 
		if (jQuery(selector).hasClass("hero-fullscreen")) { 
			jQuery('#header').addClass("sticky-transformed");
			jQuery('#single-share.fixed, #header-actions, #header.sticky > .header-inner .menu-actions, #header.sticky > .header-inner #menu.classic #menu-inner, #header.sticky > .header-inner #logo').removeClass("text-light");
			jQuery('#single-share.fixed, #header-actions, #header.sticky > .header-inner .menu-actions, #header.sticky > .header-inner #menu.classic #menu-inner, #header.sticky > .header-inner #logo').removeClass("text-dark");
		}
	} else { 
		if (jQuery(selector).hasClass("hero-fullscreen")) {
			jQuery('#header').removeClass("sticky-transformed");
			jQuery('.hero-light #single-share.fixed, .hero-light #header-actions, .hero-light #header.sticky > .header-inner .menu-actions, .hero-light #header.sticky > .header-inner #menu.classic #menu-inner, .hero-light #header.sticky > .header-inner #logo').addClass("text-light");
			jQuery('.hero-dark #single-share.fixed, .hero-dark #header-actions, .hero-dark #header.sticky > .header-inner .menu-actions, .hero-dark #header.sticky > .header-inner #menu.classic #menu-inner, .hero-dark #header.sticky > .header-inner #logo').addClass("text-dark");
		}
	}
    
    /* Pause video on scroll */
    var triggerPoint = jQuery("#hero").height() - 80;
    if (!jQuery("#hero").hasClass("hero-fullscreen")) { triggerPoint = jQuery("#hero").height() + headerHeight - 80; }
	if (jQuery("#hero").hasClass("videobg-section") && jQuery(selector).find(".playpause-video:not(.play)").length && currY > triggerPoint) { 
		// trigger playpause
        jQuery(selector).find(".playpause-video:not(.play)").trigger("click");
	}
	
	/* Add a 2nd hero-invisible for the fixed pagination */
	if (currY > 100 && jQuery("#single-pagination.fixed").length && jQuery(selector).hasClass("hero-fullscreen")) {
		jQuery('#single-pagination.fixed').removeClass("text-light");
		jQuery('#single-pagination.fixed').removeClass("text-dark");
		jQuery('body').addClass("hero-invisible-pagination");
	} else { 
		jQuery('body').removeClass("hero-invisible-pagination");
		jQuery('.hero-light #single-pagination.fixed').addClass("text-light");
		jQuery('.hero-dark #single-pagination.fixed').addClass("text-dark");
	}
	
	/* Show Hide back to top arrow */
	if (currY + headerHeight > jQuery(window).height()) { jQuery('header .header-totop').addClass("visible");	
	} else { jQuery('header .header-totop').removeClass("visible"); }
		
	
}


/* misc features which need to be regenerated on resize
------------------------------------------------*/
function resizeAdapt() {
	
	/* - Hero / Pagetitle (if pagetitle is taller than hero) - */
	if (jQuery(".hero-full #page-title").length > 0 || jQuery(".hero-fullscreen #page-title").length > 0) {
		var hero = jQuery("#hero");
		var pageTitle = jQuery("#hero #page-title");
		var pageTitleHeight = pageTitle.outerHeight();
		if (pageTitleHeight > hero.outerHeight()) {
			hero.css('height',(pageTitleHeight-2)+'px'); // -2 is for prevend jumping
		} else  {
			hero.css('height','auto');
		}
	}
	
	/* - Columns Align - */
	jQuery('.column-section.col-align-center, .column-section.col-align-bottom').each(function() { 
		var thisEl = jQuery(this);
		jQuery(thisEl).children(".column").css('minHeight','inherit');
		jQuery(thisEl).children(".column").find(".col-content").css('marginTop', '0');
						
		if (jQuery(window).width() > 768) {
			var maxHeight = 0;
			var tallestEl = '';
			jQuery(thisEl).children(".column").each(function() {
				var theHeight = jQuery(this).outerHeight();
				var theBorder = parseInt(jQuery(this).css('border-top-width'), 10) + parseInt(jQuery(this).css('border-bottom-width'), 10);
				if (theHeight + theBorder > maxHeight) { maxHeight = theHeight + theBorder+1; tallestEl = jQuery(this); }
				// +1 is hack for bordered sticky
			});
			if (maxHeight) {
				jQuery(thisEl).children(".column").css('minHeight',maxHeight+'px');
				jQuery(tallestEl).addClass("tallest");	
			}
			
			// apply vertical-center
			jQuery(thisEl).children(".column:not(.tallest)").each(function() {
				if (jQuery(this).find(".col-content").length > 0 && !jQuery(this).find(".col-content").is(':empty')) {
					var theContent = jQuery(this).find(".col-content");
					var elHeight = maxHeight - (parseInt(jQuery(this).css('paddingTop'), 10) + parseInt(jQuery(this).css('paddingBottom'), 10));
					var contentHeight = jQuery(theContent).height();
					if (contentHeight < elHeight) { 
						var alignMargin = (elHeight - contentHeight) / 2;
						if (thisEl.hasClass("col-align-bottom")) { alignMargin = elHeight - contentHeight; }
						jQuery(theContent).css('marginTop', alignMargin + 'px');
					}
				} 
			});
		} // end if window > 768
	});
	
	
	/* - Force fullwidth ection replace - */
	if (jQuery(".fullwidth-section.forcefullwidth").length > 0) {
		var pageBody = jQuery("#page-body").offset().left;
		jQuery(".fullwidth-section.forcefullwidth").css({ 'left': '-'+pageBody+'px' });
		console.log(pageBody);
	}
	
}

/* isotope load more function
------------------------------------------------*/
function isotopeLoadMore(grid,el,url,datas) {
	
	el.parent(".load-isotope").addClass('loading');
	
	if (url === '#' || !url) { url = srvars.ajaxurl }
	var addData = ''; if (datas) { addData = { action:'sr_load_more', o:datas }; }
	//console.log(addData);
	jQuery.ajax({
			type:'POST',			// this might lead to issues for html template
			url:url,
			data: addData,
			dataType:"html",
			error: function () {
				el.parent(".load-isotope").addClass("disabled");	
			},
			success: function(response) { 
				//console.log(response);
				if (response) {
					setTimeout(function(){ 
						var items = jQuery( jQuery(response).find('#'+grid.attr('id')).html());
						items.imagesLoaded(function(){
							grid.append( items ).isotope( 'appended', items);
							reorganizeIsotope(true);
							animateOnScroll(false);
							
							el.parent(".load-isotope").removeClass('loading');
							
							// init video bg for appended items
							if(jQuery().phatVideoBg) { grid.find('.videobg-section').phatVideoBg(); }
							
							// reinitialise lightcase for new items loaded (v. 1.1)
							setTimeout(function(){ 
								if(jQuery().lightcase) {
									jQuery('a[data-rel^=lightcase]').lightcase({ 
										showSequenceInfo: false, 
										swipe: true, 
										showCaption: true,
										overlayOpacity:1,
										maxWidth: 1300,
										maxHeight: 1100,
										shrinkFactor: 1,
										liveResize: true,
										fullScreenModeForMobile: true,
										video: {
											width : 1280,
											height : 720
											},
										iframe:{
											width : 1280,
											height : 720,
											allowfullscreen: 1
											}
									});	
								}
							}, 500);
							// reinitialise lightcase for new items loaded (v. 1.1)
						});
					},500);
				} else {
					el.parent(".load-isotope").addClass("disabled");	
				}
			}
	});
	
}
	
	
/* reorganize isotope for ratio
------------------------------------------------*/
function reorganizeIsotope() { 
	jQuery('.isotope-grid[data-ratio]').each(function(){
		var $container = jQuery(this);
		var width = $container.find(".isotope-item:not(.double-width)").width();
		var ratio = $container.data('ratio').split(':');
		ratio = ratio[1] / ratio[0];
		if (!ratio) { ratio = 0.8; }
		var spacing = 0; 
		if ($container.hasClass("isotope-spaced") || $container.hasClass("isotope-spaced-big")) { 
			spacing = parseInt($container.find(".isotope-item").css('marginRight'),10); 
		}
		var height = parseInt(width * ratio, 10);
		if ($container.find('.isotope-item img:not(.hover):not(.rationed)').length) {
			$container.find('.isotope-item img:not(.hover)').wrap('<div class="ratio-wrapper"></div>');
			$container.find('.isotope-item img:not(.hover):not(.rationed)').addClass('rationed');
		}
		$container.find('.isotope-item .ratio-wrapper').css({ 'height': height+'px' });
		if (jQuery(window).width() > 1024) { $container.find('.isotope-item.double-height .ratio-wrapper').css({ 'height': height*2+spacing+'px' }); }
		$container.isotope( 'layout' );
		
	});
}


jQuery(window).on("load",function() {	
		
	// add body classes if hero-fullscreen
	if (jQuery("#hero").hasClass("hero-fullscreen")) { 
		jQuery('body').addClass("hero-fullscreen");
		if (jQuery("#hero").hasClass("text-light")) {
			jQuery('body').addClass("hero-light");
			jQuery('#header > .header-inner .menu-actions').addClass("text-light"); 
			jQuery('#header > .header-inner #menu.classic #menu-inner').addClass("text-light"); 
			jQuery('#header > .header-inner #logo').addClass("text-light"); 
			jQuery('#single-share.fixed').addClass("text-light"); 
			jQuery('#single-pagination.fixed').addClass("text-light"); 
			jQuery('#header-actions').addClass("text-light"); 
		} else if (jQuery("#hero").hasClass("text-dark")) {
			jQuery('body').addClass("hero-dark");
			jQuery('#header > .header-inner #menu.classic #menu-inner').addClass("text-dark"); 
			jQuery('#header > .header-inner .menu-actions').addClass("text-dark"); 
			jQuery('#header > .header-inner #logo').addClass("text-dark"); 
			jQuery('#single-share.fixed').addClass("text-dark"); 
			jQuery('#single-pagination.fixed').addClass("text-dark");
			jQuery('#header-actions').addClass("text-dark");
		}
	}
	
	
	// create header pseudo
	var headerHeight = 0;
	if (!jQuery("body").hasClass("hero-fullscreen")) { headerHeight = jQuery("header").height(); }
	jQuery("body").append('<div id="pseudo-header" style="height:'+headerHeight+'px;position:absolute;z-index:-10;"></div>');
	
	
	/*---------------------------------------------- 
				S M O O T H   S H O W    (pageloader)
	------------------------------------------------*/
	jQuery("body").addClass("loaded");
	setTimeout(function(){
		setTimeout(function(){ animateOnScroll(true); },500);
		headerFeatures();
	}, 500);
	setTimeout(function(){
		jQuery("body").addClass("loading-end");		
	}, 1500);
	
	
	
	/*---------------------------------------------- 
	  P R E P A R E   C O L U M N   A L I G N
	------------------------------------------------*/
	jQuery('.column-section .column').each(function() {
		if (!jQuery.trim(jQuery(this).html())) {
			jQuery(this).addClass("empty-content");
		} else {
			if (jQuery(this).children('.col-content').length < 1) {  jQuery(this).wrapInner('<div class="col-content"></div>'); }	
		}	
	});
	
	
	
	/*---------------------------------------------- 
			   R E S P O N S I V E   N A V
	------------------------------------------------*/
	/* SPAB RICE */
	jQuery('#header').on("click", ".menu-toggle", function() {
		jQuery('html').toggleClass('disablescroll'); 	
		setTimeout(function(){ jQuery('#header').toggleClass('menu-is-open'); }, 50); // timeout because burger animation glitch in comb with disablescroll
		return false;
	});
	/* SPAB RICE */
	
	jQuery('#main-nav').on("click", "li > a", function() {
		var thisItem = jQuery(this); 
		var thisParent = jQuery(this).parent('li'); 
		if (thisItem.siblings('ul').length > 0 && thisItem.siblings('ul').css('display') === 'none') {
			thisItem.siblings('ul').slideDown(400, "easeInOutCubic");
			thisParent.siblings('li').children('ul').slideUp(400, "easeInOutCubic");
			return false;	
		} else if (jQuery('#menu').hasClass("transition-enabled")) {
			var href = jQuery(this).attr('href');
			jQuery("#page-content").addClass("go-to-page");
			jQuery('#header').removeClass('menu-is-open');
			jQuery('html').removeClass('disablescroll');
			setTimeout(function() { window.location = href; }, 700);
			return false;	
		}
	});
	
	
	
	/*---------------------------------------------- 
			   H E A D E R   A C T I O N S
	------------------------------------------------*/
	jQuery('header').on("click", ".open-action", function() {
		jQuery('html').addClass('disablescroll');
		jQuery('#header').addClass('action-is-active '+jQuery(this).data('action')).removeClass('menu-is-open'); 
		return false;
	});
	
	jQuery('header').on("click", ".header-close", function() {
		jQuery('html').removeClass('disablescroll');
		jQuery('header .open-action').each(function(){
			jQuery('#header').removeClass(jQuery(this).data('action'));	
		});
		jQuery('#header').removeClass('action-is-active').removeClass('menu-is-open'); 
		return false;
	});
	
	
	
	/*---------------------------------------------- 
			P A G I N A T I O N   A C T I O N
	------------------------------------------------*/
	/* SPAB RICE  (hover fixed) */
	jQuery("#single-pagination.fixed li a").on("mouseenter", function() {
		var dir = jQuery(this).parent("li").attr("class");
		jQuery("#page-content").addClass("active-pagination-"+dir);
	}).on('mouseleave',  function(){
		jQuery("#page-content").removeClass("active-pagination-next").removeClass("active-pagination-prev");
	});
	
	/* pseudo ajax anim */
	jQuery('#single-pagination.fixed').on("click", "li a.pseudo-ajax", function() { 
		var dir = jQuery(this).parent("li").attr("class");
		var href = jQuery(this).attr('href');
		jQuery("#page-content").addClass("go-pagination-"+dir);
		setTimeout(function() { window.location = href; }, 800);
		return false;
	});
	
	
	if (typeof ColorThief === 'function') {
		var colorThief = new ColorThief();
		jQuery("#single-pagination.fixed .pagination li .page-image img").each(function(){
			var image = jQuery(this);  image = image[0];
			var color = colorThief.getColor(image);
			//alert(color);
			jQuery(this).parents('.page-image').css('background-color','rgb('+color+')');
		});
	}
	/* SPAB RICE */
	
	
	/*---------------------------------------------- 
			I S O T O P E  /  M A S O N R Y 
	------------------------------------------------*/
	if( jQuery().isotope ) { 
	
		/* Call Isotope  
		------------------------------------------------*/	
		jQuery('.isotope-grid').each(function(){
			var $container = jQuery(this);
			var layout = "masonry";
			if ($container.hasClass("fitrows")) { layout = "fitRows"; }
			$container.imagesLoaded( function(){
				$container.isotope({
					layoutMode: layout,
					itemSelector : '.isotope-item',
					masonry: { columnWidth: '.isotope-item:not(.double-width)' }
				});	
			});
			setTimeout(function() { $container.isotope( 'layout' ); reorganizeIsotope(); }, 500);	
		});
		
					
		
		/* Filter isotope
		------------------------------------------------*/
		jQuery('.grid-filter').on("click", "li a", function() { 
			var thisItem = jQuery(this);
			var parentul = thisItem.parents('ul.grid-filter').data('related-grid');
			if (!parentul) {
				alert('Please specify the dala-related-grid');
			} else {
				thisItem.parents('ul.grid-filter').find('li').removeClass('active');
				thisItem.parent('li').addClass('active');
				var selector = thisItem.attr('data-filter');
				jQuery('#'+parentul).isotope({ filter: selector });
				jQuery('#'+parentul+' .isotope-item [class*="do-anim"]').not(selector).removeClass("animated");				
				setTimeout(function() { jQuery('#'+parentul+' .isotope-item'+selector+' [class*="do-anim"]').addClass("animated"); },200);
				
				// adding slug hashtag to url
				var slug = thisItem.data('slug');
				if (slug) { 
					window.location.hash = slug; } 
				else {
					history.pushState("", document.title, window.location.pathname + window.location.search);
				}
			}
			return false;
		});
		
		/* Scroll to portfolio if header filter is clicked
		------------------------------------------------*/
		jQuery('header').on("click", ".open-action.action-filter", function() {
			var relGrid = jQuery('#header .action-overlay.filter-overlay ul.grid-filter').data('related-grid');
			setTimeout(function() {
				jQuery('html,body').animate({ scrollTop: jQuery("#"+relGrid).offset().top}, 1000, 'easeInOutQuart');
			}, 300);
			return false;
		});
		
		
		/* Load More isotope
		------------------------------------------------*/
		jQuery('.load-isotope:not(.disabled)').on("click","a", function() {
			var el = jQuery(this);
			if(el.data("loadpage") === undefined) { el.data("loadpage","2"); }
			else { el.data("loadpage", parseInt(el.data("loadpage"),10)+1); }
			var 	related = el.data('related-grid');
			var 	href = el.attr('href').replace("/2", '/'+el.data("loadpage"));
			href = href.replace("2", el.data("loadpage"));
			var datas = '';
			if(el.data("options") !== undefined && el.data("options")) { datas = el.data('options').replace("paged=2", "paged="+el.data("loadpage")); }
			isotopeLoadMore(jQuery('#'+related),el,href,datas);
			return false;
		});
		
	}
	
	
	
	
	/*---------------------------------------------- 
				 	L A Z Y   L O A D 
	------------------------------------------------*/
	if(jQuery().unveil && jQuery("img.lazy").length > 0) { 
		jQuery("img.lazy").unveil(600);
	}
	
	
		
	/*---------------------------------------------- 
			    I N L I N E   V I D E O
	------------------------------------------------*/
	jQuery('body').on("click", ".inline-video", function() { 
		var el = jQuery(this);
		var type = el.data('type');
		var video = el.data('videoid');
				
		if (type === 'youtube') { 
		var iframe='<iframe src="https://www.youtube.com/embed/'+video+'?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen ></iframe>';
		} else if (type === 'vimeo') {
		var iframe='<iframe src="https://player.vimeo.com/video/'+video+'?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>';
		}
		
		el.append('<div class="inline-iframe-container" style="display:none;"></div>');
		el.find(".inline-iframe-container").fadeIn(200);
		el.find(".inline-iframe-container").html(iframe+'<div class="close-inline-video"></div>');
		
		setTimeout(function() {
			el.addClass('active');
		}, 1000);
		
		return false;
	});
	
	jQuery('body').on("click", ".close-inline-video", function() { 
		var thisItem = jQuery(this); 
		thisItem.parents( ".inline-video" ).removeClass('active');
		thisItem.parent( ".inline-iframe-container" ).fadeOut(200).remove();
		return false;
	});
	
	
	
	/*---------------------------------------------- 
		O W L   S L I D E R & C A R O U S E L
	------------------------------------------------*/
	if(jQuery().owlCarousel) {
		
		jQuery(".owl-slider").owlCarousel({
			items:1,
			nav: false,
			navText:false,
			dots: true,
			smartSpeed : 600,			
			singleItem : true,
			autoHeight : true,
			loop: false,
			autoplay: false,
			autoplayHoverPause : true,
			navRewind: false
		});
		
		jQuery(".owl-carousel").owlCarousel({
			items : 4,
			itemsDesktop:false,
			responsive: { //shop related items
			  480: { items: 1 },
			  768: { items: 2 },
			  },
			autoplay: false,
			autoHeight : true,
			nav: true,
			navText:false,
			dots: true,
			loop: false
		});
				
	}
	
	
	
	/*---------------------------------------------- 
				   	 P A R A L L A X
	------------------------------------------------*/
	if(jQuery().parallax) { 
		jQuery('.parallax-section').parallax({speed:0.6});
	}
	
	
	/*---------------------------------------------- 
				   F I T   V I D E O S
	------------------------------------------------*/
	if(jQuery().fitVids) { 
		jQuery("body").fitVids();
	}
	
	
	/*---------------------------------------------- 
				   	 V I D E O   B G
	------------------------------------------------*/
	if(jQuery().phatVideoBg) { 
		jQuery('.videobg-section').phatVideoBg();
	}
	
	
	
	/*---------------------------------------------- 
				   	L I G H T C A S E
	------------------------------------------------*/
	if(jQuery().lightcase) {
		jQuery('a[data-rel^=lightcase]').lightcase({ 
			showSequenceInfo: false, 
			swipe: true, 
			showCaption: true,
			overlayOpacity:1,
			maxWidth: 1300,
			maxHeight: 1100,
			shrinkFactor: 1,
			liveResize: true,
			fullScreenModeForMobile: true,
			video: {
				width : 1280,
				height : 720
				},
			iframe:{
				width : 1280,
				height : 720,
				allowfullscreen: 1
				}
		});
		
		jQuery('a[data-rel^="lightcase:"]').each(function(index) {
			var el = jQuery(this);
			if(!el.hasClass('lc-trigger') && !el.parents('.isotope-item').hasClass('sr-gallery-item')) {
			var rel = el.data('rel');
            var href = el.attr('href');
			var count = jQuery('a[href="'+href+'"][data-rel="'+rel+'"]').length;
				if(count > 1) {
					jQuery('a[href="'+href+'"][data-rel="'+rel+'"]').not(this).addClass('lc-trigger').attr('data-trigger',index).attr('data-rel','');	
					el.addClass('lc-trigger-'+index);	
				}
			}
        });
		
		jQuery('a.lc-trigger').on("click", function() { 
			jQuery( ".lc-trigger-"+jQuery(this).data('trigger') ).trigger( "click" );
			return false;
		});
		
		// mute all bg videos if lightcase is opened
		jQuery('a[data-rel^=lightcase]').on("click", function() {
			if (jQuery(".phatvideo-bg .mute-video:not(.unmute)").length) {
				jQuery('.phatvideo-bg .mute-video:not(.unmute)').each(function() {
					jQuery(this).trigger("click");
				});
			}
		});
		
	}

	
	/*---------------------------------------------- 
				        T A B S 
	------------------------------------------------*/	
	jQuery(".tabs:not(.wc-tabs):not(.woocommerce-tabs)").each(function() {
		var thisItem = jQuery(this); 
		thisItem.find('.tab-content').removeClass('active').css('display','none');
		var rel = thisItem.find('.active a').attr('href');
		thisItem.find('.'+rel).addClass('active');
	});
	
	jQuery(".tab-nav:not(.wc-tabs)").on("click", "a", function() { 
		var thisItem = jQuery(this); 
		var parentdiv = thisItem.parents('li').parent('ul').parent('div');
		var rel = thisItem.attr('href');
		
		jQuery(parentdiv).find(".tab-nav li").removeClass("active");
		thisItem.parents('li').addClass("active");
		
		jQuery(parentdiv).find(".tab-container .tab-content").hide().removeClass('active');
		jQuery(parentdiv).find(".tab-container ."+rel).fadeIn(500).addClass('active');
		
		return false;
	});
	
	
	
	/*---------------------------------------------- 
			T O G G L E  &  A C C O R D I O N
	------------------------------------------------*/		
	jQuery(".toggle-item").each(function() {
		if (!jQuery(this).find('.toggle-active').length) { jQuery(this).find('.toggle-inner').slideUp(300); }
		jQuery(this).find('.toggle-active').parent(".toggle-item").siblings('.toggle-item').find('.toggle-inner').slideUp(300);	
		jQuery(this).find('.toggle-active').siblings('.toggle-inner').slideDown(300);							
	});
	
	jQuery(".toggle-item").on("click", ".toggle-title", function() { 
		var thisItem = jQuery(this); 
		var parentdiv = thisItem.parent('div').parent('div');
		var active = thisItem.parent('div').find('.toggle-inner').css('display');
		
		if (jQuery(parentdiv).attr('class') === 'accordion') {
			if (active !== 'none' ) { 
				jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
				thisItem.toggleClass('toggle-active');
			} else {
				jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
				jQuery(parentdiv).find('.toggle-item .toggle-title').removeClass('toggle-active');
				
				thisItem.toggleClass('toggle-active');
				thisItem.siblings('.toggle-inner').slideDown(300);
			}
		} else {
			thisItem.toggleClass('toggle-active');
			thisItem.siblings('.toggle-inner').slideToggle(300);
		}
		
		return false;
	});
	
	
	
	
	/*---------------------------------------------- 
				   S C R O L L   T O (back to top, scroll down)
	------------------------------------------------*/
	jQuery('body').on('click', '.totop, #scrolldown', function() {
		var topPos = 0;
		if (jQuery(this).attr("id") === "scrolldown") { topPos = jQuery("#page-body").offset().top + 2; }
		jQuery('html,body').animate({ scrollTop: topPos}, 1000, 'easeInOutQuart');
		return false;
	});
		
	
	resizeAdapt();
});

jQuery(window).on('scroll',function() { 
	animateOnScroll(false);
	headerFeatures(); 
});

jQuery(window).on('resize',function() { 
	reorganizeIsotope();
	resizeAdapt(); 
});

})(jQuery);



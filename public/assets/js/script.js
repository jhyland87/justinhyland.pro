// Custom JavaScript
"use strict";

/***************************************************************
	SEARCH MOBILE DEVICE
***************************************************************/
const mobiles = {
  Android     : 'Android',
  BlackBerry  : 'BlackBerry',
  iOS         : 'i(phone|pad)',
  Opera       : 'Opera Mini',
  Windows     : 'IEMobile',
  OSX         : 'Mac OS X'
}

const mobileChecks = {}

var regexObj
var regexResult
var onMobile = false

$.each( mobiles, mob => mobileChecks[ mob ] = () => !!navigator.userAgent.match( new RegExp( mobiles[ mob ], 'i') ) )

mobileChecks.any = () => {
  var result = false
  $.each( mobiles, mob => {

    result = !!mobileChecks[ mob ]()

    // Return false if a match was found (to abort loop)
    return !result
  })
  return result
}

onMobile = mobileChecks.any()

/*
var mobileChecks = {
  Android: () => navigator.userAgent.match(/Android/i)
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (mobileChecks.Android() || mobileChecks.BlackBerry() || mobileChecks.iOS() || mobileChecks.Opera() || mobileChecks.Windows());
    }
};
if (mobileChecks.any()) onMobile = true;
*/

//Preloader
$(window).load(function() {
    $("#intro-loader").delay(600).fadeOut();
    $(".mask").delay(600).fadeOut("slow");
});

$(window).load(function(){
  console.log('blah..')
  var links = []
  var structText = value => _.chain( value ).toLower().startCase().value()

  $( '.demo-content' ).each( function( idx ,elem ){
    var $elem = $( elem )

    links.push(
      $( '<a/>',{
        href    : '#' + $elem.attr( 'id' ),
        text    : structText( $elem.data( 'title' ) ) ,
        class   : ''
      }).prop( 'outerHTML' )
    )
  })

  $( '#menu-items' ).html( links.join( ' | ' ) )
})

//Parallax
$(window).bind('load', function() {
    if (!onMobile)
        parallaxInit();
});

$(document).ready(function() {
    "use strict";
    //Elements Appear from top
    $('.item_top').each(function() {
        $(this).appear(function() {
            $(this).delay(200).animate({
                opacity: 1,
                top: "0px"
            }, 1000);
        });
    });

    //Elements Appear from bottom
    $('.item_bottom').each(function() {
        $(this).appear(function() {
            $(this).delay(200).animate({
                opacity: 1,
                bottom: "0px"
            }, 1000);
        });
    });
    //Elements Appear from left
    $('.item_left').each(function() {
        $(this).appear(function() {
            $(this).delay(200).animate({
                opacity: 1,
                left: "0px"
            }, 1000);
        });
    });

    //Elements Appear from right
    $('.item_right').each(function() {
        $(this).appear(function() {
            $(this).delay(200).animate({
                opacity: 1,
                right: "0px"
            }, 1000);
        });
    });

    //Elements Appear in fadeIn effect
    $('.item_fade_in').each(function() {
        $(this).appear(function() {
            $(this).delay(200).animate({
                opacity: 1,
                right: "0px"
            }, 1000);
        });
    });


    if ($("#pie-container").length)
        rotate('rotate1');

    $('body').on('touchstart.dropdown', '.dropdown-menu', function(e) {
        e.stopPropagation();
    });

    // PRETTYPHOTO //
    $("a[data-gal^='prettyPhoto']").prettyPhoto({
        animation_speed: "normal",
        theme: "light_rounded",
        opacity: 0.5,
        social_tools: false,
        deeplinking: false
    });

});

// Append .background-image-holder <img>'s as CSS backgrounds
$('.bg-image-holder').each(function() {
    var imgSrc = $(this).children('img').attr('src');
    $(this).css('background', 'url("' + imgSrc + '") 50% 0%');
    $(this).children('.background-image').remove();
});

//Resume Timeline Event
if ($("ul.timeline").length) {
    $("ul.timeline .open").find(".content").slideDown();

    $("ul.timeline").on("click", "li", function() {
        $this = $(this);
        $this.find(".content").slideDown();
        $this.addClass("open");
        $this.siblings('li.open').find(".content").slideUp();
        $this.siblings('li').removeClass("open");
    }).on('mouseenter', 'li', function() {
        $this = $(this);
        ($this.hasClass('open'));
    });
}

// Share post  
$(function() {
    var url = window.location.href;
    var options = {
        twitter: true,
        facebook: true,
        googlePlus: true,
        pinterest: false,
        tumblr: false
    };

    $('.socialShare').shareButtons(url, options);

});

/* ==============================================
NAVIGATION DROP DOWN MENU
=============================================== */
$('.nav-toggle').hover(function() {
    $(this).find('.dropdown-menu').first().stop(true, true).fadeIn(450);
}, function() {
    $(this).find('.dropdown-menu').first().stop(true, true).fadeOut(450)
});
/* ==============================================
SOFT SCROLL EFFECT FOR NAVIGATION LINKS
=============================================== */
$('.scroll').bind('click', function(event) {
    var $anchor = $(this);
    var headerH = $('#navigation, #navigation-sticky').outerHeight();
    $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - headerH + "px"
    }, 1200, 'easeInOutExpo');
    event.preventDefault();
});
/* ==============================================
NAVIGATION SECTION CHANGEABLE BACKGROUND SCRIPT
=============================================== */
if($('.headerWrapper').length){
var menu = $('#navigation');
$(window).scroll(function() {
    var y = $(this).scrollTop();
    var homeH = $('.headerWrapper').outerHeight();
    var headerH = $('#navigation').outerHeight();
    var z = $('.headerWrapper').offset().top + homeH - headerH - 72;
    if (y >= z) {
        menu.removeClass('first-nav').addClass('second-nav');
    } else {
        menu.removeClass('second-nav').addClass('first-nav');
    }
});

var menu2 = $('#navigation-sticky');
$(window).scroll(function() {
    var y = $(this).scrollTop();
    var homeH = $('.headerWrapper').outerHeight();
    var headerH = $('#navigation-sticky').outerHeight();
    var z = $('.headerWrapper').offset().top + homeH - headerH - 72;
    if (y >= z) {
        menu2.removeClass('trans-nav').addClass('color-nav second-nav');
        if ($('.light-logo').length && $('.dark-logo').length) {
            $('.light-logo').css('display', 'none');
            $('.dark-logo').css('display', 'block');
        }
    } else {
        menu2.removeClass('color-nav second-nav').addClass('trans-nav');
        if ($('.light-logo').length && $('.dark-logo').length) {
            $('.dark-logo').css('display', 'none');
            $('.light-logo').css('display', 'block');
        }
    }
});
}
/* ==============================================
MOBILE NAV BUTTON
=============================================== */
$(".mobile-nav-button").click(function() {
    $(".nav-inner div.nav-menu").slideToggle("medium", function() {
        // Animation complete.
    });
});
$('.nav-inner div.nav-menu ul.nav li a').click(function() {
    if ($(window).width() < 1000) {
        $(".nav-menu").slideToggle("2000")
    }
});

function parallaxInit() {
    $('#testimonial').parallax("50%", 0.2);
    $('#quote').parallax("50%", 0.2);
}

    /*============================================
    	Owl - Carrousel
    	==============================================*/
    if (jQuery().owlCarousel) {
        if ($(".testimonial").length) {
            $(".testimonial").owlCarousel({
                navigation: false,
                pagination: true,
                responsive: true,
                //Basic Speeds
                slideSpeed: 600,
                paginationSpeed: 1000,
                transitionStyle: "fadeUp",
                items: 1,
                touchDrag: true,
                mouseDrag: true,
                autoHeight: true,
                autoPlay: 5000
            });
        }

        if ($("#client_carrousel").length) {
            $("#client_carrousel").owlCarousel({
                navigation: false,
                pagination: false,
                stopOnHover: true,
                itemsScaleUp: true,
                items: 5,
                responsive: {
                    0: {
                        items: 1
                    },
                    480: {
                        items: 2
                    },
                    768: {
                        items: 3
                    },
                    992: {
                        items: 4
                    },
                    1200: {
                        items: 5
                    }
                },
                autoPlay: 4000
            });
        }
        if ($(".gallery-slider").length) {
            $(".gallery-slider").owlCarousel({
                stopOnHover: true,
                navigation: true,
                navigationText: ["<i class='fa fa-long-arrow-left'></i>", "<i class='fa fa-long-arrow-right'></i>"],
                paginationSpeed: 3000,
                goToFirstSpeed: 2000,
                autoHeight: true,
                singleItem: true,
                transitionStyle: "fade"
            })
        }
    }
    /*-----------------------------------
    Flickr Feed
    -----------------------------------*/

    // Get your flickr ID from: http://idgettr.com/
    if ($('#flickr-feed').length) {
        var flickr_id = '71865026@N00';

        var $flcr_feed

        $flcr_feed = $('#flickr-feed');
        if ($flcr_feed.length) {
            $('#flickr-feed').jflickrfeed({
                limit: $flcr_feed.data('items'),
                qstrings: {
                    id: '71865026@N00'
                },
                itemTemplate: '<li><a href="{{image_b}}" rel="prettyPhoto[flickr]"><img src="{{image_s}}" alt="{{title}}" /><span><i class="fa fa-search"></i></span></a></li>',
                itemCallback: function() {
                    $("a[rel='prettyPhoto[flickr]']").prettyPhoto({
                        animation_speed: "normal",
                        theme: "light_rounded",
                        opacity: 0.5,
                        social_tools: false,
                        deeplinking: false,
                        changepicturecallback: function() {
                            $('.pp_pic_holder').show();
                        }
                    });
                }
            });
        }
    }

$(window).load(function() {
    "use strict";
    // Contact Form Request
    if ($('#contactform').length) {
        $(".validate").validate();
        var form = $('#contactform');
        var submit = $('#contactForm_submit');
        var alertx = $('.form-respond');

        // form submit event
        $(document).on('submit', '#contactform', function(e) {
            e.preventDefault(); // prevent default form submit
            // sending ajax request through jQuery
            $.ajax({
                url: 'sendemail.php',
                type: 'POST',
                dataType: 'html',
                data: form.serialize(),
                beforeSend: function() {
                    alertx.fadeOut();
                    submit.html('Sending....'); // change submit button text
                },
                success: function(data) {
                    form.fadeOut(300);
                    alertx.html(data).fadeIn(1000); // fade in response data     
                    setTimeout(function() {
                        alertx.html(data).fadeOut(300);
                        $('#name, #email, #message').val('')
                        form.fadeIn(1800);
                    }, 4000);

                },
                error: function(e) {
                    console.log(e)
                }
            });
        });
    }

    //Leaving Page Fade Out
    $('a.external').click(function() {
        var url = $(this).attr('href');
        $('.mask').fadeIn(600, function() {
            document.location.href = url;
        });
        $("#intro-loader").fadeIn("slow");
        return false;
    });

    //Masonry Blog
    if ($('.blog-posts-content').length) {
        var $container = $('.blog-posts-content');
        $container.isotope({
            masonry: {},
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false,
            },
        });
    }
      // Masonry Portfolio
  if ($('.masonry-wrapper').length) {
  var $masonryContainer = $('.masonry-wrapper'),
      $itemsW = $('.work-item'),
      colW = $itemsW.outerWidth(true);


  $masonryContainer.isotope({
    resizable: false,
    masonry: {
      columnWidth: colW
    }
  }).isotope('reLayout');
  
  
  $(window).smartresize(function(){
    var colW = $itemsW.outerWidth(true);
    $masonryContainer.isotope({
      masonry: {
        columnWidth: colW
      }
    })
  });
  
  $('.filter a').click(function() {
        $('.filter a').removeClass('active');
        $(this).addClass('active');
        var selector = $(this).attr('data-filter');
        $masonryContainer.isotope({
            filter: selector
        });
        $masonryContainer.isotope('reLayout');
        return false;
    });
  } 
});
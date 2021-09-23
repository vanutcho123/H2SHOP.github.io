$(document).ready(function() {
    //Scroll up sticky
    $(window).scroll(function() {
        if (this.scrollY > 20) {
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        };

        if (this.scrollY > 300) {
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        };
    });

    //Scroll up btn
    $('.scroll-up-btn').click(function() {
        $('html').animate({
            scrollTop: 0
        });
    });


    // Slider
    $('.owl-carousel:first').owlCarousel({
        loop: true,
        // margin: 10,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4000,
        responsive: {
            0: {
                items: 1
            },
            740: {
                items: 1
            },
            1024: {
                items: 1
            }
        }
    })

    $('.owl-carousel.general').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        autoplay: true,
        autoplayTimeout: 6000,
        responsive: {
            0: {
                items: 2
            },
            740: {
                items: 3
            },
            1024: {
                items: 4
            }
        }
    })

    $('.owl-carousel:last').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        autoplay: true,
        autoplayTimeout: 5000,
        responsive: {
            0: {
                items: 1
            },
            740: {
                items: 2
            },
            1024: {
                items: 3
            }
        }
    });

})

AOS.init({
    duration: 1000,
    easing: 'ease-in',
    delay: 200,
    once: true

});
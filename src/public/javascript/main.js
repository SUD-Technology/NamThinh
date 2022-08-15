$(document).ready(function () {
    setTimeout(function () {
        $('.loader-wrapper').fadeOut(500);
    }, 2000)
    const pathname = window.location.pathname;
    const nav = pathname.split('/')[1];

    if (nav) {
        $(`#${nav}`).siblings().removeClass('current');
        $(`#${nav}`).addClass('current');
    }


    var old_img = '';
    $('.hexIn').hover(function () {
        old_img = $(this).children('.hexImg').attr('src');
        $(this).children('.hexImg').attr('src', 'https://media.istockphoto.com/photos/hand-using-laptop-and-press-screen-to-search-browsing-on-the-internet-picture-id1271072224?b=1&k=20&m=1271072224&s=170667a&w=0&h=4BaKdYk3VKJO-smyDBRkX1wNErrgZwCJTaj08a7rZHc=')
    }, function () {
        $(this).children('.hexImg').attr('src', old_img);
    })

    $('#eye').click(function () {
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye');
        if ($(this).hasClass('open')) {
            $(this).prev().attr('type', 'text');
        } else {
            $(this).prev().attr('type', 'password');
        }
    });

    $('#eye2').click(function () {
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye');
        if ($(this).hasClass('open')) {
            $(this).prev().attr('type', 'text');
        } else {
            $(this).prev().attr('type', 'password');
        }
    });

    $('#eye3').click(function () {
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye');
        if ($(this).hasClass('open')) {
            $(this).prev().attr('type', 'text');
        } else {
            $(this).prev().attr('type', 'password');
        }
    });

    $('#eye4').click(function () {
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye');
        if ($(this).hasClass('open')) {
            $(this).prev().attr('type', 'text');
        } else {
            $(this).prev().attr('type', 'password');
        }
    });

    // Image Modal
    $(function () {
        $('.product1 img').click((event) => {
            var targetID = $(event.target).data("id");
            $('.carousel-item').each((index, element) => {
                if (index + 1 == targetID)
                    $(element).addClass('active')
                else {
                    $(element).removeClass('active')
                }
            })
        })
    })

    // leave message: start
    $(function () {
        $('#leaver-header').click(() => {
            $('.leave-msg-body').slideToggle("slow");
            $('#leaver-header i').toggleClass('rotate');
        })
    })
    // leave message: end

    // 

    $(function () {
        $('#bar-btn-left').click(() => {
            $('#left-sidebar').animate({ left: "0px" });
            $('#right-sidebar').animate({ right: "-400" });
            $('#collapse2').slideUp();
            $('#collapse1').slideUp();
            $('#collapse3').slideUp();
        })

        $('#left-times').click(() => {
            $('#left-sidebar').animate({ left: "-400" });
        })

        $('#bar-btn-right').click(() => {
            $('#right-sidebar').animate({ right: "0px" });
            $('#left-sidebar').animate({ left: "-400" });
        })
        $('#right-times').click(() => {
            $('#right-sidebar').animate({ right: "-400" });
            $('#collapse2').slideUp();
            $('#collapse1').slideUp();
            $('#collapse3').slideUp();
            $('#pro-1-list').slideUp();
        })
    })


    $(function () {
        $('#collapse1').slideUp();
        $('#collapse-btn1').click(() => {
            $('#collapse1').slideToggle();
            $('#collapse2').slideUp();
            $('#collapse3').slideUp();
            $('#pro-1-list').slideUp();
        })
    })

    $(function () {
        $('#collapse2').slideUp();
        $('#collapse-btn2').click(() => {
            $('#collapse2').slideToggle();
            $('#collapse1').slideUp();
            $('#collapse3').slideUp();
            $('#pro-1-list').slideUp();
        })
    })

    $(function () {
        $('#collapse3').slideUp();
        $('#collapse-btn3').click(() => {
            $('#collapse3').slideToggle();
            $('#collapse1').slideUp();
            $('#collapse2').slideUp();
            $('#pro-1-list').slideUp();
        })
    })

    $(function () {
        $('#pro-1-list').slideUp();
        $('#pro-1').click(() => {
            $('#pro-1-list').slideToggle();
        })
    })

    $(function () {
        $('#pro-2-list').slideUp();
        $('#pro-2').click(() => {
            $('#pro-2-list').slideToggle();
        })
    })

    $(function () {
        $('#pro-3-list').slideUp();
        $('#pro-3').click(() => {
            $('#pro-3-list').slideToggle();
        })
    })

    $(function () {
        $('#pro-4-list').slideUp();
        $('#pro-4').click(() => {
            $('#pro-4-list').slideToggle();
        })
    })

    $(function () {
        $('#pro-11-list').slideUp();
        $('#pro-11').click(() => {
            $('#pro-11-list').slideToggle();
        })
    })

    // Zoom image

    $(".hover-2").mouseleave(
        function () {
            $(this).removeClass("hover");
        }
    );

    // Pagination Homepage
    function loadProducts(id) {
        $(`#${id}`).on('click', '.pagination a', function (e) {
            e.preventDefault();

            var current = $(this).parent();
            var last = current.siblings('.current');
            var currentUrl = last.children().attr('href');
            let currentPage = parseInt(last.children().attr('title'));
            let nextUrl = ''

            if (current.text() !== '1') {
                $(current).siblings('.prevPage').css('visibility', 'visible');
            } else {
                $(current).siblings('.prevPage').css('visibility', 'hidden');;
            }

            if (current.next().hasClass('nextPage')) {
                $(current).siblings('.nextPage').css('visibility', 'hidden');;
            } else {
                $(current).siblings('.nextPage').css('visibility', 'visible');;
            }

            if (current.hasClass('prevPage')) {
                if (!last.prev().hasClass('prevPage')) {
                    last.removeClass('current');
                    last.prev().addClass('current');
                    if (last.prev().prev().hasClass('prevPage')) {
                        $(current).css('visibility', 'hidden');
                    }
                }
                nextUrl = currentUrl.slice(0, -1) + (currentPage - 1);
            }
            else if (current.hasClass('nextPage')) {
                if (!last.next().hasClass('nextPage')) {

                    last.removeClass('current');
                    last.next().addClass('current');
                    if (last.next().next().hasClass('nextPage')) {
                        $(current).css('visibility', 'hidden');
                    }
                }
                nextUrl = currentUrl.slice(0, -1) + (currentPage + 1);
            } else {
                current.siblings().removeClass('current');
                current.addClass('current');
            }

            const url = nextUrl || $(this).attr('href') || '';

            if (url != '') {
                $.ajax({
                    url: url,
                    success: (data) => {
                        $(`#${id} .product-main`).html(data);
                    }
                })
            }
        })
    }
    loadProducts('tire-products')
    loadProducts('truck-products')
    loadProducts('tool-products')
    loadProducts('oil-products')
    // End Pagination Homepage


    // scroll-down

    setInterval(() => {
        $('.scroll-down').animate({
            bottom: "10px"
        }, 1000)

        $('.scroll-down').animate({
            bottom: "40px"
        }, 1000)
    }, 3000)



    $('.items-product').hover(function () {
        $(this).children('.img-box').children('.img-product').css('transform', 'scale(1.07)')
    }, function () {
        $(this).children('.img-box').children('.img-product').css('transform', 'scale(1)')
    })

    // 
    $('.user-info').hover(function () {
        $('.user-dropDown').show()
    }, function () {
        $('.user-dropDown').hide()
    })



    $('.scroll-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    })

    // Custom File Upload: start

    // Custom File Upload: end

    $('.user-dropDown').hover(function () {
        $(this).show()
    }, function () {
        $(this).hide()
    })

    // scroll top btn
    let scrollBtn = document.querySelector(".scroll-to-top");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () { scrollFunction() };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollBtn.style.opacity = "1";
        } else {
            scrollBtn.style.opacity = "0";
        }
    }

});




$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 5
        }
    }
})













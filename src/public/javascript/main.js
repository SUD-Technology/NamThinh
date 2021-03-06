$(document).ready(function () {

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
        })
    })


    $(function () {
        $('#collapse1').slideUp();
        $('#collapse-btn1').click(() => {
            $('#collapse1').slideToggle();
            $('#collapse2').slideUp();
            $('#collapse3').slideUp();
        })
    })

    $(function () {
        $('#collapse2').slideUp();
        $('#collapse-btn2').click(() => {
            $('#collapse2').slideToggle();
            $('#collapse1').slideUp();
            $('#collapse3').slideUp();
        })
    })

    $(function () {
        $('#collapse3').slideUp();
        $('#collapse-btn3').click(() => {
            $('#collapse3').slideToggle();
            $('#collapse1').slideUp();
            $('#collapse2').slideUp();
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
        $(`#${id}`).on('click', '.pagination a', function(e) {
            e.preventDefault();
            
            var current = $(this).parent();
            var last = current.siblings('.current');
            var currentUrl = last.children().attr('href');
            let currentPage =  parseInt(last.children().attr('title'));
            let nextUrl = ''
    
            if(current.text() !== '1') {
                $(current).siblings('.prevPage').css('visibility', 'visible');
            }else {
                $(current).siblings('.prevPage').css('visibility', 'hidden');;
            }
    
            if(current.next().hasClass('nextPage')) {
                $(current).siblings('.nextPage').css('visibility', 'hidden');;
            }else {
                $(current).siblings('.nextPage').css('visibility', 'visible');;
            }
    
            if(current.hasClass('prevPage')) {
                if(!last.prev().hasClass('prevPage')){
                    last.removeClass('current');
                    last.prev().addClass('current');
                    if(last.prev().prev().hasClass('prevPage')) {
                        $(current).css('visibility', 'hidden');
                    }
                }
                nextUrl = currentUrl.slice(0,-1) + (currentPage - 1);
            }
            else if(current.hasClass('nextPage')) {
                if(!last.next().hasClass('nextPage')){
                    
                    last.removeClass('current');
                    last.next().addClass('current');
                    if(last.next().next().hasClass('nextPage')) {
                        $(current).css('visibility', 'hidden'); 
                    }
                }
                nextUrl = currentUrl.slice(0,-1) + (currentPage + 1);
            }else {
                current.siblings().removeClass('current');
                current.addClass('current');
            }
            
            const url = nextUrl || $(this).attr('href') || '';
            
            if(url != '') {
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

    
    $('.items-product').hover(function() {
        $(this).children('.img-box').children('.img-product').css('transform', 'scale(1.07)')
    }, function() {
        $(this).children('.img-box').children('.img-product').css('transform', 'scale(1)')
    })

    // $(function () {
    //     $('.carousel-item').each(function () {
    //         var originalImagePath = $(this).find('img').data('original-image');
    //         $(this).zoom({
    //             url: originalImagePath,
    //             magnify: 3
    //         });
    //     });
    // });

    // Custom File Upload: start

    // Custom File Upload: end


});

// City Select

// function selectDistrict(calc_shipping_provinces, calc_shipping_district, billing_address_1, billing_address_2, district_local, address_1_saved, address_2_saved) {
//     //<![CDATA[
//     if (address_2 = localStorage.getItem(`${address_2_saved}`)) {
//         $(`select[name="${calc_shipping_district}"] option`).each(function () {
//             if ($(this).text() == address_2) {
//                 $(this).attr('selected', '')
//             }
//         })
//         $(`input.${billing_address_2}`).attr('value', address_2)
//     }
//     if (district = localStorage.getItem(`${district_local}`)) {
//         $(`select[name="${calc_shipping_district}"`).html(district)
//         $(`select[name="${calc_shipping_district}"`).on('change', function () {
//             var target = $(this).children('option:selected')
//             target.attr('selected', '')
//             $(`select[name="${calc_shipping_district}"] option`).not(target).removeAttr('selected')
//             address_2 = target.text()
//             $(`input.${billing_address_2}`).attr('value', address_2)
//             district = $(`select[name="${calc_shipping_district}"]`).html()
//             localStorage.setItem(`${district_local}`, district)
//             localStorage.setItem(`${address_2_saved}`, address_2)
//         })
//     }
//     $(`select[name="${calc_shipping_provinces}"]`).each(function () {
//         var $this = $(this),
//             stc = ''
//         c.forEach(function (i, e) {
//             e += +1
//             stc += '<option value=' + e + '>' + i + '</option>'
//             $this.html('<option value="">T???nh/Th??nh</option>' + stc)
//             if (address_1 = localStorage.getItem(`${address_1_saved}`)) {
//                 $(`select[name="${calc_shipping_provinces}"] option`).each(function () {
//                     if ($(this).text() == address_1) {
//                         $(this).attr('selected', '')
//                     }
//                 })
//                 $(`input.${billing_address_1}`).attr('value', address_1)
//             }
//             $this.on('change', function (i) {
//                 i = $this.children('option:selected').index() - 1
//                 var str = '',
//                     r = $this.val()
//                 if (r != '') {
//                     arr[i].forEach(function (el) {
//                         str += '<option value="' + el + '">' + el + '</option>'
//                         $(`select[name="${calc_shipping_district}"]`).html('<option value="">Qu???n/Huy???n</option>' + str)
//                     })
//                     var address_1 = $this.children('option:selected').text()
//                     var district = $(`select[name="${calc_shipping_district}"]`).html()
//                     localStorage.setItem(`${address_1_saved}`, address_1)
//                     localStorage.setItem(`${district_local}`, district)
//                     $(`select[name="${calc_shipping_district}"]`).on('change', function () {
//                         var target = $(this).children('option:selected')
//                         target.attr('selected', '')
//                         $(`select[name="${calc_shipping_district}"] option`).not(target).removeAttr('selected')
//                         var address_2 = target.text()
//                         $(`input.${billing_address_2}`).attr('value', address_2)
//                         district = $(`select[name="${calc_shipping_district}"]`).html()
//                         localStorage.setItem(`${district_local}`, district)
//                         localStorage.setItem(`${address_2_saved}`, address_2)
//                     })
//                 } else {
//                     $(`select[name="${calc_shipping_district}"]`).html('<option value="">Qu???n / Huy???n</option>')
//                     district = $(`select[name="${calc_shipping_district}"]`).html()
//                     localStorage.setItem(`${district_local}`, district)
//                     localStorage.removeItem(`${address_1_saved}`, address_1)
//                 }
//             })
//         })
//     })
//     //]]>
//     localStorage.clear()
// }

// selectDistrict("calc_shipping_provinces", "calc_shipping_district", "billing_address_1", "billing_address_2", "district_local", "address_1_saved", "address_2_saved")
// selectDistrict("calc_shipping_provinces_header", "calc_shipping_district_header", "billing_address_1_header", "billing_address_2_header", "district_local_header", "address_1_saved_header", "address_2_saved_header")



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











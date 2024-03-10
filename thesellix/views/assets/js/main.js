$(document).ready(function() {
    
    "use strict";
    const submenu_animation_speed = 200;

    const delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    const searchResults = function() {
        $('.header-search input').on('input', function() {
            var value = $(this).val();
            if(value.length > 0) {
                $('body').addClass('search-results-show');
                $('span.search-input-value').html(value);
            } else {
                $('body').removeClass('search-results-show');
            }
            $('.search-results .search-result-list').fadeOut(1);
            delay(function(){
                if(!$.trim($('.header-search input').val()).length != 0) {
                    $('.search-results .search-result-list').fadeOut(1);
                } else {
                    $('.search-results .search-result-list').fadeIn();
                }
            }, 500 );
        });
        
        $(document).keyup(function(e) {
            if($('body').hasClass('search-results-show')) {
                if (e.keyCode === 27) {
                    $('body').removeClass('search-results-show');
                } // Close on escape
            }
        });
        
        $(document).mouseup(function (e){
            var container = $(".search-results");
            var container2 = $(".header-search input");
            if (!container.is(e.target)
                && !container2.is(e.target)
                && container.has(e.target).length === 0
                && container2.has(e.target).length === 0) {
                $('body').removeClass('search-results-show');
            }
        });
        
        $('#closeSearch').on('click', function(){
            $('body').removeClass('search-results-show');
        });
    }

    

    const sidebar = function() {

        if (!$('.page-sidebar').length) { return }

        var select_sub_menus = $('.accordion-menu li:not(.open) ul'),
            active_page_sub_menu_link = $('.accordion-menu li.active-page > a');
        
        // Hide all sub-menus
        select_sub_menus.hide();

        const container = document.querySelector('.page-sidebar .accordion-menu');
        const ps = new PerfectScrollbar(container);

        
        if($('body').hasClass('page-sidebar-collapsed') && $(window).width() > 1350) {
            ps.destroy();
        }

        $(window).resize(function() {
            if ($(window).width() <= 1350) {
                const container = document.querySelector('.page-sidebar');
                const ps = new PerfectScrollbar(container);
            }
        });
        
        // Accordion
        $('.accordion-menu li a').on('click', function(e) {
            var sub_menu = $(this).next('ul'),
                parent_list_el = $(this).parent('li'),
                active_list_element = $('.accordion-menu > li.open'),
                show_sub_menu = function() {
                    sub_menu.slideDown(submenu_animation_speed);
                    parent_list_el.addClass('open');
                    ps.update();
                },
                hide_sub_menu = function() {
                    sub_menu.slideUp(submenu_animation_speed);
                    parent_list_el.removeClass('open');
                    ps.update();
                },
                hide_active_menu = function() {
                    $('.accordion-menu > li.open > ul').slideUp(submenu_animation_speed);
                    active_list_element.removeClass('open');
                    ps.update();
                };

            
            if(sub_menu.length) {
                
                if($('body').hasClass('page-sidebar-collapsed') && $(window).width() > 1350) {
                    e.preventDefault()
                    return;
                }

                if(!parent_list_el.hasClass('open')) {
                    if(active_list_element.length) {
                        hide_active_menu();
                    };
                    show_sub_menu();
                } else {
                    hide_sub_menu();
                };
                
                return false;
                
            };
        });
        
        if($('.active-page > ul').length) {
            active_page_sub_menu_link.click();
        };
    };

    function toggleSidebar() {
        $('body').toggleClass("sidebar-hidden");
    };

    function toggleCollapsedSidebar() {
        $('body').toggleClass("page-sidebar-collapsed");

        const container = document.querySelector('.page-sidebar .accordion-menu');
        const ps = new PerfectScrollbar(container);

        if($('body').hasClass('page-sidebar-collapsed')) {
            ps.destroy();
        }
    };

    $('#sidebar-toggle').on('click', function() {
        toggleSidebar();
    });

    $('#sidebar-collapsed-toggle').on('click', function() {
        toggleCollapsedSidebar();
    });

    $('.close-search').on('click', function() {
        $('body').removeClass('search-show');
    });
    
    $('#toggle-search').on('click', function() {
        $('body').addClass('search-show');
    });
    
    (function(){ 
        feather.replace()
    })();

    function global() {

        $('[data-bs-toggle="popover"]').popover();
        $('[data-bs-toggle="tooltip"]').tooltip(); // gives the scroll position


        // Form Validation
        var forms = document.querySelectorAll('.needs-validation');

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    form.classList.add('was-validated');
                }, false);
            });
    }

    const activitySidebar = function() {
        $('#activity-sidebar-toggle').on('click', function(e) {
            $('body').toggleClass('activity-sidebar-show')
            e.preventDefault()
        })

        $('.activity-sidebar-overlay').on('click', function(e) {
            $('body').toggleClass('activity-sidebar-show')
        })

        $('#activity-sidebar-close').on('click', function(e) {
            $('body').removeClass('activity-sidebar-show')
        })
    }

    searchResults();
    sidebar();
    global();
    activitySidebar();
});

$(window).on("load", function () {
    setTimeout(function() {
    $('body').addClass('no-loader')}, 1000)
});
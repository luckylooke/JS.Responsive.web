(function () {

    var $window = $(window),
        $document = $(document),
        $html = $("html");

    // responsive init
    JS.Responsive.init();
    JS.Responsive
        .addHorizontalBreakPoint( 'micro',   420 )
        .addHorizontalBreakPoint( 'tiny',    478 )
        .addHorizontalBreakPoint( 'small',   768 )
        .addHorizontalBreakPoint( 'medium',  992 )
        .addHorizontalBreakPoint( 'large',  1230 );

    // dynamic resize (document font size)
    $window.resize(function () {
        //console.log("resized");
        var etalon = 1320,
            w = $window.width(),
            h = $window.height(),
            koef = w / h,
            size = w, //Math.pow( w*w + h*h, 0.5),
            diff = Math.abs(etalon - size),
            sign = size > etalon ? 1 : -1,
            finalSize = etalon + Math.pow(diff, 1) * sign;

        //finalSize = etalon;

        // zastavenie zvacsovania nad etalon
        if (finalSize>etalon)
            finalSize = etalon;

        finalSize = (finalSize / etalon) * 100;

        $html.css('fontSize', (finalSize).toFixed(4)+'px');
        // $html.css('fontSize', '100px');

        // aj to hned raz spustime (necakame na resize)
    }).trigger('resize');

    // init wow.js
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true
    });
    wow.init();

    // background stripes
    var $bg = $('#page-background'),
        stripes = 20,
        offset = 1.23,
        start = (-1) * (stripes/2) * offset,
        minTopPosition = 0,
        maxTopPosition = $window.height(),
        minHeight = 0.10,
        maxHeight = 0.36,
        topPosition,
        height;

    for (var i = 1; i < stripes; i++) {

        // get random top position of tick element
        topPosition = Math.random() * (maxTopPosition - minTopPosition) + minTopPosition;

        // get random height of tick element
        height = Math.random() * (maxHeight - minHeight) + minHeight;

        // create tick
        var tick = $('<div />', {
            class: 'tick'
        }).css({
            'top': topPosition + 'px',
            'height': height + 'rem'
        });

        // add stripe with tick into bg
        $bg.append(
            $('<div />', {
                class: 'background-stripe'
            }).css('left', start + 'rem')
                .append(tick)
        );

        start += offset;
    }

    // open/close menu
    $('.navbar-toggle').on('click', function() {
        $('html').toggleClass('menu-open');
    });

})();
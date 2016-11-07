(function () {

    var $window = $(window),
        $document = $(document),
        $html = $("html");

    $('body').addClass('visible');

    // responsive init
    // JS.Responsive
    //     .addHorizontalSizePoint( 'micro',   420 )
    //     .addHorizontalSizePoint( 'tiny',    478 )
    //     .addHorizontalSizePoint( 'small',   768 )
    //     .addHorizontalSizePoint( 'medium',  992 )
    //     .addHorizontalSizePoint( 'large',  1346 );

    // dynamic resize (document font size)
    $window.resize(function () {
        //console.log("resized");
        var etalon = 1024,
            w = $window.width(),
            h = $window.height(),
            koef = w / h,
            size = Math.min(w, h), //Math.pow( w*w + h*h, 0.5),
            diff = Math.abs(etalon - size),
            sign = size > etalon ? 1 : -1,
            finalSize = etalon + Math.pow(diff, 1) * sign;

        //finalSize = etalon;
        // zastavenie zvacsovania nad etalon
        //if (finalSize>etalon)
        //finalSize = etalon;

        finalSize = (finalSize / etalon) * 100;

        $html.css('fontSize', parseInt(finalSize)+'px');
        // $html.css('fontSize', '100px');

        // aj to hned raz spustime (necakame na resize)
    }).trigger('resize');

    wow = new WOW(
        {
            animateClass: 'animated',
            offset: 100
        }
    );

    wow.init();

})();
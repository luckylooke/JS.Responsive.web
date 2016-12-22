// var selected = [];
var data = JSON.parse($('#featuresList').html());
// var datasource = data.featuresList;
var list = data.featuresList,
    listHalf = Math.ceil(list.length/2),
    domList = $('#checklist'),
    downloadLinks = $('#donwload-links'),
    downloadBtn = $('#download-btn'),
    $allCheck = $("#all"),
    $defaultCheck = $("#default"),
    parent = domList.parent(),
    domListDetached = domList.detach(),
    inputs,
    html = '',
    defaultSetup = '100001110001';

html += '<div class="col-6">';
$.each(list, function (i, feature) {
    html += (i === listHalf ? '</div><div class="col-6">' : '');
    html += '<div title="' + feature.teaser + '"><input type="checkbox" name="checklist" id="a' + i + '" /><label for="a' + i + '">' + feature.file + '</label></div>';
});
html += '</div>';

domListDetached.append(html);
parent.append(domListDetached);

inputs = domList.find('input');
domList.on('click', refreshLinks);

inputs.prop('checked', function(i){
    return !!parseInt(defaultSetup[i]);
});

$allCheck.change(function (e) {
    inputs.prop('checked', $(this).prop("checked"));
    refreshLinks(e);
});
$defaultCheck.change(function (e) {
    inputs.prop('checked', function(i){
        return !!parseInt(defaultSetup[i]);
    });
    refreshLinks(e);
});

function refreshLinks(e) {
    if(e)
        e.stopPropagation();

    var result = '',
        resultPath = '',
        cfg = '';
    inputs.each(function (i, chbox) {
        if(chbox.checked)
            result += '1';
        else
            result += '0';
    });

    if(!result.match(/0/)){
        result = 'full';
        $allCheck.prop("checked", true);
        $defaultCheck.prop("checked", false);
    }else if(!result.match(/1/) || result == defaultSetup){
        result = '';
        $allCheck.prop("checked", false);
        $defaultCheck.prop("checked", true);
    }else{
        cfg = parseInt('1' + result, 2);
        result = 'custom';
        $allCheck.prop("checked", false);
        $defaultCheck.prop("checked", false);
    }

    if(result){
        resultPath = '/' + result;
        result = '.' + result;
    }

    downloadLinks.html(
        '<div class="download-file wow bounceInRight" data-wow-delay="0.3s"><a class="link" target="_blank" href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.js">JS.Responsive' + result + '.js</a></div>'
        +'<div class="download-file wow bounceInRight" data-wow-delay="0.6s"><a class="link" target="_blank" href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.js.map">JS.Responsive' + result + '.js.map</a></div>'
        +'<div class="download-file wow bounceInRight" data-wow-delay="0.9s"><a class="link" target="_blank" href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.min.js">JS.Responsive' + result + '.min.js</a></div>'
        +'<div class="download-file wow bounceInRight" data-wow-delay="1.2s"><a class="link" target="_blank" href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.min.js.map">JS.Responsive' + result + '.min.js.map</a></div>'
    );

    downloadBtn.attr('href',
        '/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + cfg + '.zip'
    );
}

refreshLinks(); // init

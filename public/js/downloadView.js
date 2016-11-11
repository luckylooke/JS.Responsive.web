// var selected = [];
var data = JSON.parse($('#featuresList').html());
// var datasource = data.featuresList;
var list = data.featuresList,
    listHalf = Math.ceil(list.length/2),
    domList = $('#checklist'),
    downloadLinks = $('#donwload-links'),
    downloadBtn = $('#download-btn'),
    parent = domList.parent(),
    domListDetached = domList.detach(),
    inputs,
    html = '';

html += '<div class="col-6">';
$.each(list, function (i, feature) {
    html += (i === listHalf ? '</div><div class="col-6">' : '');
    html += '<div><input type="checkbox" name="checklist" id="a' + i + '" /><label for="a' + i + '">' + feature.file + '</label></div>';
});
html += '</div>';

domListDetached.append(html);
parent.append(domListDetached);

inputs = domList.find('input');
domList.on('click', refreshLinks);

$("#all").change(function (e) {
    inputs.prop('checked', $(this).prop("checked"));
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

    if(!result.match(/0/))
        result = 'full';
    else if(!result.match(/1/))
        result = '';
    else{
        cfg = parseInt('1' + result, 2);
        result = 'custom';
    }

    if(result){
        resultPath = '/' + result;
        result = '.' + result;
    }

    downloadLinks.html(
        '<a class="link" href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.js">JS.Responsive' + result + '.js</a>, '
        +'<a class="link" href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.js.map">JS.Responsive' + result + '.js.map</a>, '
        +'<a class="link" href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.min.js">JS.Responsive' + result + '.min.js</a>, '
        +'<a class="link" href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.min.js.map">JS.Responsive' + result + '.min.js.map</a>'
    );

    downloadBtn.attr('href',
        '/api/download/v3.0.1' + resultPath + cfg + '/JS.Responsive' + result + cfg + '.zip'
    );
}

refreshLinks(); // init

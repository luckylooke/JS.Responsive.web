// var selected = [];
var list = JSON.parse($('#featuresList').html()),
    fileSizes = JSON.parse($('#fileSizes').html()),
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
    defaultCfg = parseInt($('#defaultCfg').html()).toString(2).substr(1); // .substr(1) because first '1' is protection of leading zeros

for (var prop in fileSizes){
    if(fileSizes.hasOwnProperty(prop))
        fileSizes[prop] = Math.floor(fileSizes[prop]/1024);
}

// console.log('dingdong', fileSizes);

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
    return !!parseInt(defaultCfg[i]);
});

$allCheck.change(function (e) {
    inputs.prop('checked', $(this).prop("checked"));
    refreshLinks(e);
});
$defaultCheck.change(function (e) {
    inputs.prop('checked', function(i){
        return !!parseInt(defaultCfg[i]);
    });
    refreshLinks(e);
});

function refreshLinks(e) {
    if(e)
        e.stopPropagation();

    var result = '',
        resultPath = '',
        cfg = '',
        base = 'latest-';
    inputs.each(function (i, checkbox) {
        if(checkbox.checked)
            result += '1';
        else
            result += '0';
    });

    if(!result.match(/0/)){
        result = 'full';
        $allCheck.prop("checked", true);
        $defaultCheck.prop("checked", false);
    }else if(!result.match(/1/) || result == defaultCfg){
        result = '';
        base += 'default';
        $allCheck.prop("checked", false);
        $defaultCheck.prop("checked", true);
    }else{
        cfg = parseInt('1' + result, 2);
        result = 'custom';
        $allCheck.prop("checked", false);
        $defaultCheck.prop("checked", false);
    }
    base += result + cfg + '-JS.Responsive' + (result ? '.'+result : '');

    // console.log('base', base);

    if(result){
        resultPath = '/' + result;
        result = '.' + result;
    }

    downloadLinks.html(
        '<div class="download-file wow bounceInRight" data-wow-delay="0.3s"><a class="link" target="_blank" href="/api/download/latest' + resultPath + cfg + '/JS.Responsive' + result + '.js">JS.Responsive' + result + '.js' + getFileSize(base + ".js") + '</a></div>'
        +'<div class="download-file wow bounceInRight" data-wow-delay="0.6s"><a class="link" target="_blank" href="/api/download/latest' + resultPath + cfg + '/JS.Responsive' + result + '.js.map">JS.Responsive' + result + '.js.map' + getFileSize(base + ".js.map") + '</a></div>'
        +'<div class="download-file wow bounceInRight" data-wow-delay="0.9s"><a class="link" target="_blank" href="/api/download/latest' + resultPath + cfg + '/JS.Responsive' + result + '.min.js">JS.Responsive' + result + '.min.js' + getFileSize(base + ".min.js") + '</a></div>'
        +'<div class="download-file wow bounceInRight" data-wow-delay="1.2s"><a class="link" target="_blank" href="/api/download/latest' + resultPath + cfg + '/JS.Responsive' + result + '.min.js.map">JS.Responsive' + result + '.min.js.map' + getFileSize(base + ".min.js.map") + '</a></div>'
    );

    downloadBtn.attr('href', '/api/download/latest' + resultPath + cfg + '/JS.Responsive' + result + cfg + '.zip');
    downloadBtn.find('.size').html(getFileSize(base + cfg + ".zip"));
}

refreshLinks(); // init

function getFileSize(fileName){
    // console.log('getFileSize', fileName);
    return fileSizes[fileName] ? ' (' + fileSizes[fileName] + 'KB)' : '';
}
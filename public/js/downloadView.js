// var selected = [];
var data = JSON.parse($('#featuresList').html());
// var datasource = data.featuresList;
var list = data.featuresList,
    domList = $('#features-list'),
    downloadLinks = $('#donwload-links'),
    downloadBtn = $('#download-btn'),
    parent = domList.parent(),
    domListDetached = domList.detach(),
    inputs;

$.each(list, function (i, feature) {
    domListDetached.append(
        '<div class="checkbox">'
            +'<label>'
                +'<input type="checkbox">' + feature.file
            +'</label>'
        +'</div>'
    )
});

parent.append(domListDetached);

inputs = domList.find('input');

domList.on('click', refreshLinks);

$("#checkAll").change(function (e) {
    inputs.prop('checked', $(this).prop("checked"));
    refreshLinks(e);
});

function refreshLinks(e) {
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
        '<li><a href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.js">JS.Responsive' + result + '.js</a></li>'
        +'<li><a href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.js.map">JS.Responsive' + result + '.js.map</a></li>'
        +'<li><a href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.min.js">JS.Responsive' + result + '.min.js</a></li>'
        +'<li><a href="/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + '.min.js.map">JS.Responsive' + result + '.min.js.map</a></li>'
    );

    downloadBtn.attr('href',
        '/api/download/v3.0.0' + resultPath + cfg + '/JS.Responsive' + result + cfg + '.zip'
    );


}


// /*
//  The MIT License
//  Copyright 2016 (c) Peter Širka <petersirka@gmail.com>
//  */
//
// COMPONENT('checkboxlist', function() {
//     var self = this;
//     var template = Tangular.compile('<div class="{0} ui-checkboxlist-checkbox"><label><input type="checkbox" value="{{ id }}"><span>{{ name }}</span></label></div>'.format(self.attr('data-class')));
//
//     self.make = function() {
//
//         self.element.on('click', 'input', function() {
//             var arr = self.get() || [];
//             var value = self.parser(this.value);
//             var index = arr.indexOf(value);
//             if (index === -1)
//                 arr.push(value);
//             else
//                 arr.splice(index, 1);
//             self.set(arr);
//         });
//
//         self.element.on('click', '.ui-checkboxlist-selectall', function() {
//             var arr = [];
//             var inputs = self.element.find('input');
//             var value = self.get();
//
//             if (value && inputs.length === value.length) {
//                 self.set(arr);
//                 return;
//             }
//
//             inputs.each(function() {
//                 arr.push(self.parser(this.value));
//             });
//
//             self.set(arr);
//         });
//
//         self.make = function() {
//
//             var options = self.attr('data-options');
//             if (!options)
//                 return;
//
//             var arr = options.split(';');
//             var datasource = [];
//
//             for (var i = 0, length = arr.length; i < length; i++) {
//                 var item = arr[i].split('|');
//                 datasource.push({ id: item[1] === undefined ? item[0] : item[1], name: item[0] });
//             }
//
//             self.redraw(datasource);
//         };
//
//         self.setter = function(value) {
//             self.element.find('input').each(function() {
//                 this.checked = value && value.indexOf(self.parser(this.value)) !== -1;
//             });
//         };
//
//         self.redraw = function(arr) {
//             var builder = [];
//             var kn = self.attr('data-source-text') || 'name';
//             var kv = self.attr('data-source-value') || 'id';
//
//             for (var i = 0, length = arr.length; i < length; i++) {
//                 var item = arr[i];
//                 if (typeof(item) === 'string')
//                     builder.push(template({ id: item, name: item }));
//                 else
//                     builder.push(template({ id: item[kv] === undefined ? item[kn] : item[kv], name: item[kn] }));
//             }
//
//             if (!builder.length)
//                 return;
//
//             builder.push('<div class="clearfix"></div><div class="col-md-12"><div class="ui-checkboxlist-selectall"><a href="javascript:void(0)"><i class="fa fa-object-group mr5"></i>{0}</a></div></div>'.format(self.attr('data-button')));
//             self.html(builder.join(''));
//             return self;
//         };
//
//         var datasource = self.attr('data-source');
//         if (datasource) {
//             self.watch(datasource, function(path, value) {
//                 if (!value)
//                     value = [];
//                 self.redraw(value);
//             }, true);
//         }
//     };
// });
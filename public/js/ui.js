// Source: www.componentator.com

/**
 * Textbox
 * @version 3.0.0
 */
COMPONENT('textbox', function() {

    var self = this;
    var isRequired = self.attr('data-required') === 'true';
    var validation = self.attr('data-validate');
    var input;
    var container;

    self.validate = function(value) {

        if (input.prop('disabled') || !isRequired)
            return true;

        var type = typeof(value);

        if (type === 'undefined' || type === 'object')
            value = '';
        else
            value = value.toString();

        EXEC('$calendar.hide');

        switch (self.type) {
            case 'email':
                return value.isEmail();
            case 'url':
                return value.isURL();
            case 'currency':
            case 'number':
                return value > 0;
        }

        return validation ? self.evaluate(value, validation, true) ? true : false : value.length > 0;
    };

    !isRequired && self.noValid();

    self.required = function(value) {
        self.element.find('.ui-textbox-label').toggleClass('ui-textbox-label-required', value);
        self.noValid(!value);
        isRequired = value;
        !value && self.state(1, 1);
    };

    self.make = function() {

        var attrs = [];
        var builder = [];
        var tmp;

        attrs.attr('type', self.type === 'password' ? self.type : self.attr('type') || 'text');
        attrs.attr('placeholder', self.attr('data-placeholder'));
        attrs.attr('maxlength', self.attr('data-maxlength'));
        attrs.attr('data-jc-keypress', self.attr('data-jc-keypress'));
        attrs.attr('data-jc-keypress-delay', self.attr('data-jc-keypress-delay'));
        attrs.attr('autocomplete', self.attr('autocomplete'));
        attrs.attr('autofocus', self.attr('autofocus'));
        attrs.attr('id', self.attr('id'));
        attrs.attr('data-jc-bind', '');
        attrs.attr('name', self.attr('name') || self.path);

        tmp = self.attr('data-align');
        tmp && attrs.attr('class', 'ui-' + tmp);
        self.attr('data-autofocus') === 'true' && attrs.attr('autofocus');

        var content = self.html();
        var icon = self.attr('data-icon');
        var icon2 = self.attr('data-control-icon');
        var increment = self.attr('data-increment') === 'true';

        builder.push('<input {0} />'.format(attrs.join(' ')));

        if (!icon2 && self.type === 'date')
            icon2 = 'fa-calendar';
        else if (self.type === 'search') {
            icon2 = 'fa-search ui-textbox-control-icon';
            self.element.on('click', '.ui-textbox-control-icon', function() {
                self.$stateremoved = false;
                $(this).removeClass('fa-times').addClass('fa-search');
                self.set('');
            });
            self.getter2 = function(value) {
                if (self.$stateremoved && !value)
                    return;
                self.$stateremoved = value ? false : true;
                self.find('.ui-textbox-control-icon').toggleClass('fa-times', value ? true : false).toggleClass('fa-search', value ? false : true);
            };
        }

        icon2 && builder.push('<div><span class="fa {0}"></span></div>'.format(icon2));
        increment && !icon2 && builder.push('<div><span class="fa fa-caret-up"></span><span class="fa fa-caret-down"></span></div>');
        increment && self.element.on('click', '.fa-caret-up,.fa-caret-down', function(e) {
            var el = $(this);
            var inc = -1;
            if (el.hasClass('fa-caret-up'))
                inc = 1;
            self.change(true);
            self.inc(inc);
        });

        self.type === 'date' && self.element.on('click', '.fa-calendar', function(e) {
            e.preventDefault();
            window.$calendar && window.$calendar.toggle($(this).parent().parent(), self.element.find('input').val(), function(date) {
                self.set(date);
            });
        });

        if (!content.length) {
            self.element.addClass('ui-textbox ui-textbox-container');
            self.html(builder.join(''));
            input = self.find('input');
            container = self.find('.ui-textbox');
            return;
        }

        var html = builder.join('');
        builder = [];
        builder.push('<div class="ui-textbox-label{0}">'.format(isRequired ? ' ui-textbox-label-required' : ''));
        icon && builder.push('<span class="fa {0}"></span> '.format(icon));
        builder.push(content);
        builder.push(':</div><div class="ui-textbox">{0}</div>'.format(html));

        self.html(builder.join(''));
        self.element.addClass('ui-textbox-container');
        input = self.find('input');
        container = self.find('.ui-textbox');
    };

    self.state = function(type) {
        if (!type)
            return;
        var invalid = self.isInvalid();
        if (invalid === self.$oldstate)
            return;
        self.$oldstate = invalid;
        container.toggleClass('ui-textbox-invalid', invalid);
    };
});

/**
 * Textarea
 * @version 3.0.0
 */

/*
 The MIT License
 Copyright 2016 (c) Peter Širka <petersirka@gmail.com>
 */

COMPONENT('textarea', function() {

    var self = this;
    var isRequired = self.attr('data-required') === 'true';
    var input;
    var container;

    self.validate = function(value) {

        var type = typeof(value);
        if (input.prop('disabled') || !isRequired)
            return true;

        if (type === 'undefined' || type === 'object')
            value = '';
        else
            value = value.toString();

        EXEC('$calendar.hide');
        return value.length > 0;
    };

    !isRequired && self.noValid();

    self.required = function(value) {
        self.element.find('.ui-textarea-label').toggleClass('ui-textarea-label-required', value);
        self.noValid(!value);
        isRequired = value;
        !value && self.state(1, 1);
    };

    self.make = function() {

        var attrs = [];
        var builder = [];
        var tmp;

        attrs.attr('placeholder', self.attr('data-placeholder'));
        attrs.attr('maxlength', self.attr('data-maxlength'));
        attrs.attr('data-jc-bind', '');

        tmp = self.attr('data-height');
        tmp && attrs.attr('style', 'height:' + tmp);
        self.attr('data-autofocus') === 'true' && attrs.attr('autofocus');
        builder.push('<textarea {0}></textarea>'.format(attrs.join(' ')));

        var element = self.element;
        var content = element.html();

        if (!content.length) {
            self.element.addClass('ui-textarea ui-textarea-container');
            self.html(builder.join(''));
            input = self.find('textarea');
            container = self.element;
            return;
        }

        var height = self.attr('data-height');
        var icon = self.attr('data-icon');
        var html = builder.join('');

        builder = [];
        builder.push('<div class="ui-textarea-label{0}">'.format(isRequired ? ' ui-textarea-label-required' : ''));
        icon && builder.push('<span class="fa {0}"></span>'.format(icon));
        builder.push(content);
        builder.push(':</div><div class="ui-textarea">{0}</div>'.format(html));

        self.html(builder.join(''));
        self.element.addClass('ui-textarea-container');
        input = self.find('textarea');
        container = self.find('.ui-textarea');
    };

    self.state = function(type) {
        if (!type)
            return;
        var invalid = self.isInvalid();
        if (invalid === self.$oldstate)
            return;
        self.$oldstate = invalid;
        container.toggleClass('ui-textarea-invalid', invalid);
    };
});


COMPONENT('visible', function() {
	var self = this;
	var condition = self.attr('data-if');
	self.readonly();
	self.setter = function(value) {

		var is = true;

		if (condition)
			is = EVALUATE(self.path, condition);
		else
			is = value ? true : false;

		self.element.toggleClass('hidden', !is);
	};
});


/*
 The MIT License
 Copyright 2016 (c) Peter Širka <petersirka@gmail.com>
 */

COMPONENT('exec', function() {
	var self = this;
	self.readonly();
	self.blind();
	self.make = function() {
		self.element.on('click', self.attr('data-selector') || '.exec', function() {
			var el = $(this);
			var attr = el.attr('data-exec');
			attr && EXEC(attr, el);
		});
	};
});

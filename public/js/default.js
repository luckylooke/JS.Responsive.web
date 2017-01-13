$(document).ready(function() {
	$(document).on('click', '.mainmenu-button', function() {
		$(this).parent().find('nav').toggleClass('mainmenu-visible');
	});


	var actualPath = location.pathname.match(/^(\/\w{2})?(\/[a-z]*)/)[2];

	$('header nav a').removeClass('active');
	$('header nav')
		.find('a[href$="' + actualPath + '/"]')
		.eq(0)
		.addClass('active');

	console.log('dingdong', $('header nav').find('a[href$="' + actualPath + '/"]'), actualPath + '/');

	// add to data attribute on body element actual page
	$('body').attr('data-page', actualPath.charAt(0) === '/' ? actualPath.slice(1) : actualPath);

	// home
	if (actualPath == '/')
		$('header nav li:first-child a').addClass('active');
});

COMPONENT('newsletter', function() {
	var self = this;
	var button;
	var input;

	self.readonly();
	self.make = function() {

		button = self.find('button');
		input = self.find('input');

		self.element.on('keydown', 'input', function(e) {
			if (e.keyCode !== 13)
				return;
			button.trigger('click');
		});

		button.on('click', function() {

			var mail = input.val();
			if (!mail.isEmail())
				return;

			AJAX('POST /api/newsletter/', { email: input.val() }, function(response) {

				input.addClass('newsletter-success');
				input.val(self.attr('data-success'));

				setTimeout(function() {
					input.val('');
					input.removeClass('newsletter-success');
				}, 3000);
			});
		});
	};
});

COMPONENT('cookie', function() {
	var self = this;
	self.readonly();
	self.singleton();
	self.make = function() {
		var cookie = localStorage.getItem('cookie');
		if (cookie) {
			self.element.addClass('hidden');
			return;
		}

		self.element.removeClass('hidden').addClass('ui-cookie');
		self.element.append('<button>' + (self.attr('data-button') || 'OK') + '</button>');
		self.element.on('click', 'button', function() {
			localStorage.setItem('cookie', '1');
			self.element.addClass('hidden');
		});
	};
});
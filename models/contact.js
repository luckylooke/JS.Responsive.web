NEWSCHEMA('Contact').make(function(schema) {

	schema.define('firstname', 'Capitalize(40)', true);
	schema.define('lastname', 'Capitalize(40)', true);
	schema.define('email', 'Email', true);
	schema.define('subject', String);
	schema.define('message', String, true);
	// schema.define('phone', 'Phone');
	schema.define('ip', 'String(80)');

	// Saves the model into the database
	schema.setSave(function(error, model, options, callback) {

		model.id = UID();
		model.datecreated = new Date();

		// Saves to database
		NOSQL('contactforms').insert(model.$clean());

		// Returns response
		callback(SUCCESS(true));

		var builder = [];

		builder.push('<b>Created:</b><br />' + new Date().format('yyyy-MM-dd HH:mm:ss'))
		builder.push('<b>IP address:</b><br />' + model.ip);
		builder.push('<b>Name:</b><br />' + model.firstname + ' ' + model.lastname);
		builder.push('<b>Email address:</b><br />' + model.email);
		builder.push('<b>Subject:</b><br />' + model.subject);

		if (model.phone)
			builder.push('<b>Phone number:</b><br />' + model.phone);

		builder.push('<b>Message:</b><br />' + model.message);

		// Sends email
		F.logmail(CONFIG('mail-contact'), 'JS.Responsive web contact form: ' + model.subject, builder.join('\n\n')).reply(model.email);
	});
});
/** DB functions here **/
var sqlite3 = require('sqlite3');
var dbfile = "Require.db";

exports.addinDB = function( params, cb ){
	

	var info = {};
	var err = null;

	if ( params.db && params.db.type ) {
		
		var db = new sqlite3.Database( dbfile );
		db.serialize(function() {
			db.run('create table if not exists Register (name TEXT, email TEXT, strid TEXT, verified BOOLEAN)');
		
			var stmt = db.prepare("INSERT INTO Register (name, email, strid, verified) VALUES ('"+ params.name + "', '" + params.email + "', 'XXXXX', 0 )");
			stmt.run();
			stmt.finalize();
			info = { "Saved": "OK" };
		});
		
		db.close();
	} else {
		err = {
			"msg": "No DB connection"
		}
	}
	
	cb( err, info );
	
};

exports.listinDB = function( params, cb ){

	var info = [];
	var err = null;
	
	if ( params.db && params.db.type ) {

		var db = new sqlite3.Database( dbfile );
		db.serialize(function() {
			var out = [];
			db.all("SELECT name from Register", function(err, rows) {
				if (! err ) {
					cb( err, rows );
				} else {
					err = { "msg": "Error retrieving" };
					cb( err, info );
				}
			});
			
		});
		
		db.close();
	} else {
		err = { "msg": "No DB connection" };
		cb( err, info );
	}
	
};

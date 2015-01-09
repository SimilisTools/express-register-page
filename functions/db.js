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
		
			// Let's check if email
			db.all("SELECT verified from Register where email = '" + params.email + "'", function(err, rows) {

				if ( !err ) {

					if ( rows.length < 1 ) {
						var stmt = db.prepare("INSERT INTO Register (name, email, strid, verified) VALUES ('"+ params.name + "', '" + params.email + "', 'XXXXX', 0 )");
						stmt.run();
						stmt.finalize();
						info = { "msg": "Saved" };
						cb( err, info );
						db.close();
					} else {
						if ( rows[0] ) {
							if ( rows[0].verified ) {
								info = { "msg": "Validated" };
								cb( err, info );
								db.close();
							} else {
								var stmt = db.prepare("UPDATE Register SET name = '"+ params.name + "', strid = 'UUUU' where email='"+params.email+"'");
								stmt.run();
								stmt.finalize();
								info = { "msg": "Updated" };
								cb( err, info );
								db.close();
							}
						}
					}
				} else {
						err = {
							"msg": "DB Query Error "
						}
					cb( err, info );
					db.close()
				}
			});
		});
		
	} else {
		err = {
			"msg": "No DB connection"
		}
		cb( err, info );
	}

};

exports.listinDB = function( params, cb ){

	var info = [];
	var err = null;
	
	if ( params.db && params.db.type ) {

		var db = new sqlite3.Database( dbfile );
		db.serialize(function() {

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

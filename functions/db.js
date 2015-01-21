/** DB functions here **/
var sqlite3 = require('sqlite3');

exports.addinDB = function( params, cb ){
	

	var info = {};
	var err = null;

	if ( params.db && params.db.type && params.db.file ) {
		
		var db = new sqlite3.Database( params.db.file );
		db.serialize(function() {
			db.run('create table if not exists Register (name TEXT, email TEXT, strid TEXT, rmvid TEXT, verified BOOLEAN)');
		
			// Let's check if email
			db.all("SELECT verified from Register where email = '" + params.email + "'", function(err, rows) {

				if ( !err ) {

					if ( rows.length < 1 ) {
						var stmt = db.prepare("INSERT INTO Register (name, email, strid, verified) VALUES ( ?, ?, ?, 0) ", [ params.name, params.email, params.strid ] );
						stmt.run();
						stmt.finalize();
						info = { "msg": "Saved" };
						cb( err, info );
						db.close();
					} else {
						if ( rows[0] ) {
							if ( rows[0].verified ) {
								info = { "msg": "Already-verified" };
								cb( err, info );
								db.close();
							} else {
								var stmt = db.prepare("UPDATE Register SET name = ?, strid = ? where email = ? ", [ params.name, params.strid, params.email ] );
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
	
	if ( params.db && params.db.type && params.db.file ) {

		var db = new sqlite3.Database( params.db.file );
		db.serialize(function() {

			db.all("SELECT name from Register where verified=1", function(err, rows) {
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

exports.checkinDB = function( params, cb ){

	var info = [];
	var err = null;

	if ( params.db && params.db.type ) {

		if ( params.email && params.strid && params.db.file ) {
	
			var db = new sqlite3.Database( params.db.file );
			db.serialize(function() {

				db.all("SELECT verified from Register where email='" + params.email + "' AND strid='" + params.strid + "'", function(err, rows) {
					if (! err ) {
						if ( rows.length > 0 ) {
							if ( rows[0].verified ) {
								info = { "msg": "Already-verified" };
								cb( err, info );
								db.close();
							} else {
								var stmt = db.prepare("UPDATE Register SET verified = 1 where email = ? AND strid = ? ", [ params.email, params.strid ] );
								stmt.run();
								stmt.finalize();
								info = { "msg": "Verified" };
								cb( err, info );
								db.close();
							}
						} else {
							info = { "msg": "Not-exists" };
							cb( err, info );
							db.close();
						}
					} else {
						err = { "msg": "Error retrieving" };
						cb( err, info );
						db.close();
					}
				});
				
			});
			

		} else {
			err = { "msg": "No proper parameters" };
			cb( err, info );
		}
		
	} else {
		err = { "msg": "No DB connection" };
		cb( err, info );
	}
};


exports.rmvfromDB = function( params, cb ){

	var info = [];
	var err = null;

	if ( params.db && params.db.type && params.db.file ) {

		if ( params.email && params.rmvid ) {
	
			var db = new sqlite3.Database( params.db.file );
			db.serialize(function() {

				db.all("SELECT * from Register where email='" + params.email + "'", function(err, rows) {
					if (! err ) {
						if ( rows.length > 0 ) {
							var stmt = db.prepare("UPDATE Register SET rmvid = ? where email = ? ", [ params.rmvid, params.email ] );
							stmt.run();
							stmt.finalize();
							info = { "msg": "To-remove" };
							cb( err, info );
							db.close();
						} else {
							info = { "msg": "Not-exists" };
							cb( err, info );
							db.close();
						}
					} else {
						err = { "msg": "Error retrieving" };
						cb( err, info );
						db.close();
					}
				});
				
			});
			

		} else {
			err = { "msg": "No proper parameters" };
			cb( err, info );
		}
		
	} else {
		err = { "msg": "No DB connection" };
		cb( err, info );
	}
};

exports.checkRmvfromDB = function( params, cb ){
	
	var info = [];
	var err = null;

	if ( params.db && params.db.type && params.db.file ) {

		if ( params.email && params.rmvid ) {
	
			var db = new sqlite3.Database( params.db.file );
			db.serialize(function() {

				db.all("SELECT * from Register where email='" + params.email + "' AND rmvid='" + params.rmvid + "'", function(err, rows) {
					if (! err ) {
						if ( rows.length > 0 ) {
							var stmt = db.prepare("DELETE FROM Register where email = ? AND rmvid= ? ", [ params.email, params.rmvid ] );
							stmt.run();
							stmt.finalize();
							info = { "msg": "Removed" };
							cb( err, info );
							db.close();
						} else {
							info = { "msg": "Not-exists" };
							cb( err, info );
							db.close();
						}
					} else {
						err = { "msg": "Error retrieving" };
						cb( err, info );
						db.close();
					}
				});
				
			});
			

		} else {
			err = { "msg": "No proper parameters" };
			cb( err, info );
		}
		
	} else {
		err = { "msg": "No DB connection" };
		cb( err, info );
	}
};


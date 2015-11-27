var fs = require("file-system");
var Loki = require("../node_modules/lokijs/src/lokijs.js");
var LokiNativeScriptAdapter = require("../node_modules/loki-nativescript-adapter/loki-nativescript-adapter.js");

var path = fs.path.join(fs.knownFolders.currentApp().path, "database.db"),
    db = undefined;

describe("Loki", function() {
    beforeEach(function() {
        db = new Loki(path, {
            adapter: new LokiNativeScriptAdapter()
        });
    });

    afterEach(function() {
        if (fs.File.exists(path)) {
            var file = fs.File.fromPath(path); // creates the file
            file.removeSync();
        }
    });

    describe("database file", function() {
        it("should not exists", function() {
            expect(fs.File.exists(path)).toBe(false);
        });

        it("should exists", function() {
            db.saveDatabase();
            expect(fs.File.exists(path)).toBe(true);
        });
    });
});

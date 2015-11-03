var fs = require("file-system");
var observable = require("data/observable");
var Loki = require("./node_modules/lokijs/src/lokijs.js");
var LokiNativeScriptAdapter = require("./node_modules/loki-nativescript-adapter/loki-nativescript-adapter.js");

var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    function HelloWorldModel() {
        _super.call(this);
        this.counter = 42;
        this.set("log", "");

        var path = fs.path.join(fs.knownFolders.currentApp().path, "database.db");
        this.db = new Loki(path, {
            adapter: new LokiNativeScriptAdapter()
        });

        if(!fs.File.exists(path)) {
            this.logThis("Database file do not exists");
            this.initializeDatabase();
        } else {
            this.logThis("Database file exists");
            this.loadDatabase();
        }
    }
    HelloWorldModel.prototype.tapAction = function () {
        this.counter--;
        if (this.counter <= 0) {
            this.set("message", "Hoorraaay! You unlocked the NativeScript clicker achievement!");
        }
        else {
            this.set("message", this.counter + " taps left");
            this.updateItem();
        }
    };
    HelloWorldModel.prototype.initializeDatabase = function() {
        this.collection = this.db.addCollection("collection");
        this.logThis("Add collection: `collection`");
        this.item = this.collection.insert({ counter: this.counter });
        this.logThis("Insert item: `{ counter: " + this.counter + " }`");
        this.db.saveDatabase();
        this.logThis("Database saved");
        this.set("message", this.counter + " taps left");
    };
    HelloWorldModel.prototype.loadDatabase = function () {
        this.db.loadDatabase({}, function() {
            this.collection = this.db.getCollection("collection");
            this.logThis("Get collection: `collection`");
            this.logThis("Get item: `" + JSON.stringify(this.collection.data) + "`");
            this.item = this.collection.data[0];
            this.counter = this.item.counter;
            this.set("message", this.counter + " taps left");
        }.bind(this));
    };
    HelloWorldModel.prototype.updateItem = function () {
        this.item.counter = this.counter;
        this.collection.update(this.item);
        this.logThis("Update item: `{ counter: " + this.counter + " }`");
        this.db.saveDatabase();
    };
    HelloWorldModel.prototype.logThis = function (message) {
        var log = (this.get("log") != "") ? "> " + message + "\n" + this.get("log") : "> " + message;
        this.set("log", log);
    };
    return HelloWorldModel;
})(observable.Observable);
exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();

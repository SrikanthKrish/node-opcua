/*global describe, require, it*/
const should = require("should");

const factories = require("node-opcua-factory");
const generator = require("../..");

const BinaryStream = require("node-opcua-binary-stream").BinaryStream;
const makeExpandedNodeId = require("node-opcua-nodeid/src/expanded_nodeid").makeExpandedNodeId;

const encode_decode_round_trip_test = require("node-opcua-packet-analyzer/test_helpers/encode_decode_round_trip_test").encode_decode_round_trip_test;


const path = require("path");
const temporary_folder = path.join(__dirname,"../..","_test_generated");

const ExtensionObject = require("node-opcua-extension-object").ExtensionObject;

describe("ExtensionObject", function () {

    exports.MetaShapeForUnitTest_Schema = {
        name: "MetaShapeForUnitTest",
        id: factories.next_available_id(),
        fields: [
            {name: "name", fieldType: "String"},
            {name: "shape", fieldType: "ExtensionObject"},
            {name: "comment", fieldType: "String"}
        ]
    };

    const MetaShape = generator.registerObject(exports.MetaShapeForUnitTest_Schema, temporary_folder);


    const Potato_Schema_Id = 0xF00001;
    exports.Potato_Schema = {
        name: "Potato",
        id: Potato_Schema_Id,
        fields: [
            {name: "length", fieldType: "Double"},
            {name: "radius", fieldType: "Double"}

        ]
    };
    const Potato = generator.registerObject(exports.Potato_Schema, temporary_folder);

    it("should encode an object with an embedded ExtensionObject set to null ", function () {

        const shape = new MetaShape({
            name: "MyPotato",
            shape: null,
            comment: "this is a comment"
        });
        shape.encodingDefaultBinary.should.eql(makeExpandedNodeId(exports.MetaShapeForUnitTest_Schema.id));

        const stream = new BinaryStream(shape.binaryStoreSize());
        shape.encode(stream);
        encode_decode_round_trip_test(shape);
    });

    it("should encode an object with a valid embedded ExtensionObject", function () {

        const shape = new MetaShape({
            name: "Potato",
            shape: new Potato({length: 10.0, radius: 5.0}),
            comment: "this is a comment"
        });
        shape.encodingDefaultBinary.should.eql(makeExpandedNodeId(exports.MetaShapeForUnitTest_Schema.id));

        const stream = new BinaryStream(shape.binaryStoreSize());
        shape.encode(stream);

        encode_decode_round_trip_test(shape);

    });
});

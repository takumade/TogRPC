const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject  = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())

const text = process.argv[2]
client.createTodo({
    "id": -1, 
    "text": text
}, (err, response) => {
    console.log("Recieved from server: ", JSON.stringify(response))
})

// client.readTodos({}, (err, response) => {
//     console.log("Response From Server: ", JSON.stringify(response))

//     if (response.items)
//         response.items.map(i => console.log(i.text))
// })

const call = client.readTodosStream()

call.on("data", item => {
    console.log("Recieved Item from server: ", JSON.stringify(item))
})

call.on("end", e => console.log("Server done!"))
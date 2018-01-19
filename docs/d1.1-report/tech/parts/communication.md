## Communication and Interoperability

In order to achieve interoperability among different services, both within the simcore platform (e.g. among computational services) and outside (e.g. with other SPARC-cores services) the platform a stable maintainable communication model is required.
In order to establish this interprocess communication (IPC) various technologies are available.
Services can communicate synchronously with a request/response model (REST, [Apache Thrift]) or they can use asynchronous message-based communication mechanisms as the Advanced Message Queuing Protocol (AMQP).
For this review we focus on three different technologies:

- RESTful
- RPC with [Apache Thrift]
- AMQP


## RESTful API

Almost always based on the simple and familiar HTTP protocol and widely used today.
REST uses the HTTP verbs to get or manipulate resources that are represented using a URL.

***Pros***

- Simple protocol
- API easily testable from within a browser or command line
- Does not require a broker

***Cons***

- Synchronous communication only, server must always respond
- client/server must be up and running at the same time
- URL for every service must be knonw

## RPC [Apache Thrift]

A framework that supports multiple language for clients and servers by using a compiler that auto generates code from interface definitions.
Supports C++, Java, Python, Node.js, ..., and is developed by facebook.

***Pros***

- Synchronous and asychronous communication possible
- Easy integration into already existing code
- Very fast and efficient

***Cons***

- More work to be done on the client side

## AMQP

Protocol for asynchronous message based communication.
Allows clients to communicate with each other via messages using a intermediate broker.
Communication can be done point-to-point or one-to-all.

***Pros***

- Decoupling of client/server, client does not need to know server's whereabouts
- Messages are buffered, client/server do not need to be up simultaneously


***Cons***

- More parts in the system (broker)
- More work needs to be done for request/response interaction (identification system for messages)
- If broker dies, system breaks down

## Conclusions

All above mentioned technologies have characteristics that fit for different parts of simcore.
At the moment we are in favor to use RESTful APIs for the communication in between the backend and the director as well as for communication with the other cores.
For the computational backend we foresee to use messaging for job distribution and REST/RPC for communication with computational services.


[Apache Thrift]:https://thrift.apache.org/
[AMQP]: https://www.amqp.org/

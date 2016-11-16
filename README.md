![Seneca][Logo]

# seneca-mesh-aws
[![npm version][npm-badge]][npm-url]
[![Gitter chat][gitter-badge]][gitter-url]

- __Sponsor:__ [nearForm][Sponsor]
- __Node:__ 4.x, 6.x
- __Seneca:__ 3.3


This plugins makes using [seneca-mesh](https://github.com/senecajs/seneca-mesh) on aws ec2 instances a little easier.

Becasue aws networking doesn't support multicast seneca-mesh can't discover peers automatically and thus needs a different strategy to detect and connect to other nodes.

The simplest method is to know in advance the ip address of some base nodes, but having fixed ip addresses is inconvenient and doesnt scale well.

This plugin uses this approach but gets the ip addresses of the base nodes from the aws ec2 apis and properly configures seneca-mesh with that data.

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].

If you are new to Seneca in general, please take a look at [senecajs.org][]. We have
everything from tutorials to sample apps to help get you up and running quickly.


## Install
```
npm install seneca-balance-client
npm install seneca-mesh-aws
```

## Usage

### In your code

For the complete usage please check seneca-mesh documentation as seneca-mesh-aws is configured in the same way:

```js
require('seneca')()
  .use('mesh-aws', { ... options ... })
```

Two additional options are supported:

- `aws` contains options for the aws-sdk. This will include the aws region and credentials, if needed (see here on how to configure ec2 instances that don't require credentials )
- `baseTags` seneca-mesh-aws uses tags to identify ec2 instances that host base nodes, by default uses `{mesh:'base'}`

### EC2 Instances

There are only two requirements on the actual EC2 instances, plus an optional one:
- the machines needs to be able to comunicate each other on the private ip address. The easiest way to do this is by using the same security group for each machin and allow all traffic between machines in the same group
- the instances that host a base node need to have a specific tag, by default `mesh=base`
- (optional) assign to the instances a IAM role with read-only access to aws api so that you won't need to use api keys and store them on the instances (seneca-mesh-aws sends a single api request at boot time to load the ip addresses of the base nodes)

## How it works

On boot time seneca-mesh-aws sends a request using the aws sdk to get all EC2 instances currently running with a specific tag and then extract the private ip address for each of them.

The standard seneca-mesh plugin is then configured with this specifi settings:
- the host is set to the private ip of the current instance in order to correctly advertise the node location on the mesh
- if the node is a base, the port is set to a default 39000
- the list of bases is provided: it is obtained using the private ip retrieved from the aws api and the default port 39000

This way seneca-mesh is able to find the base nodes and join them, thus joining the entire mesh network


## Contributing
The [Senecajs org][] encourage open participation. If you feel you can help in any way,
be it with documentation, examples, extra testing, or new features please get in touch.


## License
Copyright (c) 2013 - 2016, Paolo Chiodi and other contributors.
Licensed under [MIT][].

[Sponsor]: http://nearform.com
[Logo]: http://senecajs.org/files/assets/seneca-logo.png
[npm-badge]: https://badge.fury.io/js/seneca-mesh-aws.svg
[npm-url]: https://badge.fury.io/js/seneca-mesh-aws
[gitter-badge]: https://badges.gitter.im/senecajs/seneca.png
[gitter-url]: https://gitter.im/senecajs/seneca
[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
[senecajs.org]: http://senecajs.org/
[github issue]: https://github.com/senecajs-labs/seneca-mesh-aws/issues
[@senecajs]: http://twitter.com/senecajs

# clear-me-demo
The intent of this project is to demonstrate the functional pieces of
the clear-me identity solution, without having to build and install
locally.  It is currently running in S3 at:

http://clear-me-demo1.s3-website-us-west-1.amazonaws.com/

At this time it shows the MetaMask wallet's mnemonic, to allow the
viewer to see the amount of ether in the relevant accounts, and links
to both the registry and identity contracts on the rinkeby test net.

**Use npm 5.7.0 when running yarn install**

**ToDo**
1. Merge style updates with latest code.
2. Once merged, update the S3 instance.
3. Review how a clearme claim is implemented, i.e. currently encoded JWT on IPFS.
4. Research what a clear me wallet implementation will look like.  Again here a throw away demo
will be useful for illustrating API calls, and discussion in general.
5. The clearme resolver.  How should it be enhanced?  Should the ipfs address be encrypted?  How will keys and signatures
be handled?  Should they even be part of the resolver? 
6. Upgrade the solidity code to use the app.tools from maker dai.

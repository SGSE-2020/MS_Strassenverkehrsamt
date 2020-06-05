const config = {
  INTERFACE: "0.0.0.0",
  PORT_REST: 8080,
  PORT_GRPC: 50051
};

/* Start all components */
require('./components/api_rest')(config);
require('./components/api_grpc')(config);
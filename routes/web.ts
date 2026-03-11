import { Route } from "@/http";


Route.Group("/v1", function () {
  this.Route.Get("/test", "controllers/testController@someMethod");
  this.Route.Group("/nested", function () {
    this.Route.Post("/test", "controllers/testController@testMethod");
  });
  this.Route.Middleware(["middleware/test"], function () {
    this.Route.Get("/with-mw", "controllers/testController@testMethod");
  });
});

Route.Middleware([], function () {
  this.Route.Get("/no-mw", "controllers/testController@testMethod");
});

export default Route;

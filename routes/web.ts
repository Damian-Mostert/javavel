import { Route } from "@/http";

Route.Get("/", "controllers/pagesController@home");
Route.Get("/login", "controllers/pagesController@login");
Route.Get("/register", "controllers/pagesController@register");
Route.Get("/forgot-password", "controllers/pagesController@forgotPassword");
Route.Get("/error", "controllers/pagesController@error");
Route.Get("/not-found", "controllers/pagesController@notFound");

Route.Group("/api", function () {
  this.Route.Post("/login", "controllers/authController@login");
  this.Route.Post("/register", "controllers/authController@login");
  this.Route.Post(
    "/forgot-password",
    "controllers/authController@forgotPassword",
  );
  this.Route.Post(
    "/confirm-forgot-password",
    "controllers/authController@resetPassword",
  );
  Route.Middleware("auth", function () {
    this.Route.Post("/profile", "controllers/authController@profile");
    this.Route.Post("/logout", "controllers/authController@logout");
  });
});

export default Route;

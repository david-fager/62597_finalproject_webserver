package Javalin;

import brugerautorisation.data.Bruger;
import brugerautorisation.transport.rmi.Brugeradmin;
import common.ResponseObject;
import common.rmi.SkeletonRMI;
import io.javalin.Javalin;
import io.javalin.http.InternalServerErrorResponse;
import io.javalin.http.ServiceUnavailableResponse;
import io.javalin.http.UnauthorizedResponse;
import org.eclipse.jetty.http.HttpStatus;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.UUID;

public class Server {
    private final DateFormat DF = new SimpleDateFormat("[dd-MM-yyyy HH:mm:ss]");
    private Javalin app;
    private SkeletonRMI databaseServer;
    private Brugeradmin javabogServer;
    private HashMap<String, UserProfile> sessions = new HashMap<>();

    public Server(SkeletonRMI databaseServer, Brugeradmin javabogServer) {
        this.databaseServer = databaseServer;
        this.javabogServer = javabogServer;
    }

    private String getCurrentTime() {
        return DF.format(Calendar.getInstance().getTimeInMillis());
    }

    public void initialize() {
        javalinSetup();
        paths();
    }

    private void javalinSetup() {
        // Configuration of the javalin server
        app = Javalin.create(config -> {
            config.addStaticFiles("web");
        });

        // Starting the javalin server on port (80)
        app.start(80);

        app.before(ctx -> {
            System.out.println(getCurrentTime() + " Received '" + ctx.method() + "' on URL:" + ctx.url()
                    + " containing pathparams:" + ctx.pathParamMap() + " queryparams:" + ctx.queryParamMap()
                    + " formparams:" + ctx.formParamMap() + " cookies:" + ctx.cookieMap());
        });
    }

    private void paths() {

        app.get("/login", context -> {
            context.redirect("/");
        });

        app.post("/login", context -> {
            String username = context.queryParam("username");
            String password = context.queryParam("password");

            try {
                Bruger bruger = javabogServer.hentBruger(username, password);
                if (bruger != null) {
                    if (bruger.brugernavn.equals(username) && bruger.adgangskode.equals(password)) {
                        UserProfile userProfile = new UserProfile();
                        userProfile.setUsername(username);

                        // Giving the legitimate user their uuid
                        String javalin_uuid = UUID.randomUUID().toString();
                        while (sessions.containsKey(javalin_uuid)) {
                            javalin_uuid = UUID.randomUUID().toString();
                        }
                        userProfile.setJavalin_uuid(javalin_uuid);

                        // If the database responds successfully, then add its uuid of the user to the userprofile
                        ResponseObject ro = databaseServer.login(username, password);
                        if (ro != null) {
                            if (ro.getStatusCode() == 0) {
                                userProfile.setDatabase_uuid(ro.getResponseString());
                            } else {
                                System.out.println(getCurrentTime() + " Unable to login to the database server, error: " + ro.getStatusCode() + " " + ro.getStatusMessage());
                            }
                        }

                        sessions.put(javalin_uuid, userProfile);
                        System.out.println(getCurrentTime() + " User logged in and got cookie uuid: " + javalin_uuid + " and db uuid:" + sessions.get(javalin_uuid).toString());
                        context.cookieStore("myfridge_uuid", javalin_uuid);
                        context.status(HttpStatus.OK_200);
                    } else {
                        System.out.println(getCurrentTime() + " User failed to login");
                        throw new UnauthorizedResponse("Failed login");
                    }
                }
            } catch (Exception e) {
                System.out.println(getCurrentTime() + " Exception: " + e.getMessage());
                throw new UnauthorizedResponse("Authentication error");
            }
        });

        app.post("/login/forgot", context -> {
            String username = context.queryParam("username");
            try {
                javabogServer.sendGlemtAdgangskodeEmail(username,"Send fra MyFridge");
                context.status(HttpStatus.OK_200);
            } catch (Exception e) {
                System.out.println(getCurrentTime() + " /login/forgot exception: " + e.getMessage());
                throw new ServiceUnavailableResponse("Unexpected error :(");
            }
        });

        app.get("/fridge", context -> {
            // TODO: 'Hente' hovedsiden, hvor items bliver displayed
            // TODO: Denne er muligvis ikke nødvendig
        });

        app.get("/fridge/items", context -> {
            // TODO: Hente fra database programmet, de items som brugeren har
        });

        app.get("/user", context -> {
            // TODO: 'Hente' bruger siden, hvor brugeren kan se sine informationer
            // TODO: Denne er muligvis ikke nødvendig
        });

        app.put("/user/change-password", context -> {
            // TODO: Kalde på brugerautorisation for at skifte brugerens password
        });







        /*
        app.get("/", context -> {
            context.redirect("/login");
        });

        app.get("/login", context -> {
                    context.render("webapp/login.html");
        });

        app.get("/login/:username", context -> {
            javaprogram.informConnect();

            String username = context.pathParam("username");
            String password = context.queryParam("password");

            boolean success = javaprogram.login(username, password);
            if (success) {
                System.out.println(getTime() + "Login success");
                context.status(HttpStatus.ACCEPTED_202);
                context.render("webapp/indes.html");
            } else {
                System.out.println(getTime() + "Login failed");
                context.status(HttpStatus.UNAUTHORIZED_401);
            }

        });

        app.get("/login/forgot", context -> {
            context.render("webapp/index.html");
        });

        app.get("/login/forgot/:username", context -> {
            String username = context.pathParam("username");
            String message = context.queryParam("message");
            if (message == null) {
                message = "";
            }

            boolean success = javaprogram.forgotPassword(username, message);
            if (success) {
                context.status(HttpStatus.OK_200);
            } else {
                context.status(HttpStatus.SERVICE_UNAVAILABLE_503);
            }
        });

        app.get("/account/changePassword/:oldPassword", context -> {
            context.status(HttpStatus.UNAUTHORIZED_401).result("<h1>401 Unauthorized</h1>You are not authorized to see this page.").contentType("text/html");

            String oldPassword = context.pathParam("oldPassword");
            String newPassword = context.queryParam("newPassword");

            Bruger bruger = javaprogram.changePassword(oldPassword, newPassword);
            if (bruger != null) {
                context.status(HttpStatus.ACCEPTED_202);
            } else {
                context.status(HttpStatus.SERVICE_UNAVAILABLE_503);
            }
        });
        */
    }

}

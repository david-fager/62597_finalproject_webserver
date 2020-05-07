package Javalin;

import brugerautorisation.transport.rmi.Brugeradmin;
import common.ResponseObject;
import common.rmi.SkeletonRMI;
import io.javalin.Javalin;

import java.rmi.RemoteException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;

public class Server {
    private final DateFormat DF = new SimpleDateFormat("[dd-MM-yyyy HH:mm:ss] ");
    private final String STIPULATEDSERVERUUID = "80c95be1-322a-46b5-9f12-f30d3f8a9b78";
    private Javalin app;
    private SkeletonRMI databaseServer;
    private Brugeradmin javabogServer;

    public Server(SkeletonRMI databaseServer, Brugeradmin javabogServer) {
        this.databaseServer = databaseServer;
        this.javabogServer = javabogServer;
    }

    private String getCurrentTime() {
        return DF.format(Calendar.getInstance().getTimeInMillis());
    }

    public void initialize() {
        javalinSetup();
        loginPaths();
        fridgePaths();
    }

    private void javalinSetup() {
        // Configuration of the connection with the database program
        try {
            ResponseObject ro = databaseServer.serverConnect(STIPULATEDSERVERUUID);
            if (ro.getStatusCode() != 0) {
                System.out.println(getCurrentTime() + " Error connecting to the database program: " + ro.getStatusMessage());
            }
        } catch (RemoteException e) {
            e.printStackTrace();
        }

        // Configuration of the javalin server
        app = Javalin.create(config -> {
            config.addStaticFiles("web");
        });

        // Starting the javalin server on port (80)
        app.start(80);
    }

    private void loginPaths() {

        try {
            ResponseObject ro = databaseServer.getUsers(STIPULATEDSERVERUUID);
            if (ro.getStatusCode() == 0) {
                System.out.println(ro.getResponseArraylist().toString());
            }
        } catch (RemoteException e) {
            e.printStackTrace();
        }



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

    private void fridgePaths() {

    }

}

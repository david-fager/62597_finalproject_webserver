package Javalin;

import brugerautorisation.data.Bruger;
import brugerautorisation.transport.rmi.Brugeradmin;
import common.ResponseObject;
import common.rmi.SkeletonRMI;
import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.InternalServerErrorResponse;
import io.javalin.http.ServiceUnavailableResponse;
import io.javalin.http.UnauthorizedResponse;
import org.eclipse.jetty.http.HttpStatus;

import java.rmi.RemoteException;
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
    private final String UUID_COOKIE_NAME = "myfridge_uuid";

    public Server(SkeletonRMI databaseServer, Brugeradmin javabogServer) {
        this.databaseServer = databaseServer;
        this.javabogServer = javabogServer;
    }

    public String logInfo(String uuid) {
        if (uuid == null || uuid.equals(""))
            return DF.format(Calendar.getInstance().getTimeInMillis()) + " (unknown)";

        if (sessions.get(uuid) != null)
            return DF.format(Calendar.getInstance().getTimeInMillis()) + " (" + sessions.get(uuid).getUsername() + ")";
        else
            return DF.format(Calendar.getInstance().getTimeInMillis()) + " (" + uuid + ")";
    }

    private void callLog(Context ctx, String uuid) {
        System.out.println(logInfo(uuid) + " Received '" + ctx.method() + "' on URL:" + ctx.url()
                + " containing pathparams:" + ctx.pathParamMap() + " queryparams:" + ctx.queryParamMap()
                + " formparams:" + ctx.formParamMap());
    }

    public void initialize() {
        javalinSetup();
        loginPaths();
        fridgePaths();
        userPaths();
        otherPaths();
    }

    private void javalinSetup() {
        // Configuration of the javalin server
        app = Javalin.create(config -> {
            config.addStaticFiles("web");
        });

        // Starting the javalin server on port (80)
        app.start(80);

        /*
        app.before(ctx -> {
            System.out.println(getCurrentTime() + " Received '" + ctx.method() + "' on URL:" + ctx.url()
                    + " containing pathparams:" + ctx.pathParamMap() + " queryparams:" + ctx.queryParamMap()
                    + " formparams:" + ctx.formParamMap());
        });
        */
    }

    private void validateUser(String uuid_cookie) {
        // If the user does not have a javalin userprofile, then they should not be allowed to do anything
        if (!sessions.containsKey(uuid_cookie)) {
            System.out.println(logInfo("") + " Throwing error: unauthorized user attempted to call database");
            throw new UnauthorizedResponse("Unauthorized");
        }
        // If the user does not have a uuid in the database program, then no items can be fetched
        if (sessions.get(uuid_cookie).getDatabase_uuid() == null) {
            System.out.println(logInfo(uuid_cookie) + " Throwing error: user does not have a database uuid");
            throw new ServiceUnavailableResponse("User has no database uuid");
        }
        // Checking if the user is old in the database program
        ResponseObject ro = null;
        try {
            ro = databaseServer.validateUUID(sessions.get(uuid_cookie).getDatabase_uuid());
            if (ro != null) {
                if (ro.getStatusCode() == 4) {
                    System.out.println(logInfo(uuid_cookie) + " Throwing error: database requires re-login, it responded: " + ro.getStatusMessage());
                    throw new UnauthorizedResponse("Unauthorized");
                } else if (ro.getStatusCode() == 3) {
                    System.out.println(logInfo(uuid_cookie) + " Throwing error: database did not recognize the user, it responded: " + ro.getStatusMessage());
                    throw new UnauthorizedResponse("Unauthorized");
                } else if (ro.getStatusCode() != 0) {
                    System.out.println(logInfo(uuid_cookie) + " Throwing error: database had an error, it responded: " + ro.getStatusMessage());
                    throw new InternalServerErrorResponse("Database had an error");
                }
            }
            //System.out.println(logInfo(uuid_cookie) + " User was successfully validated");
        } catch (RemoteException e) {
            System.out.println(logInfo(uuid_cookie) + " Throwing exception: " + e.getMessage());
            throw new UnauthorizedResponse("Unauthorized");
        }
    }


    // All the login paths are here
    private void loginPaths() {

        app.post("/login", context -> {
            callLog(context, "");

            String username = context.queryParam("username");
            String password = context.queryParam("password");

            try {
                Bruger bruger = javabogServer.hentBruger(username, password);
                if (bruger != null) {
                    if (bruger.brugernavn.equals(username) && bruger.adgangskode.equals(password)) {
                        UserProfile userProfile = new UserProfile();
                        userProfile.setUsername(username);

                        // Giving the legitimate user their uuid
                        String uuid_cookie = UUID.randomUUID().toString();
                        while (sessions.containsKey(uuid_cookie)) {
                            uuid_cookie = UUID.randomUUID().toString();
                        }
                        userProfile.setJavalin_uuid(uuid_cookie);

                        // If the database responds successfully, then add its uuid of the user to the userprofile
                        ResponseObject ro = databaseServer.login(username, password);
                        if (ro != null) {
                            if (ro.getStatusCode() == 0) {
                                userProfile.setDatabase_uuid(ro.getResponseString());
                                ro = databaseServer.createUser(userProfile.getDatabase_uuid(), username);
                                if (ro != null && ro.getStatusCode() == 0) {
                                    System.out.println(logInfo(uuid_cookie) + " Database program created new user");
                                } else {
                                    System.out.println(logInfo(uuid_cookie) + " Database program unable to create new user");
                                }
                            } else {
                                System.out.println(logInfo(uuid_cookie) + " Unable to login to the database server, error: " + ro.getStatusCode() + " " + ro.getStatusMessage());
                            }
                        } else {
                            System.out.println(logInfo(uuid_cookie) + " Database server sent at null object");
                        }

                        userProfile.setIp(context.ip());
                        sessions.put(uuid_cookie, userProfile);
                        System.out.println(logInfo(uuid_cookie) + " Replying with HTTP status 200(OK): made new user:" + sessions.get(uuid_cookie).toString());
                        context.cookieStore(UUID_COOKIE_NAME, uuid_cookie);
                        context.status(HttpStatus.OK_200);
                    } else {
                        System.out.println(logInfo("") + " Throwing error: user failed to login");
                        throw new UnauthorizedResponse("Failed login");
                    }
                }
            } catch (Exception e) {
                System.out.println(logInfo("") + " Throwing exception: " + e.getMessage());
                throw new UnauthorizedResponse("Authentication error");
            }
        });

        app.get("/login", context -> {
            callLog(context, "");
            System.out.println(logInfo("") + " Redirecting to path: /");
            context.redirect("/");
        });

        app.post("/login/returning", context -> {
            String uuid_cookie = context.cookieStore(UUID_COOKIE_NAME);
            callLog(context, uuid_cookie);

            if (uuid_cookie != null && sessions.get(uuid_cookie) != null && !sessions.get(uuid_cookie).getDatabase_uuid().equals("")) {
                ResponseObject ro = databaseServer.validateUUID(sessions.get(uuid_cookie).getDatabase_uuid());
                if (ro != null) {
                    if (ro.getStatusCode() == 0) {
                        System.out.println(logInfo(uuid_cookie) + " Replying with HTTP status 202(accepted): user was recognized and is a returning user");
                        context.status(HttpStatus.ACCEPTED_202);
                        return;
                    }
                }
            }

            System.out.println(logInfo("") + " Throwing error: user is not a returning user");
            throw new UnauthorizedResponse("User is not a returning user");
        });

        app.post("/login/forgot", context -> {
            callLog(context, "");

            String username = context.queryParam("username");

            try {
                javabogServer.sendGlemtAdgangskodeEmail(username,"Send fra MyFridge");
                System.out.println(logInfo("") + " Replying with HTTP status 200(OK): mail sent");
                context.status(HttpStatus.OK_200);
            } catch (Exception e) {
                System.out.println(logInfo("") + " Throwing exception: " + e.getMessage());
                throw new ServiceUnavailableResponse("Unexpected error :(");
            }

        });

    }


    // All the fridge paths are here
    public void fridgePaths() {

        app.get("/fridge/items", context -> {
            String uuid_cookie = context.cookieStore(UUID_COOKIE_NAME);
            validateUser(uuid_cookie);
            callLog(context, uuid_cookie);

            ResponseObject ro = databaseServer.getUser(sessions.get(uuid_cookie).database_uuid,sessions.get(uuid_cookie).username);
            if (ro.getStatusCode() == 0) {
                int fridgeID = Integer.parseInt(ro.getResponseArraylist().get(1)[1]);
                sessions.get(uuid_cookie).setFridgeID(fridgeID);

                ro = databaseServer.getFridgeContents(sessions.get(uuid_cookie).database_uuid, fridgeID);
                if (ro.getStatusCode() == 0) {
                    System.out.println(logInfo(uuid_cookie) + " Replying with a JSON object containing all user items");
                    context.status(HttpStatus.OK_200);
                    context.json(ro.getResponseArraylist());
                    return;
                }
            }

            throw new InternalServerErrorResponse("Failed finding user items");
        });

        app.post("/fridge/new-item", context -> {
            String uuid_cookie = context.cookieStore(UUID_COOKIE_NAME);
            validateUser(uuid_cookie);
            callLog(context, uuid_cookie);

            String itemName = context.formParamMap().get("item_name").get(0);
            int itemAmount = Integer.parseInt(context.formParamMap().get("item_amount").get(0));
            int itemType = Integer.parseInt(context.formParamMap().get("item_type").get(0));
            String itemDate = context.formParamMap().get("item_date").get(0);

            ResponseObject ro1 = databaseServer.createItem(sessions.get(uuid_cookie).getDatabase_uuid(), itemName, itemType);
            if (ro1 != null && ro1.getStatusCode() == 0) {
                ResponseObject ro2 = databaseServer.createFridgeRow(
                        sessions.get(uuid_cookie).getDatabase_uuid(), sessions.get(uuid_cookie).fridgeID,
                        Integer.parseInt(ro1.getResponseString()), itemDate, itemAmount);
                if (ro2 != null && ro2.getStatusCode() == 0) {
                    System.out.println(logInfo(uuid_cookie) + " Replying with HTTP status 201(created): new user item was created");
                    context.status(HttpStatus.CREATED_201);
                    return;
                }
            }

            System.out.println(logInfo(uuid_cookie) + " Replying with an error: failed to create the new user item");
            throw new InternalServerErrorResponse("Failed to create the new user item");
        });

        app.get("/fridge/new-item/types", context -> {
            String uuid_cookie = context.cookieStore(UUID_COOKIE_NAME);
            validateUser(uuid_cookie);
            callLog(context, uuid_cookie);

            ResponseObject ro = databaseServer.getTypes(sessions.get(uuid_cookie).getDatabase_uuid());
            if (ro != null && ro.getStatusCode() == 0) {
                System.out.println(logInfo(uuid_cookie) + " Replying with a JSON object containing available types");
                context.status(HttpStatus.OK_200);
                context.json(ro.getResponseArraylist());
                return;
            }

            System.out.println(logInfo(uuid_cookie) + " Throwing error: failed to load types");
            throw new InternalServerErrorResponse("Failed to load types");
        });

        app.delete("/fridge/delete-item", context -> {
            String uuid_cookie = context.cookieStore(UUID_COOKIE_NAME);
            validateUser(uuid_cookie);
            callLog(context, uuid_cookie);

            int itemID = Integer.parseInt(context.queryParam("item-ID"));
            ResponseObject ro1 = databaseServer.deleteFridgeRow(sessions.get(uuid_cookie).getDatabase_uuid(),sessions.get(uuid_cookie).fridgeID,itemID);
            if (ro1 != null && ro1.getStatusCode() == 0) {
                ResponseObject ro2 = databaseServer.deleteItem(sessions.get(uuid_cookie).getDatabase_uuid(), itemID);
                if (ro2 != null && ro2.getStatusCode() == 0) {
                    System.out.println(logInfo(uuid_cookie) + " Replying with HTTP status 200(OK): deleted item");
                    context.status(HttpStatus.OK_200);
                    return;
                }
            }

            System.out.println(logInfo(uuid_cookie) + " Throwing error: failed to delete the item");
            throw new InternalServerErrorResponse("Failed to delete the item");
        });

    }


    // All user paths are here
    public void userPaths() {

        app.get("/user/info", context -> {
            String uuid_cookie = context.cookieStore(UUID_COOKIE_NAME);
            validateUser(uuid_cookie);
            callLog(context, uuid_cookie);

            // Copying the session userprofile info, to mask the actual database uuid6
            UserProfile up = new UserProfile();
            up.setJavalin_uuid(sessions.get(uuid_cookie).getJavalin_uuid());
            up.setDatabase_uuid("**********");
            up.setUsername(sessions.get(uuid_cookie).getUsername());
            up.setIp(sessions.get(uuid_cookie).getIp());

            System.out.println(logInfo(uuid_cookie) + " Replying with a JSON object containing the users information");
            context.json(up);
        });

        app.put("/user/change-password", context -> {
            String uuid_cookie = context.cookieStore(UUID_COOKIE_NAME);
            validateUser(uuid_cookie);
            callLog(context, uuid_cookie);

            String oldpassword = context.queryParam("oldpassword");
            String newpassword = context.queryParam("newpassword");

            try {
                javabogServer.ændrAdgangskode(sessions.get(uuid_cookie).getUsername(),oldpassword,newpassword);
                System.out.println(logInfo(uuid_cookie) + " Replying with HTTP status 200(OK): changed password");
                context.status(HttpStatus.OK_200);
            } catch (Exception e) {
                System.out.println(logInfo(uuid_cookie) + " Throwing exception: " + e.getMessage());
                throw new InternalServerErrorResponse("Javabog threw exception.");
            }
        });

    }


    // All other paths are here
    public void otherPaths() {

        app.get("/", context -> {
            callLog(context, "");
            System.out.println(logInfo("") + " Replying with the index.html");
            context.render("web/index.html");
        });

    }

}

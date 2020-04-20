package Javalin;

import io.javalin.Javalin;

public class Server {
    private final boolean DEBUGGING = true; // Set whether to debug or not here
    private Javalin app = null;

    public void initialize() {
        javalinSetup();
        loginPaths();
        fridgePaths();
    }

    private void javalinSetup() {
        // Configuration of the server
        app = Javalin.create(config -> {
            config.addStaticFiles("web");
        });

        // Starting the server on port (80)
        app.start(80);
    }

    private void loginPaths() {

    }

    private void fridgePaths() {

    }

}
